import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Row, Col } from "@zeit-ui/react";

import CompoundSupply from "./compound/Supply";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const initialItems: any[] = Array(3)
  .fill(0)
  .map((x, i) => {
    return { id: `item-${i}`, content: `item ${i}` };
  });

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
                        <CompoundSupply />
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
