// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import '../interfaces/Aave.sol';
import '../Constants.sol';

contract AaveActions {
  receive() external payable {}

  // ---- Helper Functions ---- //

  function _approveLendingPoolCore(
    address _lendingPoolCore,
    address _reserve,
    uint256 _amount
  ) internal {
    require(
      IERC20(_reserve).approve(_lendingPoolCore, _amount),
      'aave-lendingpoolcore-approve-failed'
    );
  }

  // ---- External functions ---- //

  function deposit(
    address _lendingPool,
    address _lendingPoolCore,
    address _user,
    address _reserve,
    uint256 _amount
  ) external payable {
    ILendingPool lendingPool = ILendingPool(_lendingPool);

    if (_reserve == Constants.ETH_ADDRESS) {
      lendingPool.deposit{value: _amount}(_reserve, _amount, uint16(0));
    } else {
      _approveLendingPoolCore(_lendingPoolCore, _reserve, _amount);
      lendingPool.deposit(_reserve, _amount, uint16(0));
    }

    // https://docs.aave.com/developers/developing-on-aave/the-protocol/lendingpool#getreservedata
    (, , , , , , , , , bool usageAsCollateralEnabled) = lendingPool
      .getUserReserveData(_reserve, _user);

    if (!usageAsCollateralEnabled) {
      lendingPool.setUserUseReserveAsCollateral(_reserve, true);
    }
  }

  function borrow(
    address _lendingPool,
    address _reserve,
    uint256 _amount,
    uint256 _interestRateMode // 1 for stable rate, 2 for variable rate
  ) external payable {
    ILendingPool lendingPool = ILendingPool(_lendingPool);
    lendingPool.borrow(_reserve, _amount, _interestRateMode, uint16(0));
  }

  function swapBorrowRateMode(address _lendingPool, address _reserve)
    external
    payable
  {
    ILendingPool(_lendingPool).swapBorrowRateMode(_reserve);
  }

  function rebalanceStableBorrowRate(
    address _lendingPool,
    address _reserve,
    address _user
  ) external payable {
    ILendingPool(_lendingPool).rebalanceStableBorrowRate(_reserve, _user);
  }

  function repay(
    address _lendingPool,
    address _lendingPoolCore,
    address _reserve,
    uint256 _amount,
    address payable _user
  ) external payable {
    ILendingPool lendingPool = ILendingPool(_lendingPool);

    if (_reserve == Constants.ETH_ADDRESS) {
      lendingPool.repay{value: _amount}(_reserve, _amount, _user);
    } else {
      _approveLendingPoolCore(_lendingPoolCore, _reserve, _amount);
      lendingPool.repay(_reserve, _amount, _user);
    }
  }

  function redeem(address _atoken, uint256 _amount) external payable {
    IAToken(_atoken).redeem(_amount);
  }
}
