import { Button, Toast } from "@douyinfe/semi-ui";
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./index.module.css";
import { useTranslation } from "next-i18next";
import { Node, ReactFlowProvider } from "reactflow";
import { LayoutFlow } from "@/components/LayoutFlow";
import { trans } from "./trans";

import { ITable, bitable } from "@lark-base-open/js-sdk";
const bs: { table?: ITable } = {};
let pr: any;
const p = new Promise((resolve) => (pr = resolve));
setTimeout(async () => {
  // const table = await bitable.base.getActiveTable();
  // bs.table = table;
  // const fieldList = await table.getFieldList();
  const tableList = await bitable.base.getTableList();
  pr(await bsTableTrans(tableList));
  // console.log({ tableList }, ;
  // bitable.base.onSelectionChange((e) => {
  //   console.log(e);
  // });
});

async function bsTableTrans(bsTableList: ITable[]) {
  const tables = [];

  for (let i = 0; i < bsTableList.length; i++) {
    const bsTable = bsTableList[i];
    const name = await bsTable.getName();
    const fields = await bsTable
      .getFieldList()
      .then((list) => Promise.all(list.map((item) => item.getMeta())));
    const primary = fields.find((item) => item.isPrimary);
    tables.push({
      id: bsTable.id,
      label: name,
      primary: primary?.id,
      meta: bsTable,
      fields: fields.map((item) => ({
        id: item.id,
        label: item.name,
        type: item.type,
        property: item.property,
        meta: item,
      })),
      data: [],
    });
  }

  return tables;
}

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
let t = false;
export default function Home() {
  const [graph, setGraph] = useState<any>({});
  useEffect(() => {
    if (t) return;
    t = true;
    p.then((tables) => {
      console.log({ tables });

      const [initialNodes, initialEdges] = trans(tables);
      console.log({ initialNodes, initialEdges });
      setGraph({ initialNodes, initialEdges });
    });
  });
  return (
    <main className={styles.main} style={{ width: "100vw", height: "100vh" }}>
      {graph.initialEdges ? (
        <ReactFlowProvider>
          <LayoutFlow
            initialEdges={graph.initialEdges as any}
            initialNodes={graph.initialNodes as any}
          />
        </ReactFlowProvider>
      ) : (
        <></>
      )}
    </main>
  );
}
