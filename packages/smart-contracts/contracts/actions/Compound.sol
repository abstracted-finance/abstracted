// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../interfaces/Compound.sol";
import "../Constants.sol";

contract CompoundActions {
    // ---- Helper Functions ---- //

    function _approveCToken(address _cToken, uint256 _amount) internal {
        address underlying = ICToken(_cToken).underlying();
        require(
            IERC20(underlying).approve(_cToken, _amount),
            "compound-approved-ctoken-failed"
        );
    }

    // ---- Public Functions ---- //

    function enterMarkets(
        address _comptrollerAddress,
        address[] memory _cTokens
    ) public {
        uint256[] memory errors = IComptroller(_comptrollerAddress)
            .enterMarkets(_cTokens);

        for (uint256 i = 0; i < errors.length; i++) {
            require(errors[i] == 0, "compound-enter-markets-failed");
        }
    }

    function supply(address _cToken, uint256 _amount) public payable {
        if (_cToken == Constants.CETH_ADDRESS) {
            ICEther(_cToken).mint{value: _amount}();
        } else {
            // Approves CToken contract to call `transferFrom`
            _approveCToken(_cToken, _amount);

            require(
                ICToken(_cToken).mint(_amount) == 0,
                "compound-supply-failed"
            );
        }
    }

    function borrow(address _cToken, uint256 _amount) public {
        require(
            ICToken(_cToken).borrow(_amount) == 0,
            "compound-borrow-failed"
        );
    }

    function repayBorrow(address _cToken, uint256 _amount) public payable {
        if (_cToken == Constants.CETH_ADDRESS) {
            ICEther(_cToken).repayBorrow{value: _amount}();
        } else {
            _approveCToken(_cToken, _amount);
            require(
                ICToken(_cToken).repayBorrow(_amount) == 0,
                "compound-repay-failed"
            );
        }
    }

    function repayBorrowBehalf(
        address _recipient,
        address _cToken,
        uint256 _amount
    ) public payable {
        if (_cToken == Constants.CETH_ADDRESS) {
            ICEther(_cToken).repayBorrowBehalf{value: _amount}(_recipient);
        } else {
            _approveCToken(_cToken, _amount);
            require(
                ICToken(_cToken).repayBorrowBehalf(_recipient, _amount) == 0,
                "compound-repaybehalf-failed"
            );
        }
    }

    function redeem(address _cToken, uint256 _amount) public payable {
        require(
            ICToken(_cToken).redeem(_amount) == 0,
            "compound-redeem-failed"
        );
    }

    function redeemUnderlying(address _cToken, uint256 _amount) public payable {
        require(
            ICToken(_cToken).redeemUnderlying(_amount) == 0,
            "compound-redeem-underlying-failed"
        );
    }
}
