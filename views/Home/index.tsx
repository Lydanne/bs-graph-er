import { Button, Toast } from "@douyinfe/semi-ui";
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./index.module.css";
import { useTranslation } from "next-i18next";
import { Node, ReactFlowProvider } from "reactflow";
import { LayoutFlow } from "@/components/LayoutFlow";

const tables = [
  {
    id: "1",
    label: "表1",
    primary: "field1",
    fields: [
      {
        id: "field1",
        label: "字段1",
        type: "string",
      },
      {
        id: "field2",
        label: "字段2",
        type: "link",
      },
      {
        id: "field3",
        label: "字段2",
        type: "link",
      },
    ],
    data: [
      {
        id: "field1",
        value: "1",
      },
      {
        id: "field2",
        value: ["2"],
      },
      {
        id: "field3",
        value: ["3"],
      },
    ],
  },
  {
    id: "2",
    label: "表2",
    primary: "field1",
    fields: [
      {
        id: "field1",
        label: "字段1",
        type: "link",
      },
      {
        id: "field2",
        label: "字段2",
        type: "string",
      },
    ],
    data: [
      {
        id: "field1",
        value: ["3"],
      },
      {
        id: "field2",
        value: "2",
      },
    ],
  },
  {
    id: "3",
    label: "表3",
    primary: "field1",
    fields: [
      {
        id: "field1",
        label: "field1",
        type: "string",
      },
      {
        id: "field2",
        label: "field2",
        type: "string",
      },
      {
        id: "field3",
        label: "field3",
        type: "link",
      },
    ],
    data: [
      {
        id: "field1",
        value: "1",
      },
      {
        id: "field2",
        value: "3",
      },
      {
        id: "field3",
        value: ["1"],
      },
    ],
  },
];

function trans(tables = []) {
  const nodes = [];
  const edges = [];
  let isLoop = false;
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const node = {
      id: table.id,
      type: "kvlist",
      position: { x: 0, y: 0 },
      data: {
        start: i === 0,
        end: i === tables.length - 1,
        label: table.label,
        data: table.data.map((item, j) => ({
          id: item.id,
          label: table.fields[j].label,
          field: table.fields[j].id,
          type: table.fields[j].type,
          value: item.value,
        })),
      },
      // sourcePosition: "right",
      // targetPosition: "left",
    };
    nodes.push(node);
    for (let j = 0; j < table.fields.length; j++) {
      const field = table.fields[j];
      const d = table.data[j];
      if (field.type === "link") {
        for (let i = 0; i < d.value.length; i++) {
          const id = d.value[i];
          const edge = {
            id: table.id + "-" + id,
            sourceHandle: field.id,
            source: table.id,
            target: id,
          };
          if (nodes[0].id === edge.target) {
            isLoop = true;
            edges.push({
              id: "root-ref-edge" + edge.id,
              sourceHandle: edge.sourceHandle,
              source: edge.source,
              target: "root-ref",
            });
          } else {
            edges.push(edge);
          }
        }
      }
    }
  }

  if (isLoop) {
    nodes.push({
      id: "root-ref",
      type: "output",
      position: { x: 0, y: 0 },
      data: { label: `Ref<${nodes[0].data.label}>` },
      targetPosition: "left",
    });
  }

  return [nodes, edges];
}

const [initialNodes, initialEdges] = trans(tables);

console.log({ initialNodes, initialEdges });

// const initialNodes = [
//   {
//     id: "1",
//     type: "kvlist",
//     position: { x: 0, y: 0 },
//     data: {
//       name: "table1",
//       data: [
//         {
//           id: "field1",
//           label: "field1",
//           value: "1",
//         },
//       ],
//     },
//     sourcePosition: "right",
//     targetPosition: "left",
//   },
//   {
//     id: "2",
//     type: "kvlist",
//     position: { x: 0, y: 0 },
//     data: { label: "" },
//     sourcePosition: "right",
//     targetPosition: "left",
//   },
//   {
//     id: "3",
//     type: "kvlist",
//     position: { x: 0, y: 0 },
//     data: { label: "2" },
//     sourcePosition: "right",
//     targetPosition: "left",
//   },
//   {
//     id: "4",
//     type: "kvlist",
//     position: { x: 0, y: 0 },
//     data: { label: "2" },
//     sourcePosition: "right",
//     targetPosition: "left",
//   },
// ];
// const initialEdges = [
//   { id: "e1-2", source: "1", target: "2" },
//   { id: "e1-3", source: "1", target: "3" },
//   { id: "e1-4", source: "3", target: "4" },
// ];

export default function Home() {
  return (
    <main className={styles.main} style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <LayoutFlow initialEdges={initialEdges} initialNodes={initialNodes} />
      </ReactFlowProvider>
    </main>
  );
}
