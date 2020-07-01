import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Tag,
  Text,
  Spacer,
  Input,
  AutoComplete,
} from "@zeit-ui/react";
import * as Icon from "@zeit-ui/react-icons";
import styled from "styled-components";

const ChevronUpIcon = styled(Icon.ChevronUp)`
  cursor: pointer;
`;

const ChevronDownIcon = styled(Icon.ChevronDown)`
  cursor: pointer;
`;

export default () => {
  const [showSettings, setShowSettings] = useState(true);

  const allInputOptions = [
    { label: "ETH", value: "ETH" },
    { label: "DAI", value: "DAI" },
    { label: "USDC", value: "USDC" },
  ];
  const [inputOptions, setInputOptions] = useState(allInputOptions);
  const searchHandler = (currentValue) => {
    if (!currentValue) return setInputOptions(allInputOptions);
    const relatedOptions = allInputOptions.filter((item) =>
      item.value.toLowerCase().includes(currentValue.toLowerCase())
    );
    setInputOptions(relatedOptions);
  };

  return (
    <Card width="100%">
      <>
        <Tag type="default" invert>
          Supply
        </Tag>
        &nbsp;&nbsp;&nbsp;
        <Text size="1.5rem" b>
          Compound
        </Text>
      </>
      <div style={{ float: "right" }}>
        {showSettings ? (
          <ChevronUpIcon onClick={() => setShowSettings(!showSettings)} />
        ) : (
          <ChevronDownIcon onClick={() => setShowSettings(!showSettings)} />
        )}
      </div>

      <Spacer y={1} />
      {!showSettings ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Icon.ArrowDown size={16} />
          <Text type="secondary" small>
            10 ETH
          </Text>
          <Spacer x={1} />

          <Icon.ArrowUp size={16} />
          <Text type="secondary" small>
            10 ETH
          </Text>
        </div>
      ) : null}
      {showSettings ? (
        <>
          <Row align="middle" justify="center">
            <Col span={2}>
              <Icon.ArrowRight />
            </Col>
            <Col span={14}>
              <Input placeholder="0" width="100%" />
            </Col>
            <Col span={8}>
              <AutoComplete
                initialValue="ETH"
                width="100%"
                options={inputOptions}
                onSearch={searchHandler}
              />
            </Col>
          </Row>
          <Row align="middle" justify="center">
            <Col span={2}>
              <Icon.ArrowLeft />
            </Col>
            <Col span={14}>
              <Input disabled placeholder="0" width="100%" />
            </Col>
            <Col span={8}>
              <AutoComplete
                disabled
                initialValue="ETH"
                width="100%"
                options={inputOptions}
                onSearch={searchHandler}
              />
            </Col>
          </Row>
        </>
      ) : null}
    </Card>
  );
};
