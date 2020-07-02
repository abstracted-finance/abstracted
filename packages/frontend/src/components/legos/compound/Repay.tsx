import { useState, useEffect } from "react";
import { Row, Col, Text, Input, AutoComplete, Tooltip } from "@zeit-ui/react";
import * as Icon from "@zeit-ui/react-icons";

import useLego from "../../../containers/legos/useLegos";
import { CenterFlexDiv } from "../../common/Divs";
import GenericLego from "../GenericLego";
import { CompoundInputOptions } from "./InputOptions";

import { partialSearchHandler } from "../../../utils/search";

export default (props) => {
  const legoArgs = props.lego.args[0];

  const { updateLego } = useLego.useContainer();

  const [inputAmount, setInputAmount] = useState(legoArgs.amount);
  const [selectedOption, setSelectedOption] = useState(
    CompoundInputOptions[0].value
  );
  const [inputOptions, setInputOptions] = useState(CompoundInputOptions);
  const searchHandler = partialSearchHandler(
    CompoundInputOptions,
    setInputOptions
  );

  useEffect(() => {
    const curLego = props.lego;
    updateLego({
      ...curLego,
      args: [
        {
          asset: selectedOption,
          amount: inputAmount,
        },
      ],
    });
  }, [inputAmount, selectedOption]);

  const secondaryDisplay = (
    <CenterFlexDiv>
      <Text type="secondary" small>
        -{inputAmount} {selectedOption}
      </Text>
    </CenterFlexDiv>
  );

  const primaryDisplay = (
    <>
      <Row align="middle" justify="center">
        <Col span={3}>
          <Icon.ArrowRight />
        </Col>
        <Col span={13}>
          <Input
            onChange={(e) => setInputAmount(e.target.value)}
            value={inputAmount}
            placeholder="0"
            width="100%"
          />
        </Col>
        <Col span={8}>
          <AutoComplete
            value={selectedOption}
            width="100%"
            options={inputOptions}
            onSelect={setSelectedOption}
            onSearch={searchHandler}
          />
        </Col>
      </Row>
      <Row align="middle" justify="center">
        <Col span={3}>
          <Icon.Package />
        </Col>
        <Col span={13}>
          <Tooltip text={"Amount to repay"} style={{ width: "100%" }}>
            <Input disabled placeholder="0" width="100%" />
          </Tooltip>
        </Col>
        <Col span={8}>
          <AutoComplete
            disabled
            initialValue={selectedOption}
            width="100%"
            options={inputOptions}
            onSearch={searchHandler}
            value={selectedOption}
          />
        </Col>
      </Row>
    </>
  );

  return (
    <GenericLego
      tagText="Repay"
      title="Compound"
      secondaryDisplay={secondaryDisplay}
      primaryDisplay={primaryDisplay}
      {...props}
    />
  );
};
