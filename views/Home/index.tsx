import { Button, Empty, Spin, Toast } from "@douyinfe/semi-ui";
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./index.module.css";
import { useTranslation } from "next-i18next";
import { Node, ReactFlowProvider } from "reactflow";
import { LayoutFlow } from "@/components/LayoutFlow";
import { trans } from "./trans";

import { FieldType, ITable, bitable } from "@lark-base-open/js-sdk";
import mitt from "mitt";
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";

const options = ((window as any)?.options?.() as any) || {};

// const bs: { table?: ITable } = {};
// let pr: any;
const emitter = mitt();
// const p = new Promise((resolve) => (pr = resolve));
// setTimeout(async () => {
//   const table = await bitable.base.getActiveTable();
//   bs.table = table;
//   // const fieldList = await table.getFieldList();
//   // const tableList = await bitable.base.getTableList();
//   // pr(await bsTableTrans(tableList));
//   // console.log({ tableList }, ;
// });
if (!options.fullscreen) {
  bitable.base.onSelectionChange(async (e) => {
    emitter.emit("change-record", e);
    // console.log(record);
  });
}

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
      data: fields.map((item) => ({
        field: item.id,
        value: FieldType[item.type],
      })),
    });
  }

  return tables;
}

async function deepGet(recordId: any, tableId: any, dep: any = {}) {
  if (dep[recordId + tableId]) {
    return dep[recordId + tableId];
  }
  const table = await bitable.base.getTable(tableId);
  const fields = await table.getFieldMetaList();
  const record = await table.getRecordById(recordId);
  const result: any = {
    id: tableId,
    recordId,
    label: await table.getName(),
    fields: fields.map((item) => ({
      id: item.id,
      label: item.name,
      type: item.type,
      property: item.property,
      meta: item,
    })),
    data: [],
  };

  dep[recordId + tableId] = result;

  result.data = await Promise.all(
    fields.map(async (item) => {
      const value = record.fields[item.id] as any;
      return {
        field: item.id,
        value:
          item.type === FieldType.SingleLink ||
          item.type === FieldType.DuplexLink
            ? await Promise.all(
                value?.recordIds.map((rid: any) =>
                  deepGet(rid, value.tableId, dep)
                ) ?? []
              )
            : value,
      };
    })
  );

  return result;
}

/**
 * deep table => [nodes, edges]
 * @param table deepGet() return
 */
function deepTrans(
  table: any,
  nodes: any = [],
  edges: any = [],
  nodeDep: any = {},
  edgeDep: any = {}
) {
  const node = {
    id: table.recordId,
    type: "kvlist",
    position: { x: 0, y: 0 },
    data: {
      start: false,
      end: false,
      label: table.label,
      fields: table.fields,
      data: table.data,
    },
  };
  if (!nodeDep[node.id]) {
    nodes.push(node);
    nodeDep[node.id] = true;
  }

  for (let i = 0; i < table.fields.length; i++) {
    const field = table.fields[i];
    if (
      field.type !== FieldType.SingleLink &&
      field.type !== FieldType.DuplexLink
    )
      continue;
    const value = table.data[i].value;
    for (let i = 0; i < value.length; i++) {
      const v = value[i];
      const eid = table.recordId + "-" + v.recordId;
      if (edgeDep[eid]) continue;
      edgeDep[eid] = true;
      edges.push({
        id: eid,
        sourceHandle: field.id,
        source: table.recordId,
        target: v.recordId,
      } as any);
      deepTrans(v, nodes, edges, nodeDep, edgeDep);
    }
  }

  return [nodes, edges];
}

export default function Home() {
  const [t] = useTranslation();
  const [graph, setGraph] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [select, setSelect] = useState(false);
  useEffect(() => {
    // if (t) return;
    // t = true;
    // p.then((tables) => {
    //   console.log({ tables });

    //   const [initialNodes, initialEdges] = trans(tables);
    //   console.log({ initialNodes, initialEdges });
    //   setGraph({ initialNodes, initialEdges });
    // });
    if (options.fullscreen) {
      setSelect(true);
      setLoading(true);
      setGraph(options);
      setLoading(false);
      return;
    }
    emitter.on("change-record", async (e: any) => {
      // const tables = await p;

      // console.log(tables);
      setSelect(true);
      setLoading(true);
      console.log(e);
      const t = await deepGet(e.data.recordId, e.data.tableId);
      console.log(t);
      const g = deepTrans(t);
      console.log(g);
      setGraph({ initialNodes: g[0], initialEdges: g[1] });
      setLoading(false);
    });
    return () => {
      emitter.off("change-record");
    };
  });
  return (
    <main
      className={styles.main}
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!select ? (
        <Empty
          image={<IllustrationNoResult style={{ width: 150, height: 150 }} />}
          darkModeImage={
            <IllustrationNoResultDark style={{ width: 150, height: 150 }} />
          }
          description={t("empty-tip")}
        />
      ) : !loading ? (
        <ReactFlowProvider>
          <LayoutFlow {...graph} />
        </ReactFlowProvider>
      ) : (
        <div>
          <Spin size="large"></Spin>
        </div>
      )}
    </main>
  );
}
