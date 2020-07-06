// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;

interface ILendingPool {
  function LENDINGPOOL_REVISION() external view returns (uint256);

  function UINT_MAX_VALUE() external view returns (uint256);

  function addressesProvider() external view returns (address);

  function core() external view returns (address);

  function dataProvider() external view returns (address);

  function parametersProvider() external view returns (address);

  function initialize(address _addressesProvider) external;

  function deposit(
    address _reserve,
    uint256 _amount,
    uint16 _referralCode
  ) external payable;

  function redeemUnderlying(
    address _reserve,
    address _user,
    uint256 _amount,
    uint256 _aTokenBalanceAfterRedeem
  ) external;

  function borrow(
    address _reserve,
    uint256 _amount,
    uint256 _interestRateMode,
    uint16 _referralCode
  ) external;

  function repay(
    address _reserve,
    uint256 _amount,
    address _onBehalfOf
  ) external payable;

  function swapBorrowRateMode(address _reserve) external;

  function rebalanceStableBorrowRate(address _reserve, address _user) external;

  function setUserUseReserveAsCollateral(
    address _reserve,
    bool _useAsCollateral
  ) external;

  function liquidationCall(
    address _collateral,
    address _reserve,
    address _user,
    uint256 _purchaseAmount,
    bool _receiveAToken
  ) external payable;

  function flashLoan(
    address _receiver,
    address _reserve,
    uint256 _amount,
    bytes calldata _params
  ) external;

  function getReserveConfigurationData(address _reserve)
    external
    view
    returns (
      uint256 ltv,
      uint256 liquidationThreshold,
      uint256 liquidationBonus,
      address interestRateStrategyAddress,
      bool usageAsCollateralEnabled,
      bool borrowingEnabled,
      bool stableBorrowRateEnabled,
      bool isActive
    );

  function getReserveData(address _reserve)
    external
    view
    returns (
      uint256 totalLiquidity,
      uint256 availableLiquidity,
      uint256 totalBorrowsStable,
      uint256 totalBorrowsVariable,
      uint256 liquidityRate,
      uint256 variableBorrowRate,
      uint256 stableBorrowRate,
      uint256 averageStableBorrowRate,
      uint256 utilizationRate,
      uint256 liquidityIndex,
      uint256 variableBorrowIndex,
      address aTokenAddress,
      uint40 lastUpdateTimestamp
    );

  function getUserAccountData(address _user)
    external
    view
    returns (
      uint256 totalLiquidityETH,
      uint256 totalCollateralETH,
      uint256 totalBorrowsETH,
      uint256 totalFeesETH,
      uint256 availableBorrowsETH,
      uint256 currentLiquidationThreshold,
      uint256 ltv,
      uint256 healthFactor
    );

  function getUserReserveData(address _reserve, address _user)
    external
    view
    returns (
      uint256 currentATokenBalance,
      uint256 currentBorrowBalance,
      uint256 principalBorrowBalance,
      uint256 borrowRateMode,
      uint256 borrowRate,
      uint256 liquidityRate,
      uint256 originationFee,
      uint256 variableBorrowIndex,
      uint256 lastUpdateTimestamp,
      bool usageAsCollateralEnabled
    );

  function getReserves() external view returns (address[] memory);
}

interface ILendingPoolCore {
  function CORE_REVISION() external view returns (uint256);

  function addressesProvider() external view returns (address);

  function lendingPoolAddress() external view returns (address);

  function reservesList(uint256) external view returns (address);

  function initialize(address _addressesProvider) external;

  function updateStateOnDeposit(
    address _reserve,
    address _user,
    uint256 _amount,
    bool _isFirstDeposit
  ) external;

  function updateStateOnRedeem(
    address _reserve,
    address _user,
    uint256 _amountRedeemed,
    bool _userRedeemedEverything
  ) external;

  function updateStateOnFlashLoan(
    address _reserve,
    uint256 _availableLiquidityBefore,
    uint256 _income,
    uint256 _protocolFee
  ) external;

  function updateStateOnBorrow(
    address _reserve,
    address _user,
    uint256 _amountBorrowed,
    uint256 _borrowFee,
    uint8 _rateMode
  ) external returns (uint256, uint256);

  function updateStateOnRepay(
    address _reserve,
    address _user,
    uint256 _paybackAmountMinusFees,
    uint256 _originationFeeRepaid,
    uint256 _balanceIncrease,
    bool _repaidWholeLoan
  ) external;

  function updateStateOnSwapRate(
    address _reserve,
    address _user,
    uint256 _principalBorrowBalance,
    uint256 _compoundedBorrowBalance,
    uint256 _balanceIncrease,
    uint8 _currentRateMode
  ) external returns (uint8, uint256);

  function updateStateOnLiquidation(
    address _principalReserve,
    address _collateralReserve,
    address _user,
    uint256 _amountToLiquidate,
    uint256 _collateralToLiquidate,
    uint256 _feeLiquidated,
    uint256 _liquidatedCollateralForFee,
    uint256 _balanceIncrease,
    bool _liquidatorReceivesAToken
  ) external;

  function updateStateOnRebalance(
    address _reserve,
    address _user,
    uint256 _balanceIncrease
  ) external returns (uint256);

  function setUserUseReserveAsCollateral(
    address _reserve,
    address _user,
    bool _useAsCollateral
  ) external;

  function transferToUser(
    address _reserve,
    address _user,
    uint256 _amount
  ) external;

  function transferToFeeCollectionAddress(
    address _token,
    address _user,
    uint256 _amount,
    address _destination
  ) external payable;

  function liquidateFee(
    address _token,
    uint256 _amount,
    address _destination
  ) external payable;

  function transferToReserve(
    address _reserve,
    address _user,
    uint256 _amount
  ) external payable;

  function getUserBasicReserveData(address _reserve, address _user)
    external
    view
    returns (
      uint256,
      uint256,
      uint256,
      bool
    );

  function isUserAllowedToBorrowAtStable(
    address _reserve,
    address _user,
    uint256 _amount
  ) external view returns (bool);

  function getUserUnderlyingAssetBalance(address _reserve, address _user)
    external
    view
    returns (uint256);

  function getReserveInterestRateStrategyAddress(address _reserve)
    external
    view
    returns (address);

  function getReserveATokenAddress(address _reserve)
    external
    view
    returns (address);

  function getReserveAvailableLiquidity(address _reserve)
    external
    view
    returns (uint256);

  function getReserveTotalLiquidity(address _reserve)
    external
    view
    returns (uint256);

  function getReserveNormalizedIncome(address _reserve)
    external
    view
    returns (uint256);

  function getReserveTotalBorrows(address _reserve)
    external
    view
    returns (uint256);

  function getReserveTotalBorrowsStable(address _reserve)
    external
    view
    returns (uint256);

  function getReserveTotalBorrowsVariable(address _reserve)
    external
    view
    returns (uint256);

  function getReserveLiquidationThreshold(address _reserve)
    external
    view
    returns (uint256);

  function getReserveLiquidationBonus(address _reserve)
    external
    view
    returns (uint256);

  function getReserveCurrentVariableBorrowRate(address _reserve)
    external
    view
    returns (uint256);

  function getReserveCurrentStableBorrowRate(address _reserve)
    external
    view
    returns (uint256);

  function getReserveCurrentAverageStableBorrowRate(address _reserve)
    external
    view
    returns (uint256);

  function getReserveCurrentLiquidityRate(address _reserve)
    external
    view
    returns (uint256);

  function getReserveLiquidityCumulativeIndex(address _reserve)
    external
    view
    returns (uint256);

  function getReserveVariableBorrowsCumulativeIndex(address _reserve)
    external
    view
    returns (uint256);

  function getReserveConfiguration(address _reserve)
    external
    view
    returns (
      uint256,
      uint256,
      uint256,
      bool
    );

  function getReserveDecimals(address _reserve) external view returns (uint256);

  function isReserveBorrowingEnabled(address _reserve)
    external
    view
    returns (bool);

  function isReserveUsageAsCollateralEnabled(address _reserve)
    external
    view
    returns (bool);

  function getReserveIsStableBorrowRateEnabled(address _reserve)
    external
    view
    returns (bool);

  function getReserveIsActive(address _reserve) external view returns (bool);

  function getReserveIsFreezed(address _reserve) external view returns (bool);

  function getReserveLastUpdate(address _reserve)
    external
    view
    returns (uint40 timestamp);

  function getReserveUtilizationRate(address _reserve)
    external
    view
    returns (uint256);

  function getReserves() external view returns (address[] memory);

  function isUserUseReserveAsCollateralEnabled(address _reserve, address _user)
    external
    view
    returns (bool);

  function getUserOriginationFee(address _reserve, address _user)
    external
    view
    returns (uint256);

  function getUserCurrentBorrowRateMode(address _reserve, address _user)
    external
    view
    returns (uint8);

  function getUserCurrentStableBorrowRate(address _reserve, address _user)
    external
    view
    returns (uint256);

  function getUserBorrowBalances(address _reserve, address _user)
    external
    view
    returns (
      uint256,
      uint256,
      uint256
    );

  function getUserVariableBorrowCumulativeIndex(address _reserve, address _user)
    external
    view
    returns (uint256);

  function getUserLastUpdate(address _reserve, address _user)
    external
    view
    returns (uint256 timestamp);

  function refreshConfiguration() external;

  function initReserve(
    address _reserve,
    address _aTokenAddress,
    uint256 _decimals,
    address _interestRateStrategyAddress
  ) external;

  function setReserveInterestRateStrategyAddress(
    address _reserve,
    address _rateStrategyAddress
  ) external;

  function enableBorrowingOnReserve(
    address _reserve,
    bool _stableBorrowRateEnabled
  ) external;

  function disableBorrowingOnReserve(address _reserve) external;

  function enableReserveAsCollateral(
    address _reserve,
    uint256 _baseLTVasCollateral,
    uint256 _liquidationThreshold,
    uint256 _liquidationBonus
  ) external;

  function disableReserveAsCollateral(address _reserve) external;

  function enableReserveStableBorrowRate(address _reserve) external;

  function disableReserveStableBorrowRate(address _reserve) external;

  function activateReserve(address _reserve) external;

  function deactivateReserve(address _reserve) external;

  function freezeReserve(address _reserve) external;

  function unfreezeReserve(address _reserve) external;

  function setReserveBaseLTVasCollateral(address _reserve, uint256 _ltv)
    external;

  function setReserveLiquidationThreshold(address _reserve, uint256 _threshold)
    external;

  function setReserveLiquidationBonus(address _reserve, uint256 _bonus)
    external;

  function setReserveDecimals(address _reserve, uint256 _decimals) external;
}

interface ILendingPoolAddressesProvider {
  function getLendingPoolCore() external view returns (address payable);

  function getLendingPool() external view returns (address);
}

interface IAToken {
  function UINT_MAX_VALUE() external view returns (uint256);

  function allowance(address owner, address spender)
    external
    view
    returns (uint256);

  function approve(address spender, uint256 value) external returns (bool);

  function decimals() external view returns (uint8);

  function decreaseAllowance(address spender, uint256 subtractedValue)
    external
    returns (bool);

  function increaseAllowance(address spender, uint256 addedValue)
    external
    returns (bool);

  function name() external view returns (string memory);

  function symbol() external view returns (string memory);

  function transfer(address recipient, uint256 amount) external returns (bool);

  function transferFrom(
    address sender,
    address recipient,
    uint256 amount
  ) external returns (bool);

  function underlyingAssetAddress() external view returns (address);

  function redirectInterestStream(address _to) external;

  function redirectInterestStreamOf(address _from, address _to) external;

  function allowInterestRedirectionTo(address _to) external;

  function redeem(uint256 _amount) external;

  function mintOnDeposit(address _account, uint256 _amount) external;

  function burnOnLiquidation(address _account, uint256 _value) external;

  function transferOnLiquidation(
    address _from,
    address _to,
    uint256 _value
  ) external;

  function balanceOf(address _user) external view returns (uint256);

  function principalBalanceOf(address _user) external view returns (uint256);

  function totalSupply() external view returns (uint256);

  function isTransferAllowed(address _user, uint256 _amount)
    external
    view
    returns (bool);

  function getUserIndex(address _user) external view returns (uint256);

  function getInterestRedirectionAddress(address _user)
    external
    view
    returns (address);

  function getRedirectedBalance(address _user) external view returns (uint256);
}
