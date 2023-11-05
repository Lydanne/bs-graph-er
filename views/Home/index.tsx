import { Button, Toast } from "@douyinfe/semi-ui";
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./index.module.css";
import { useTranslation } from "next-i18next";
import { Node, ReactFlowProvider } from "reactflow";
import { LayoutFlow } from "@/components/LayoutFlow";
import { trans } from "./trans";

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
        <LayoutFlow
          initialEdges={initialEdges as any}
          initialNodes={initialNodes as any}
        />
      </ReactFlowProvider>
    </main>
  );
}
