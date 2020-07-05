import React from "react";
import { Button, useTheme } from "@zeit-ui/react";

import ConnectWeb3 from '../buttons/connect-web3'
import MenuIcon from '@zeit-ui/react-icons/menu'

interface Props {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default ({ onClick }: Props) => {
  const theme = useTheme();
  const handler = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(event);
  };

  return (
    <div className="tabbar">
      <Button className="toggle" auto type="abort" onClick={handler}>
        <MenuIcon size={16} />
      </Button>
      <div className="connect">
        <ConnectWeb3 />
      </div>
      <style jsx>{`
        .tabbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 950;
          height: 3.7rem;
          background-color: ${theme.palette.background};
          display: flex;
          align-items: center;
          padding: 0 calc(${theme.layout.gap} * 2);
          box-sizing: border-box;
          justify-content: space-between;
          border-bottom: 1px solid ${theme.palette.border};
        }
        .tabbar :global(.toggle) {
          width: 40px;
          height: 40px;
          padding: 0;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          color: ${theme.palette.accents_6};
        }
        .connect {
          display: inline-flex;
        }
        @media only screen and (min-width: ${theme.layout.breakpointMobile}) {
          .tabbar {
            display: none;
            visibility: hidden;
            top: -1000px;
          }
        }
      `}</style>
    </div>
  );
};
