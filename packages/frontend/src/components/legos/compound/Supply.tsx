import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Text,
  Input,
  AutoComplete,
  Spacer,
  Tooltip,
} from "@zeit-ui/react";
import * as Icon from "@zeit-ui/react-icons";

import useLego from "../../../containers/legos/useLegos";
import { CenterFlexDiv } from "../../common/Divs";
import GenericLego from "../GenericLego";
import { CompoundInputOptions } from "./InputOptions";

import { partialSearchHandler } from "../../../utils/search";

export default (props) => {
  const legoArgs = props.lego.args[0];

  const { updateLego } = useLego.useContainer();

  // Don't wanna get invalid pricing (due to async nature)
  const [timeoutId, setTimeoutId] = useState(null);

  // Are we retrieving the output price?
  const [isRetrieving, setIsRetrieving] = useState(false);

  // Value of asset
  const [inputAmount, setInputAmount] = useState(legoArgs.amount);
  const [outputAmount, setOutputAmount] = useState("0");

  // Asset type
  const [selectedOption, setSelectedOption] = useState(legoArgs.asset);
  const [inputOptions, setInputOptions] = useState(CompoundInputOptions);
  const searchHandler = partialSearchHandler(
    CompoundInputOptions,
    setInputOptions
  );

  // Just for convinience
  const nominatedOutput = `c${selectedOption}`;

  const updateOutputPrice = async () => {
    setIsRetrieving(true);
    clearTimeout(timeoutId);

    setTimeoutId(
      setTimeout(() => {
        setIsRetrieving(false);
        setOutputAmount(inputAmount);
      }, 2000)
    );
  };

  useEffect(() => {
    if (inputAmount === "0") return;

    updateOutputPrice();

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
      <Spacer x={1} />

      <Text type="secondary" small>
        +{outputAmount} {nominatedOutput}
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
            onSelect={setSelectedOption}
            initialValue={selectedOption}
            width="100%"
            options={inputOptions}
            onSearch={searchHandler}
          />
        </Col>
      </Row>
      <Row align="middle" justify="center">
        <Col span={3}>
          <Icon.ArrowLeft />
        </Col>
        <Col span={13}>
          <Tooltip
            text={`Amount of ${nominatedOutput} you will receive`}
            style={{ width: "100%" }}
          >
            <Input
              value={isRetrieving ? "..." : outputAmount}
              disabled
              placeholder="0"
              width="100%"
            />
          </Tooltip>
        </Col>
        <Col span={8}>
          <AutoComplete
            disabled
            initialValue={nominatedOutput}
            width="100%"
            value={nominatedOutput}
          />
        </Col>
      </Row>
    </>
  );

  return (
    <GenericLego
      isLoading={isRetrieving}
      tagText="Supply"
      title="Compound"
      secondaryDisplay={secondaryDisplay}
      primaryDisplay={primaryDisplay}
      {...props}
    />
  );
};
