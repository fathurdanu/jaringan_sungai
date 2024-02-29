import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "label",
    headerName: "Label",
    width: 150,
    editable: true,
  },
  {
    field: "type",
    headerName: "Type",
    width: 150,
    editable: true,
  },
  {
    field: "parent_id",
    headerName: "Parent ID",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "direction",
    headerName: "Direction",
    width: 110,
    editable: true,
  },
];

function Table({ data = [], set_data }) {
  const [rows, set_rows] = useState([]);

  useEffect(() => {
    const new_rows = data.map((row) => {
      const new_row = {
        ...row,
        label: row?.data?.label || "",
      };
      return new_row;
    });
    set_rows(new_rows);
  }, [JSON.stringify(data)]);

  const process_row_update = (new_row) => {
    const { id, label, type, parent_id, direction } = new_row;
    let cleaned_new_row = {};
    if (id) cleaned_new_row.id = String(id);
    if (label) cleaned_new_row.data = { label: String(label) };
    if (type) cleaned_new_row.type = String(type);
    if (parent_id) cleaned_new_row.parent_id = String(parent_id);
    if (direction) cleaned_new_row.direction = direction;

    let new_data = structuredClone(data);
    const index = new_data.findIndex((item) => new_row.id === item.id);
    new_data[index] = cleaned_new_row;
    set_data(new_data);

    return new_row;
  };

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      rowsPerPageOptions={[25, 50, 100]}
      processRowUpdate={process_row_update}
      disableColumnMenu
    />
  );
}

export default Table;
