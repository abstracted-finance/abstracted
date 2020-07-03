import { Tabs, Spacer } from "@zeit-ui/react";

import Wallet from "../wallet/Wallet";
import Legos from "../legos/Legos";
import Settings from "../settings/Settings";

export default () => {
  return (
    <Tabs initialValue="wallet">
      <Tabs.Item label="Wallet" value="wallet">
        <Spacer y={1} />
        <Wallet />
      </Tabs.Item>
      <Tabs.Item label="Legos" value="legos">
        <Spacer y={1} />
        <Legos />
      </Tabs.Item>
      <Tabs.Item label="Settings" value="settings">
        <Spacer y={1} />
        <Settings />
      </Tabs.Item>
    </Tabs>
  );
};
