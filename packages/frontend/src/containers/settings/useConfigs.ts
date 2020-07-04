import { createContainer } from "unstated-next";

export interface Configs {
  sidebarScrollHeight: number;
  updateSidebarScrollHeight: Function;

  tabbarFixed: boolean;
  updateTabbarFixed: Function;
}

export const useConfigs = (): Configs => {
  return {
    sidebarScrollHeight: 0,
    updateSidebarScrollHeight: () => {},

    tabbarFixed: false,
    updateTabbarFixed: () => {},
  };
};

export default createContainer(useConfigs);
