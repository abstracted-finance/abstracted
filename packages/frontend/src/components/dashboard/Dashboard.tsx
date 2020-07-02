import { Tabs } from "@zeit-ui/react";
import Wallet from "../wallet/Wallet";
import Legos from "../legos/Legos";

export default () => {
  return (
    <Tabs initialValue="wallet">
      <Tabs.Item label="Wallet" value="wallet">
        <Wallet />
      </Tabs.Item>
      <Tabs.Item label="Legos" value="legos">
        <Legos />
      </Tabs.Item>
    </Tabs>
  );
};
