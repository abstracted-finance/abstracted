import { Text, Select } from "@zeit-ui/react";
import { CoinGeckoSupportedCurrencies } from "../../utils/constants";

import useSettings from "../../containers/settings/use-settings";

export default () => {
  const { settings, setSettings } = useSettings.useContainer();
  const { currency } = settings;

  const sortedListOfCurrencies = Object.keys(CoinGeckoSupportedCurrencies).sort(
    (a, b) => {
      const [aL, bL] = [a, b].map((x) => x.toLowerCase());
      if (aL < bL) return -1;
      if (bL < aL) return 1;
      return 0;
    }
  );

  const setCurrency = (currency) => {
    setSettings({
      ...settings,
      currency,
    });
  };

  return (
    <>
      <Text h3>Currency</Text>
      <Select placeholder={currency.toUpperCase()} onChange={setCurrency}>
        {sortedListOfCurrencies.map((x) => {
          return (
            <Select.Option key={x} value={CoinGeckoSupportedCurrencies[x]}>
              {x}
            </Select.Option>
          );
        })}
      </Select>
    </>
  );
};
