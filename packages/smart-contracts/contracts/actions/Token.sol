// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../Constants.sol";

contract TokenActions {
    receive() external payable {}

    constructor() public {}

    function _transferETH(address recipient, uint256 amount) internal {
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "transfer-eth-failed");
    }

    function _transferERC20(
        address recipient,
        address token,
        uint256 amount
    ) internal {
        require(
            IERC20(token).transfer(recipient, amount),
            "transfer-erc20-failed"
        );
    }

    function transfer(
        address recipient,
        address token, // 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE for ETH
        uint256 amount
    ) external payable {
        if (token == Constants.ETH_ADDRESS) {
            _transferETH(recipient, amount);
        } else {
            _transferERC20(recipient, token, amount);
        }
    }
}
