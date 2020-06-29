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

    receive() external payable {}

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
        address _aaveLendingPool,            // aaveAddressProvider.getLendingPool()
        address _aaveFlashloanActionAddress, // address of this contract
        address _reserve,                    // erc20 address
        uint256 _amount,                     // amount in wei
        bytes calldata _params               // ProxyTargetData
    ) external payable {
        ILendingPool(_aaveLendingPool).flashLoan(
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
        uint256 _fee,
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
            IERC20(_reserve).safeTransfer(ptd.proxy, _amount);
            proxy.executes(ptd.targets, ptd.data);
        }
    }
}
