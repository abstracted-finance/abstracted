// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "../interfaces/Aave.sol";
import "../Constants.sol";
import {Proxy} from "../Proxy.sol";

contract AaveFlashloanReceiverBase {
    using SafeMath for uint256;

    constructor() public {}

    fallback() external {}

    receive() external payable {}

    ILendingPoolAddressesProvider
        public addressesProvider = ILendingPoolAddressesProvider(
        0x24a42fD28C976A61Df5D00D0599C34c4f90748c8
    );

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
            _destination.call{value: _amount}("");
            return;
        }

        require(
            IERC20(_reserve).transfer(_destination, _amount),
            "erc20-transfer-failed"
        );
    }
}

struct ProxyTargetData {
    address[] targets;
    bytes[] data;
}

contract AaveFlashloanAction is AaveFlashloanReceiverBase {
    // Caller of the contract
    // Should be the user proxy
    address payable private caller = payable(address(0));

    // Flashloan initiation call
    function flashLoan(
        address _reserve,
        uint256 _amount,
        bytes calldata _params
    ) external {
        caller = msg.sender;

        ILendingPool lendingPool = ILendingPool(
            addressesProvider.getLendingPool()
        );
        // `executeOperation` will be executed by lendingPool.flashLoan function
        lendingPool.flashLoan(address(this), _reserve, _amount, _params);

        caller = address(0);
    }

    // Flashloan callback function
    function executeOperation(
        address payable _reserve,
        uint256 _amount,
        uint256 _fee,
        bytes calldata _params
    ) external {
        // Make sure caller is valid
        if (caller == address(0)) {
            revert("caller-invalid-address");
        }

        // List of targets and associated data
        ProxyTargetData memory ptd = abi.decode(_params, (ProxyTargetData));

        // Transfer funds and executes sequence of transactions
        if (_reserve == Constants.ETH_ADDRESS) {
            Proxy(caller).executes{value: _amount}(ptd.targets, ptd.data);
        } else {
            _transfer(_reserve, caller, _amount);
            Proxy(caller).executes(ptd.targets, ptd.data);
        }

        // Transfer funds back to lendingPool
        _transferFundsBackToPool(_reserve, _amount.add(_fee));
    }
}
