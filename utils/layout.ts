import Dagre from "@dagrejs/dagre";

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

export const getLayoutedElements = (
  nodes: any[],
  edges: any[],
  options: { direction: any }
) => {
  g.setGraph({
    rankdir: options.direction,
  });

  const els = document.querySelectorAll(".kvlist-node");

  const elMap: any = Array.from(els).reduce((acc, el) => {
    const id = el.id;

    return { ...acc, [id]: el.clientHeight };
  }, {});

  edges.forEach(
    (edge: {
      source: Dagre.Edge;
      target: string | { [key: string]: any } | undefined;
    }) => g.setEdge(edge.source, edge.target)
  );
  nodes.forEach((node: any) =>
    g.setNode(
      node.id,
      Object.assign(node, { width: 400, height: elMap[node.id] })
    )
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node: { id: string | Dagre.Label }) => {
      const { x, y } = g.node(node.id);

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};
