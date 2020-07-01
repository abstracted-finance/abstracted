import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Row, Col } from "@zeit-ui/react";

import CompoundSupply from "./compound/Supply";
import CompoundWithdraw from "./compound/Withdraw";
import CompoundBorrow from "./compound/Borrow";
import CompoundRepay from "./compound/Repay";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const initialItems: any[] = [
  { id: "CompoundSupply-1", name: "CompoundSupply" },
  { id: "CompoundBorrow-1", name: "CompoundBorrow" },
  { id: "CompoundWithdraw-1", name: "CompoundWithdraw" },
  { id: "CompoundRepay-1", name: "CompoundRepay" },
];

export default () => {
  const [items, setItems] = useState(initialItems);

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(newItems);
  };

  const getLegoComponent = (name) => {
    if (name === "CompoundSupply") {
      return <CompoundSupply />;
    } else if (name === "CompoundBorrow") {
      return <CompoundBorrow />;
    } else if (name === "CompoundWithdraw") {
      return <CompoundWithdraw />;
    } else if (name === "CompoundRepay") {
      return <CompoundRepay />;
    }
    return <>Unknown</>;
  };

  return (
    <Row justify="center">
      <Col span={24} style={{ maxWidth: "500px" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
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
                        {getLegoComponent(item.name)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Col>
    </Row>
  );
};
