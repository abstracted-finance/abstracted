import { createContainer } from "unstated-next";

import { CoinGeckoSupportedCurrencies } from "../../utils/constants";
import useLocalStorageState from "use-local-storage-state";

interface Settings {
  currency: CoinGeckoSupportedCurrencies;
}

const initialSettings: Settings = {
  currency: CoinGeckoSupportedCurrencies.USD,
};

const useSettings = function () {
  const [settings, setSettings] = useLocalStorageState(
    "settings",
    initialSettings
  );

  return {
    settings,
    setSettings,
  };
};

export default createContainer(useSettings);
