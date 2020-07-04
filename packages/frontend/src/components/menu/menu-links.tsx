import React from "react";
import { useTheme } from "@zeit-ui/react";
import * as Icon from "@zeit-ui/react-icons";
import Controls from "../controls";

const MenuLinks = () => {
  const theme = useTheme();

  return (
    <nav>
      <div className="site-name">
        <span title={"Go Home"} onClick={() => {}}>
          <Icon.Home />
        </span>
      </div>
      <div className="links">
        <Controls />
      </div>
      <style jsx>{`
        nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1000px;
          user-select: none;
          position: relative;
          margin: 0 auto;
          padding: 0 ${theme.layout.gap};
          height: 60px;
        }
        .site-name {
          display: flex;
          align-items: center;
        }
      `}</style>
    </nav>
  );
};

export default MenuLinks;
