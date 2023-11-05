import { FieldType } from "@lark-base-open/js-sdk";

export function trans(tables = []) {
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
        fields: table.fields,
        data: table.data,
      },
      // sourcePosition: "right",
      // targetPosition: "left",
    };
    nodes.push(node);
    for (let j = 0; j < table.fields.length; j++) {
      const field = table.fields[j];
      // const d = table.data[j];
      if (
        field.type === FieldType.SingleLink ||
        field.type === FieldType.DuplexLink
      ) {
        // for (let i = 0; i < d.value.length; i++) {
        const id = field.property.tableId; //d.value[i];
        const edge = {
          id: table.id + "-" + field.id + "-" + id,
          sourceHandle: field.id,
          source: table.id,
          target: id,
        };
        if (nodes[0].id === edge.target) {
          isLoop = true;
          edges.push({
            id: "root-ref-edge" + edge.id + "-" + edge.source,
            sourceHandle: edge.sourceHandle,
            source: edge.source,
            target: "root-ref",
          });
        } else {
          edges.push(edge);
        }
        // }
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
