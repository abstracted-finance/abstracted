import { useEffect } from "react";
import { Row, Col, Text, Input, AutoComplete, Tooltip } from "@zeit-ui/react";
import * as Icon from "@zeit-ui/react-icons";

import { CenterFlexDiv } from "../../common/Divs";
import GenericLego from "../GenericLego";
import useLego from "../../../containers/legos/useLegos";
import { AaveInputOptions } from "./InputOptions";

import { partialSearchHandler } from "../../../utils/search";

export default (props) => {
  const { updateLego, legos } = useLego.useContainer();

  // Get flashloan start props
  const legoIdClean = props.lego.id.replace("flashloan-end-", "");
  const flashloanStartLego = legos.filter((x) =>
    x.id.includes(`flashloan-start-${legoIdClean}`)
  )[0];
  const flashloanStartArgs = flashloanStartLego.args[0];

  let flashloanRefundAmount = "0";
  try {
    flashloanRefundAmount = (
      parseFloat(flashloanStartArgs.amount) * 1.0009
    ).toFixed(2);
  } catch (e) {}

  useEffect(() => {
    const curLego = props.lego;
    updateLego({
      ...curLego,
      args: [
        {
          asset: flashloanStartArgs.assets,
          amount: flashloanRefundAmount,
        },
      ],
    });
  }, [flashloanStartArgs.assets, flashloanStartArgs.amount]);

  const secondaryDisplay = (
    <CenterFlexDiv>
      <Tooltip text={"Incurs a 0.09% fee"}>
        <Text type="secondary" small>
          -{flashloanRefundAmount} {flashloanStartArgs.asset}
        </Text>
      </Tooltip>
    </CenterFlexDiv>
  );

  const primaryDisplay = (
    <>
      <Row align="middle" justify="center">
        <Col span={3}>
          <Icon.ArrowRight />
        </Col>
        <Col span={13}>
          <Tooltip
            text={"Amount to refund (+0.09% fee)"}
            style={{ width: "100%" }}
          >
            <Input
              value={`${flashloanRefundAmount}`}
              disabled
              placeholder="0"
              width="100%"
            />
          </Tooltip>
        </Col>
        <Col span={8}>
          <AutoComplete
            disabled
            width="100%"
            value={flashloanStartArgs.asset}
          />
        </Col>
      </Row>
    </>
  );

  return (
    <GenericLego
      tagText={`Flashloan - ${flashloanStartArgs.asset} (End)`}
      title="Aave"
      secondaryDisplay={secondaryDisplay}
      primaryDisplay={primaryDisplay}
      {...props}
    />
  );
};
