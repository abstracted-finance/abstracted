// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "../interfaces/Aave.sol";
import "../Constants.sol";
import "../Proxy.sol";

abstract contract AaveFlashloanBase {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    ILendingPoolAddressesProvider
        public addressesProvider = ILendingPoolAddressesProvider(
        0x24a42fD28C976A61Df5D00D0599C34c4f90748c8
    );

    receive() external payable {}

    function _transferFundsBackToPool(address _reserve, uint256 _amount)
        internal
    {
        address payable core = addressesProvider.getLendingPoolCore();
        _transfer(core, _reserve, _amount);
    }

    function _transfer(
        address payable _destination,
        address _reserve,
        uint256 _amount
    ) internal {
        if (_reserve == Constants.ETH_ADDRESS) {
            (bool success, ) = _destination.call{value: _amount}("");
            require(success, "Couldn't transfer ETH");
            return;
        }
        IERC20(_reserve).safeTransfer(_destination, _amount);
    }

    function _getBalance(address _target, address _reserve)
        internal
        view
        returns (uint256)
    {
        if (_reserve == Constants.ETH_ADDRESS) {
            return _target.balance;
        }
        return IERC20(_reserve).balanceOf(_target);
    }
}

contract AaveFlashloanActions is AaveFlashloanBase {
    struct ProxyTargetData {
        address payable proxy;
        address[] targets;
        bytes[] data;
    }

    // Flashloan initiation call
    function flashLoan(
        address _aaveFlashloanActionAddress,
        address _reserve,
        uint256 _amount,
        bytes calldata _params
    ) external payable {
        // TODO: Figure out why this fails
        // address lp = addressesProvider.getLendingPool();
        ILendingPool(0x398eC7346DcD622eDc5ae82352F02bE94C62d119).flashLoan(
            _aaveFlashloanActionAddress,
            _reserve,
            _amount,
            _params
        );
    }

    // Flashloan callback function
    function executeOperation(
        address payable _reserve,
        uint256 _amount,
        uint256 _,
        bytes calldata _params
    ) external payable {
        require(
            _amount <= _getBalance(address(this), _reserve),
            "Invalid balance, was the flashLoan successful?"
        );

        // List of targets and associated data
        ProxyTargetData memory ptd = abi.decode(_params, (ProxyTargetData));
        Proxy proxy = Proxy(ptd.proxy);

        // Executes sequence of transactions
        if (_reserve == Constants.ETH_ADDRESS) {
            proxy.executes{value: _amount}(ptd.targets, ptd.data);
        } else {
            _transfer(_reserve, ptd.proxy, _amount);
            proxy.executes(ptd.targets, ptd.data);
        }
    }
}
