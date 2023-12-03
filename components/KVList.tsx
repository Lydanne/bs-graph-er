import { Card, Form, List, Select } from "@douyinfe/semi-ui";
import { FieldType } from "@lark-base-open/js-sdk";
import { Handle, Position } from "reactflow";

export function KVList(props: any) {
  return (
    <div className="kvlist-node" id={props.id}>
      <Card
        style={{ background: "#fff" }}
        headerStyle={{ paddingTop: 15, paddingBottom: 15 }}
        bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
        title={
          <h1>
            {!props.data.start && (
              <Handle
                type="target"
                position={Position.Left}
                style={{ top: 30 }}
              />
            )}
            {props.data.label}
          </h1>
        }
      >
        <Form
          labelPosition="left"
          labelAlign="right"
          initValues={formatValues(props.data.data)}
          onClickCapture={(e) => {
            e.stopPropagation();
          }}
        >
          {props.data.fields.map((item: any, i: number) => {
            return (
              <div key={item.id}>
                <Form.Input
                  field={item.id}
                  label={item.label}
                  readonly
                  trigger="blur"
                  style={{ width: 200 }}
                />
                {(item.type === FieldType.SingleLink ||
                  item.type === FieldType.DuplexLink) && (
                  <Handle
                    id={item.id}
                    type="source"
                    style={{ top: i * 56 + 52 + 29 }}
                    position={Position.Right}
                  />
                )}
              </div>
            );
          })}
        </Form>
      </Card>
    </div>
  );
}

function mapCb(map: any, key: string, cb: any) {
  return map?.[key]?.() ?? cb();
}

function formatValues(data: any[] = []) {
  // const fieldMap = formatFieldsMap(fields);
  const r = data.reduce((acc, c) => {
    // const field = fieldMap[c.field];
    // if (field.type === FieldType.Text) {
    //   acc[c.field] = c.value?.[0]?.text;
    // } else if (field.type === FieldType.MultiSelect) {
    //   acc[c.field] = c.value?.map((item: any) => item.id) ?? [];
    // } else if (field.type === FieldType.DateTime) {
    //   acc[c.field] = c.value;
    // } else {
    //   const cell = c.value;
    //   acc[c.field] =
    //     typeof c === "object"
    //       ? cell?.text ??
    //         cell
    //           ?.map?.((item: any) => item.text ?? item.name ?? item.label)
    //           .join(",")
    //       : cell;
    // }
    acc[c.field] = c.value;
    return acc;
  }, {});
  // console.log({ r });

  return r;
}

function formatFieldsMap(fields: any[] = []) {
  return fields.reduce((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {});
}
