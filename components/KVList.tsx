import { Card, Form, List } from "@douyinfe/semi-ui";
import { FieldType } from "@lark-base-open/js-sdk";
import { Handle, Position } from "reactflow";

export function KVList(props: any) {
  return (
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
        // initValues={formatValues(props.data.data)}
      >
        {props.data.fields.map((item, i) => (
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
        ))}
      </Form>
    </Card>
  );
}

function formatValues(data: any[]) {
  return data.reduce((acc, c) => {
    acc[c.field] = c.value;
    return acc;
  }, {});
}
