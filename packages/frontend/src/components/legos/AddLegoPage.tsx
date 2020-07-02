import { useTheme, Page, Text, Button, Spacer } from "@zeit-ui/react";

import { randomId } from "../../utils/common";
import { LegoType, default as useLego } from "../../containers/legos/useLegos";
import styled from "styled-components";

import { AaveInputOptions } from "./aave/InputOptions";
import { CompoundInputOptions } from "./compound/InputOptions";

const MButton = styled(Button)`
  margin: 2.5px;
`;

export default ({ visible, setVisible }) => {
  const theme = useTheme();
  const { appendLego, appendLegos } = useLego.useContainer();

  const addToCompoundLego = (l: LegoType) => {
    appendLego({
      id: randomId(),
      type: l,
      args: [
        {
          asset: CompoundInputOptions[0].value,
          amount: "0",
        },
      ],
    });
  };

  return (
    <section
      onClick={() => setVisible(false)}
      className={visible ? "active" : ""}
    >
      <Page size="large">
        <Text h2>Compound</Text>

        <MButton
          onClick={() => addToCompoundLego(LegoType.CompoundSupply)}
          auto
          type="secondary"
        >
          Supply
        </MButton>
        <MButton
          onClick={() => addToCompoundLego(LegoType.CompoundWithdraw)}
          auto
          type="secondary"
        >
          Withdraw
        </MButton>
        <MButton
          onClick={() => addToCompoundLego(LegoType.CompoundBorrow)}
          auto
          type="secondary"
        >
          Borrow
        </MButton>
        <MButton
          onClick={() => addToCompoundLego(LegoType.CompoundRepay)}
          auto
          type="secondary"
        >
          Repay
        </MButton>

        <Spacer y={1} />

        <Text h2>Aave</Text>
        <MButton
          onClick={() => {
            const id = randomId();
            appendLegos([
              {
                id: `flashloan-start-${id}`,
                type: LegoType.AaveFlashloanStart,
                args: [
                  {
                    asset: AaveInputOptions[0].value,
                    amount: "0",
                  },
                ],
              },
              {
                id: `flashloan-end-${id}`,
                type: LegoType.AaveFlashloanEnd,
                args: [
                  {
                    asset: AaveInputOptions[0].value,
                    amount: "0",
                  },
                ],
              },
            ]);
          }}
          auto
          type="secondary"
        >
          Flashloan
        </MButton>
      </Page>
      <style jsx>{`
        section {
          position: fixed;
          width: 100vw;
          height: 100vh;
          background-color: ${theme.palette.background};
          z-index: 5000;
          top: -5000px;
          left: -5000px;
          display: none;
          opacity: 0.98;
        }
        .active {
          top: 0;
          left: 0;
          bottom: 0;
          display: block;
        }
      `}</style>
    </section>
  );
};
