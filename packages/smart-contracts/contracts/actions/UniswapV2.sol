// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import '../interfaces/UniswapV2.sol';
import '../Constants.sol';

contract UniswapV2Actions {
  receive() external payable {}

  // ---- Helper function ---- //
  function _approveToken(
    address _recipient,
    address _token,
    uint256 _amount
  ) internal {
    if (_token == Constants.ETH_ADDRESS) {
      return;
    }

    require(
      IERC20(_token).approve(_recipient, _amount),
      'uniswapv2-approved-failed'
    );
  }

  // Swaps an exact input for as many output
  function swapExactInForOut(
    address _uniswapv2Routerv2,
    uint256 _amountIn,
    uint256 _amountMinOut,
    address _from,
    address _to,
    address _recipient
  ) external payable {
    require(_from != _to, 'uniswapv2-from-to-same');

    uint256 deadline = now + 60;

    IUniswapV2Router02 uniswapRouter = IUniswapV2Router02(_uniswapv2Routerv2);

    // Get conversion PATH
    address[] memory path;
    address weth = uniswapRouter.WETH();

    // Judging from https://uniswap.info/home the major pairs are
    // ETH <-> ERC20 (apart from stablecoins, which are in curve.fi)
    // So, if ETH is in the equation, we'll just use that as the path
    // otherwise we'll use ETH as an intermediatery to get the output token
    if (_from == Constants.ETH_ADDRESS) {
      path = new address[](2);
      path[0] = weth;
      path[1] = _to;
    } else if (_to == Constants.ETH_ADDRESS) {
      path = new address[](2);
      path[0] = _from;
      path[1] = weth;
    } else {
      path = new address[](3);
      path[0] = _from;
      path[1] = weth;
      path[2] = _to;
    }

    // Approve token
    _approveToken(_uniswapv2Routerv2, _from, _amountIn);

    // Actual swapping happens here
    if (_from == Constants.ETH_ADDRESS) {
      uniswapRouter.swapExactETHForTokens{value: _amountIn}(
        _amountMinOut,
        path,
        _recipient,
        deadline
      );
    } else if (_to == Constants.ETH_ADDRESS) {
      uniswapRouter.swapExactTokensForETH(
        _amountIn,
        _amountMinOut,
        path,
        _recipient,
        deadline
      );
    } else {
      uniswapRouter.swapExactTokensForTokens(
        _amountIn,
        _amountMinOut,
        path,
        _recipient,
        deadline
      );
    }
  }
}
