import { createContainer } from "unstated-next";
import { useState } from "react";

export enum LegoType {
  CompoundSupply,
  CompoundBorrow,
  CompoundRepay,
  CompoundWithdraw,
  AaveFlashloanStart,
  AaveFlashloanEnd,
}

export interface Lego {
  id: string;
  type: LegoType;
  args?: any[];
}

const useLego = function () {
  const [legos, setLegos]: [Lego[], any] = useState([]);

  const updateLego = (l: Lego) => {
    const newLegos = legos.map((x) => {
      if (x.id === l.id) {
        return l;
      }
      return x;
    });

    setLegos(newLegos);
  };

  const appendLegos = (l: Lego[]) => {
    setLegos([...legos, ...l]);
  };

  const appendLego = (lego: Lego) => {
    setLegos([...legos, lego]);
  };

  const removeLego = (lego: Lego) => {
    setLegos(legos.filter((x) => x.id !== lego.id));
  };

  return {
    legos,
    setLegos,
    appendLego,
    appendLegos,
    updateLego,
    removeLego,
  };
};

export default createContainer(useLego);
