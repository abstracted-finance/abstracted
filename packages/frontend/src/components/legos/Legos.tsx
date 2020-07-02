import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useToasts, Button, Row, Col, Spacer } from "@zeit-ui/react";

import CompoundSupply from "./compound/Supply";
import CompoundWithdraw from "./compound/Withdraw";
import CompoundBorrow from "./compound/Borrow";
import CompoundRepay from "./compound/Repay";

import AaveFlashloanStart from "./aave/FlashloanStart";
import AaveFlashloanEnd from "./aave/FlashloanEnd";

import AddLegoPage from "./AddLegoPage";

import {
  Lego,
  LegoType,
  default as useLego,
} from "../../containers/legos/useLegos";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default () => {
  const [, setToast] = useToasts();
  const { legos, setLegos } = useLego.useContainer();

  const [addPageVisisble, setAddPageVisible] = useState(false);

  const onDragEnd = (result) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const curLego = legos[result.source.index];

    // Flashloan start cannot be after flashloan end
    if (curLego.id.startsWith("flashloan-start")) {
      const flashloanEndId = `flashloan-end-${curLego.id.replace(
        "flashloan-start-",
        ""
      )}`;

      const flashloanEndIndex = legos.findIndex((x) => x.id === flashloanEndId);

      if (result.destination.index >= flashloanEndIndex) {
        setToast({
          text: "Flashloan start cannot be after flashloan end",
          type: "error",
        });
        return;
      }
    }

    // Flashloan end cannot be before flashloan start
    if (curLego.id.startsWith("flashloan-end")) {
      const flashloanStartId = `flashloan-start-${curLego.id.replace(
        "flashloan-end-",
        ""
      )}`;

      const flashloanStartIndex = legos.findIndex(
        (x) => x.id === flashloanStartId
      );

      if (result.destination.index <= flashloanStartIndex) {
        setToast({
          text: "Flashloan end cannot be before flashloan start",
          type: "error",
        });
        return;
      }
    }

    const newItems = reorder(
      legos,
      result.source.index,
      result.destination.index
    );

    setLegos(newItems);
  };

  const toLegoComponent = {
    [LegoType.CompoundBorrow]: <CompoundBorrow />,
    [LegoType.CompoundRepay]: <CompoundRepay />,
    [LegoType.CompoundSupply]: <CompoundSupply />,
    [LegoType.CompoundWithdraw]: <CompoundWithdraw />,
    [LegoType.AaveFlashloanStart]: <AaveFlashloanStart />,
    [LegoType.AaveFlashloanEnd]: <AaveFlashloanEnd />,
  };

  const getLegoComponent = (lego: Lego) => {
    const lc = toLegoComponent[lego.type] || <></>;
    return React.cloneElement(lc, { lego });
  };

  return (
    <>
      <Row justify="center">
        <Col span={24} style={{ maxWidth: "500px" }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {legos.map((lego, index) => (
                    <Draggable
                      key={lego.id}
                      draggableId={lego.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          // snapshot.isDragging to get isDragging
                          style={{
                            // some basic styles to make the items look a bit nicer
                            userSelect: "none",
                            margin: "0 0 8px 0",

                            // styles we need to apply on draggables
                            ...provided.draggableProps.style,
                          }}
                        >
                          {getLegoComponent(lego)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Spacer y={1} />
          <Button
            onClick={() => setAddPageVisible(true)}
            style={{ width: "100%" }}
            shadow
            type="secondary"
          >
            Add
          </Button>
        </Col>
      </Row>

      <AddLegoPage visible={addPageVisisble} setVisible={setAddPageVisible} />
    </>
  );
};
