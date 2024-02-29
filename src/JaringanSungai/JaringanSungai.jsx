import React, { useEffect, useState } from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import { nodeTypes } from "./TypeOfNaturalFeatures";

const space = 100;
const left_key = "kiri";

export default function JaringanSungai({ data = [] }) {
  const [nodes_state, set_nodes_state] = useState([]);
  const [edges_state, set_edges_state] = useState([]);

  useEffect(() => {
    let temp_nodes = structuredClone(data);
    let temp_edges = [];
    for (const [index, node] of temp_nodes.entries()) {
      temp_nodes = calculate_node_position({ nodes: temp_nodes, index, node });
      temp_edges =
        create_edges({ nodes: temp_nodes, edges: temp_edges, index, node }) ||
        [];
    }

    set_nodes_state(temp_nodes);
    set_edges_state(temp_edges);
  }, [JSON.stringify(data)]);

  const get_descendants = (nodes, parent_id, result = [], cabang = []) => {
    const children = nodes
      .filter((row) => row.parent_id === parent_id)
      .map((row) => row.id);

    const numChildren = children.length;
    const numCabang = cabang?.length;
    if (numChildren === 0) {
      const lastCabang = cabang[numCabang - 1];
      if (lastCabang && !result.includes(lastCabang)) {
        result.push(lastCabang);
      } else if (parent_id && !result.includes(parent_id)) {
        result.push(parent_id);
      }
      const new_cabang = cabang.filter((cab) => cab !== lastCabang);
      if (numCabang > 0)
        return get_descendants(nodes, lastCabang, result, new_cabang);
      return result;
    } else {
      const active = children.pop();
      if (!result.includes(parent_id)) result.push(parent_id);
      if (!result.includes(active)) result.push(active);
      cabang.push(...children);
      return get_descendants(nodes, active, result, cabang);
    }
  };

  const calculate_final_space = ({
    older_siblings,
    children,
    parent,
    node,
    nodes,
  }) => {
    let left_children = [];
    let right_children = [];
    children.forEach((child) => {
      if (child.direction === left_key) {
        left_children.push(child);
      } else {
        right_children.push(child);
      }
    });

    let right_older_siblings = [];
    let left_older_siblings = [];
    older_siblings.forEach((item) => {
      if (item.direction === left_key) {
        left_older_siblings.push(item);
      } else {
        right_older_siblings.push(item);
      }
    });

    if (node.direction === left_key) {
      let final_space = space;
      if (right_children.length > 0 || left_older_siblings.length > 0) {
        const right_children_descendants = right_children
          .map((child) =>
            get_descendants(nodes, child.id)?.map((node_id) =>
              nodes.find((item) => item.id === node_id)
            )
          )
          .flat();

        const right_children_descendants_space =
          right_children_descendants.length * 2;

        const left_older_siblings_space = left_older_siblings.length * 2;
        const is_main_branch = node.parent_id === nodes?.[0]?.id ? 1 : 0;

        final_space =
          space *
          (right_children_descendants_space +
            left_older_siblings_space +
            is_main_branch);
      } else {
        const left_older_siblings = older_siblings.filter(
          (item) => item.direction === left_key
        );
        const left_older_siblings_space = left_older_siblings.length * 2;
        final_space = space + space * left_older_siblings_space;
      }

      return parent?.position?.x - final_space;
    } else {
      let final_space = space;
      if (left_children.length > 0) {
        const left_children_descendants = left_children
          .map((child) =>
            get_descendants(nodes, child.id)?.map((node_id) =>
              nodes.find((item) => item.id === node_id)
            )
          )
          ?.flat();

        const left_children_descendants_space =
          left_children_descendants.length * 2;

        console.log(node.id);
        const is_main_branch = node.parent_id === nodes?.[0]?.id ? 1 : 0;
        const right_older_siblings_space = right_older_siblings.length * 2;
        final_space =
          space *
          (left_children_descendants_space +
            right_older_siblings_space +
            is_main_branch);

        console.log(node.id, left_children_descendants);
      } else {
        const right_older_siblings = older_siblings.filter(
          (item) => item.direction !== left_key
        );
        const right_older_siblings_space = right_older_siblings.length * 2;
        final_space = space + space * right_older_siblings_space;
      }

      return parent?.position?.x + final_space;
    }
  };

  /** generate posisi node */
  const calculate_node_position = ({ nodes, index, node }) => {
    const parent = nodes.find((item) => item.id === node.parent_id);
    let siblings = [];
    if (parent) siblings = nodes.filter((item) => item.parent_id === parent.id);
    const node_index_appearance_in_siblings = siblings.findIndex(
      (item) => item.id === node.id
    );
    let younger_siblings = [];
    if (siblings?.length > 1 && node_index_appearance_in_siblings > -1) {
      younger_siblings = siblings.slice(
        node_index_appearance_in_siblings + 1,
        siblings.length
      );
    }
    let older_siblings = [];
    if (siblings?.length > 1 && node_index_appearance_in_siblings > 0) {
      older_siblings = siblings.slice(0, node_index_appearance_in_siblings);
    }

    let children = nodes.filter((item) => item.parent_id === node.id);

    let descendants = get_descendants(nodes, node.id)
      ?.slice(1)
      ?.map((node_id) => nodes.find((item) => item.id === node_id));

    let first_descendants = null;
    if (descendants[1]) {
      first_descendants = nodes.find((item) => item.id === descendants[1]);
    }

    const is_have_child = children.length > 0;

    let older_youngest_sibling = null;
    if (siblings.length > 1 && node_index_appearance_in_siblings > 0)
      older_youngest_sibling = older_siblings.at(-1);

    let x = 0,
      y = 0;
    if (older_youngest_sibling) {
      // console.log("older youngest sibling", node);
      y = older_youngest_sibling?.position?.y;
      x = older_youngest_sibling?.position?.x;

      if (parent?.id !== nodes?.[0]?.id) {
        // console.log(`older_youngest_sibling-cabang: ${index + 1}`);
        x = calculate_final_space({
          older_siblings,
          children,
          parent,
          node,
          nodes,
        });
      } else {
        y += space;
        // console.log(`older_youngest_sibling-utama: ${index + 1}`);
        x = calculate_final_space({
          older_siblings,
          children,
          parent,
          node,
          nodes,
        });
      }
      // if (is_have_child) y -= space * children.length;
    } else if (parent) {
      // console.log("parent", node);
      if (parent?.id !== nodes?.[0]?.id) {
        // console.log(`parent-cabang: ${index + 1}`);
        // const final_space = space * younger_siblings.length;
        y = parent?.position?.y - space;
        if (older_siblings.length > 0) x += space;

        x = calculate_final_space({
          older_siblings,
          children,
          parent,
          node,
          nodes,
        });
      } else {
        // console.log(`parent-utama: ${index + 1}`);
        y = parent?.position?.y + space;
        x = calculate_final_space({
          older_siblings,
          children,
          parent,
          node,
          nodes,
        });
      }
    } else if (node.id === nodes?.[nodes.length - 1].id) {
      // console.log("else", node);
      const the_most_bottom_node = nodes
        .filter((item) => item.parent_id === nodes?.[0].id)
        .at(-1);
      if (the_most_bottom_node) {
        y = the_most_bottom_node.position.y + space;
      }
    }
    nodes[index].position = { x, y };

    // console.log(`======= ${index + 1} =======`);
    // console.log("node.id", node.id);
    // console.log("first_descendants", first_descendants);
    // console.log("descendants", descendants);
    // console.log("right_handed_children", right_handed_children);
    // console.log("have child", is_have_child);
    // console.log("koe", node);
    // console.log("");
    // console.log("wong tuo", parent);
    // console.log("kakangmu & adhimu", siblings);
    // console.log("kabeh kakangmu", older_siblings);
    // console.log("koe anak ke piro", node_index_appearance_in_siblings + 1);
    // console.log("kakangmu sek paling enom", older_youngest_sibling);
    // console.log("anakmu", children);
    // console.log("adhimu", younger_siblings);
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

  return (
    <main style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes_state}
        edges={edges_state}
        nodeTypes={nodeTypes}
      />
    </main>
  );
}
