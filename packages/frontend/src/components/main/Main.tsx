import { Text, Page, Button, Spacer, Tag, Tooltip } from "@zeit-ui/react";
import * as Icon from "@zeit-ui/react-icons";
import styled from "styled-components";
import Dashboard from "../dashboard/Dashboard";

import useWeb3 from "../../containers/web3/use-web3";
import useProxy from "../../containers/web3/use-proxy";

const MoonIcon = styled(Icon.Moon)`
  cursor: pointer;
`;

const SunIcon = styled(Icon.Sun)`
  cursor: pointer;
`;

export default ({ themeType, switchThemes }) => {
  const { connect, signer, ethAddress } = useWeb3.useContainer();
  const { proxyAddress } = useProxy.useContainer();

  return (
    <Page
      style={{
        minHeight: "calc(100vh - 20px)",
        marginTop: "20px",
      }}
      size="medium"
    >
      <Page.Header>
        <>
          <Text b size={24}>
            Abstracted
          </Text>

          <div style={{ float: "right" }}>
            {signer === null || ethAddress === null ? (
              <Button size="small" onClick={connect} auto>
                Connect
              </Button>
            ) : (
              <Tooltip
                placement="bottom"
                text={
                  <>
                    {`Address: ${ethAddress}`}
                    <br />
                    {`Smart Wallet: ${proxyAddress || "Not found"}`}
                  </>
                }
              >
                <Tag>Connected: {ethAddress.slice(0, 6)}...</Tag>
              </Tooltip>
            )}
          </div>
        </>
      </Page.Header>
      <Page.Content style={{ padding: "10px 0 40px 0" }}>
        <Dashboard />
      </Page.Content>
      <Page.Footer style={{ height: "40px", paddingTop: '10px' }}>
        <>
          <Text small>Abstracted &copy; 2020</Text>
          <div
            style={{ float: "right", marginRight: "44px", marginTop: "3px" }}
          >
            {themeType === "dark" ? (
              <MoonIcon size={16} onClick={switchThemes} />
            ) : (
              <SunIcon size={16} onClick={switchThemes} />
            )}
          </div>
        </>
      </Page.Footer>
    </Page>
  );
};
