import React, { useEffect, useState } from 'react';
import 'reactflow/dist/style.css';
import JaringanSungai from './JaringanSungai/JaringanSungai';
import TableBar from './JaringanSungai/TableBar';

const initialNodes = [
  { id: "1", data: { label: "1" }, type: "embung" },
  { id: "2", data: { label: "2" }, type: "embung", parent_id: "1" },
  { id: "3", data: { label: "3" }, type: "embung", parent_id: "1" },
  { id: "4", data: { label: "4" }, type: "embung", parent_id: "3" },
  { id: "5", data: { label: "5" }, type: "embung", parent_id: "1", direction: "kiri" },
  { id: "6", data: { label: "6" }, type: "embung", parent_id: "4" },
  { id: "7", data: { label: "7" }, type: "muaraSungai" },
];

export default function App() {
  const [data, set_data] = useState(initialNodes);

  const set_data_rows = (value) => {
    set_data(value)
  }

  return (

    <main style={{ height: "100svh" }}>
      <JaringanSungai data={data} />
      <TableBar data={data} set_data={set_data_rows} />
    </main>


  );
}
