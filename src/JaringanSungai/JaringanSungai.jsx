import React, { useEffect, useState } from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import { nodeTypes } from "./TypeOfNaturalFeatures";

const initialNodes = [
  { id: "1", data: { label: "1" }, type: "embung" },
  { id: "2", data: { label: "2" }, type: "embung", parent_id: "1" },
  { id: "3", data: { label: "3" }, type: "embung", parent_id: "1" },
  { id: "4", data: { label: "4" }, type: "embung", parent_id: "3" },
  { id: "5", data: { label: "5" }, type: "embung", parent_id: "1" },
  { id: "6", data: { label: "6" }, type: "embung", parent_id: "4" },
  { id: "7", data: { label: "7" }, type: "muaraSungai" },
];

const space = 100;

export default function JaringanSungai() {
  const [nodes_state, set_nodes_state] = useState([]);
  const [edges_state, set_edges_state] = useState([]);

  /** generate posisi node */
  const calculate_node_position = ({ nodes, index, node }) => {
    const parent = nodes.find((item) => item.id === node.parent_id);
    const is_have_child = nodes.some((item) => item.parent_id === node.id);
    let siblings = [];
    if (parent) siblings = nodes.filter((item) => item.parent_id === parent.id);
    const node_index_appearance_in_siblings = siblings.findIndex(
      (item) => item.id === node.id
    );
    let youngest_sibling = null;
    if (siblings.length > 1 && node_index_appearance_in_siblings > 0)
      youngest_sibling = siblings[node_index_appearance_in_siblings - 1];

    let x = 0,
      y = 0;
    if (youngest_sibling) {
      x = youngest_sibling?.position?.x;
      y = youngest_sibling?.position?.y + space;
      if (is_have_child) y += space;
    } else if (parent) {
      x = parent?.position?.x + space;
      if (parent?.id !== nodes?.[0]?.id) {
        y = parent?.position?.y - space;
      } else {
        y = parent?.position?.y + space;
      }
    } else if (node.id === nodes?.[nodes.length - 1].id) {
      const the_most_bottom_node = nodes
        .filter((item) => item.parent_id === nodes?.[0].id)
        .at(-1);
      if (the_most_bottom_node) {
        y = the_most_bottom_node.position.y + space;
      }
    }
    nodes[index].position = { x, y };

    // console.log(`======= ${index + 1} =======`)
    // console.log("have child", is_have_child)
    // console.log("koe", node)
    // console.log("")
    // console.log("wong tuo", parent)
    // console.log("kakangmu & adhimu", siblings)
    // console.log("koe anak ke piro", node_index_appearance_in_siblings + 1)
    // console.log("kakangmu sek paling enom", youngest_sibling)

    return nodes;
  };

  const create_edges = ({ nodes, edges, index, node }) => {
    if (index !== 0) {
      const parent_node = nodes.find((item) => item.id === node.parent_id);
      if (parent_node) {
        const edge = {
          id: `e${parent_node.id}-${node.id}`,
          source: String(parent_node.id),
          target: String(node.id),
          type: "step",
        };
        edges[index - 1] = edge;
      } else {
        const first_node = nodes?.[0];
        const edge = {
          id: `e${first_node?.id}-${node.id}`,
          source: String(first_node?.id),
          target: String(node.id),
          type: "step",
        };
        edges[index - 1] = edge;
      }
    }
    return edges;
  };

  useEffect(() => {
    let temp_nodes = structuredClone(initialNodes);
    let temp_edges = [];
    for (const [index, node] of temp_nodes.entries()) {
      temp_nodes = calculate_node_position({ nodes: temp_nodes, index, node });
      temp_edges =
        create_edges({ nodes: temp_nodes, edges: temp_edges, index, node }) ||
        [];
    }
    set_nodes_state(temp_nodes);
    set_edges_state(temp_edges);
  }, []);

  return (
    <main>
      <div style={{ width: "100%", height: "800px", border: "1px solid" }}>
        <ReactFlow
          nodes={nodes_state}
          edges={edges_state}
          nodeTypes={nodeTypes}
        />
      </div>
    </main>
  );
}
