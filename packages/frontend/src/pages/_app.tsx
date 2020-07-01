import { AppProps } from "next/app";
import { CssBaseline, ZeitProvider } from "@zeit-ui/react";
import useLocalStorageState from "use-local-storage-state";

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
        <Component
          {...pageProps}
          themeType={themeType}
          switchThemes={switchThemes}
        />
      </CssBaseline>
    </ZeitProvider>
  );
}

export default App;
