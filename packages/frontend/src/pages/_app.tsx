import { AppProps } from "next/app";
import { CssBaseline, ZeitProvider } from "@zeit-ui/react";
import useLocalStorageState from "use-local-storage-state";

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
        <Web3Container.Provider>
          <ProxyContainer.Provider>
            <LegoContainer.Provider>
              <Component
                {...pageProps}
                themeType={themeType}
                switchThemes={switchThemes}
              />
            </LegoContainer.Provider>
          </ProxyContainer.Provider>
        </Web3Container.Provider>
      </CssBaseline>
    </ZeitProvider>
  );
}

export default App;
