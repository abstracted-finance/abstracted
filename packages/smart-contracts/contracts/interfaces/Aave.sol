// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;

interface ILendingPool {
    function addressesProvider() external view returns (address);

    function deposit(
        address _reserve,
        uint256 _amount,
        uint16 _referralCode
    ) external payable;

    function redeemUnderlying(
        address _reserve,
        address _user,
        uint256 _amount
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

    function rebalanceFixedBorrowRate(address _reserve, address _user) external;

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
            uint256 liquidationDiscount,
            address interestRateStrategyAddress,
            bool usageAsCollateralEnabled,
            bool borrowingEnabled,
            bool fixedBorrowRateEnabled,
            bool isActive
        );

    function getReserveData(address _reserve)
        external
        view
        returns (
            uint256 totalLiquidity,
            uint256 availableLiquidity,
            uint256 totalBorrowsFixed,
            uint256 totalBorrowsVariable,
            uint256 liquidityRate,
            uint256 variableBorrowRate,
            uint256 fixedBorrowRate,
            uint256 averageFixedBorrowRate,
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
            uint256 currentUnderlyingBalance,
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

    function getReserves() external view;
}

interface ILendingPoolAddressesProvider {
    function getLendingPool() external view returns (address);

    function setLendingPoolImpl(address _pool) external;

    function getLendingPoolCore() external view returns (address payable);

    function setLendingPoolCoreImpl(address _lendingPoolCore) external;

    function getLendingPoolConfigurator() external view returns (address);

    function setLendingPoolConfiguratorImpl(address _configurator) external;

    function getLendingPoolDataProvider() external view returns (address);

    function setLendingPoolDataProviderImpl(address _provider) external;

    function getLendingPoolParametersProvider() external view returns (address);

    function setLendingPoolParametersProviderImpl(address _parametersProvider)
        external;

    function getTokenDistributor() external view returns (address);

    function setTokenDistributor(address _tokenDistributor) external;

    function getFeeProvider() external view returns (address);

    function setFeeProviderImpl(address _feeProvider) external;

    function getLendingPoolLiquidationManager() external view returns (address);

    function setLendingPoolLiquidationManager(address _manager) external;

    function getLendingPoolManager() external view returns (address);

    function setLendingPoolManager(address _lendingPoolManager) external;

    function getPriceOracle() external view returns (address);

    function setPriceOracle(address _priceOracle) external;

    function getLendingRateOracle() external view returns (address);

    function setLendingRateOracle(address _lendingRateOracle) external;
}
