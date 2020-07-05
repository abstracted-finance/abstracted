import React, { useEffect, useMemo, useRef } from "react";
import Router from "next/router";
import { useTheme, Spacer } from "@zeit-ui/react";
import SideItem, { Sides } from "./side-item";
import Metadata from "../data";
import useAppContext from "../../containers/settings/use-app-context";

export interface Props {}

export type SideChildren = Sides | Array<Sides>;

export const SideGroup: React.FC<{ sides?: SideChildren }> = React.memo(
  ({ sides }) => {
    if (!sides) return null;
    sides = Array.isArray(sides) ? sides : [sides];
    return (
      <SideItem sides={sides}>
        <SideGroup />
      </SideItem>
    );
  }
);

export const Sidebar: React.FC<Props> = React.memo(() => {
  const theme = useTheme();
  const boxRef = useRef<HTMLDivElement>(null);
  const { locale, tabbar } = useAppContext.useContainer();

  const tabbarData = useMemo(() => {
    const allSlides = Metadata[locale]
    const currentSide = allSlides.filter((side) => side.name === tabbar)[0];
    return (currentSide.children || []) as Array<Sides>;
  }, [locale, tabbar]);

  useEffect(() => {
    if (!boxRef.current) return;
    boxRef.current.scrollTo({ top: 0 });
  }, [boxRef.current]);

  return (
    <div ref={boxRef} className="sides box">
      <SideItem sides={tabbarData}>
        <SideGroup />
      </SideItem>
      <Spacer />
      <style jsx>{`
        .sides {
          width: 100%;
          padding-bottom: ${theme.layout.gap};
        }
        .box {
          overflow-y: auto;
          overflow-x: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .box::-webkit-scrollbar {
          width: 0;
          background-color: transparent;
        }
        .box > :global(.item) {
          margin-bottom: ${theme.layout.gap};
        }
        @media only screen and (max-width: ${theme.layout.breakpointMobile}) {
          .box {
            padding: calc(3.5 * ${theme.layout.gap}) 15vw;
            width: 100vw;
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
});

export default Sidebar;
