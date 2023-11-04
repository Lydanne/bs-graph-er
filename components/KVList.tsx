import { Card, Form, List } from "@douyinfe/semi-ui";
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
            <Handle type="target" position={Position.Left} />
          )}
          {props.data.label}
        </h1>
      }
    >
      <Form
        labelPosition="left"
        labelAlign="right"
        initValues={formatValues(props.data.data)}
      >
        {props.data.data.map((item, i) => (
          <div key={item.field}>
            <Form.Input
              field={item.field}
              label={item.label}
              initValue={item.value}
              readonly
              trigger="blur"
              style={{ width: 200 }}
            />
            {item.type === "link" && (
              <Handle
                id={item.field}
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
