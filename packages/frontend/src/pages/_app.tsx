import { AppProps } from "next/app";
import { CssBaseline, ZeitProvider } from "@zeit-ui/react";
import useLocalStorageState from "use-local-storage-state";

import WithdrawContainer from "../containers/balances/useWithdraw";
import CompoundEnteredContainer from "../containers/compound/useCompoundEntered";
import SettingsContainer from "../containers/settings/useSettings";
import BalancesContainer from "../containers/balances/useBalances";
import ContractsContainer from "../containers/web3/useContracts";
import ProxyContainer from "../containers/web3/useProxy";
import Web3Container from "../containers/web3/useWeb3";
import LegoContainer from "../containers/legos/useLegos";

function App({ Component, pageProps }: AppProps) {
  const [themeType, setThemeType] = useLocalStorageState("theme", "dark");
  const switchThemes = () => {
    setThemeType((lastThemeType) =>
      lastThemeType === "dark" ? "light" : "dark"
    );
  };

  return (
    <ZeitProvider theme={{ type: themeType }}>
      <CssBaseline>
        <SettingsContainer.Provider>
          <Web3Container.Provider>
            <ContractsContainer.Provider>
              <ProxyContainer.Provider>
                <CompoundEnteredContainer.Provider>
                  <BalancesContainer.Provider>
                    <WithdrawContainer.Provider>
                      <LegoContainer.Provider>
                        <Component
                          {...pageProps}
                          themeType={themeType}
                          switchThemes={switchThemes}
                        />
                      </LegoContainer.Provider>
                    </WithdrawContainer.Provider>
                  </BalancesContainer.Provider>
                </CompoundEnteredContainer.Provider>
              </ProxyContainer.Provider>
            </ContractsContainer.Provider>
          </Web3Container.Provider>
        </SettingsContainer.Provider>
      </CssBaseline>
    </ZeitProvider>
  );
}

export default App;
