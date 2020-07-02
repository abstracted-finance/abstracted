import { AppProps } from "next/app";
import { CssBaseline, ZeitProvider } from "@zeit-ui/react";
import useLocalStorageState from "use-local-storage-state";

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
        <LegoContainer.Provider>
          <Component
            {...pageProps}
            themeType={themeType}
            switchThemes={switchThemes}
          />
        </LegoContainer.Provider>
      </CssBaseline>
    </ZeitProvider>
  );
}

export default App;
