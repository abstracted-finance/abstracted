import { Text, Page, Tabs } from "@zeit-ui/react";
import * as Icon from "@zeit-ui/react-icons";
import styled from "styled-components";
import Dashboard from "../dashboard/Dashboard";

const MoonIcon = styled(Icon.Moon)`
  cursor: pointer;
`;

const SunIcon = styled(Icon.Sun)`
  cursor: pointer;
`;

export default ({ themeType, switchThemes }) => {
  return (
    <Page
      style={{
        minHeight: "calc(100vh - 20px)",
        marginTop: "20px",
      }}
      size="large"
    >
      <Page.Header>
        <Text h2>Abstracted</Text>
      </Page.Header>
      <Page.Content style={{ padding: "10px 0 40px 0" }}>
        <Dashboard />
      </Page.Content>
      <Page.Footer style={{ height: "40px" }}>
        <>
          <Text small>Abstracted &copy; 2020</Text>
          <div style={{ float: "right" }}>
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
