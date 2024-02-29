import React from "react";
import Table from "./Table";
import { Resizable } from "re-resizable";

function TableBar(props) {
  const add_row = () => {
    const { data = [], set_data } = props;
    const new_data = structuredClone(data);
    const new_index = new_data.length + 1;
    const new_row = {
      id: String(new_index),
      data: { label: String(new_index) },
      type: "embung",
    };
    new_data.push(new_row);
    set_data(new_data);
  };

  return (
    <Resizable
      id="tableBar"
      boundsByDirection={true}
      defaultSize={{
        width: "100%",
        height: 300,
      }}
      maxHeight="100vh"
      minHeight="75px"
      minWidth="100%"
      maxWidth="80%"
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        maxHeight: window.innerHeight - 5,
        minHeight: "30px",
        zIndex: 3,
        backgroundColor: "#ffffff",
        color: "#1e5e96ff",

        padding: "0 5px 5px 5px",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "center", height: "10px" }}
      >
        <div style={{ width: "100px", borderTop: "1px solid" }} />
      </div>
      <div
        style={{
          display: "flex",
          height: "100%",
        }}
      >
        <button
          style={{
            cursor: "pointer",
            borderRadius: "5px",
            marginRight: "5px",
            border: "2px solid #cccccc",
            width: "60px",
          }}
          onClick={() => {
            add_row();
          }}
        >
          ADD
        </button>
        <Table {...props} />
      </div>
    </Resizable>
  );
}

export default TableBar;
