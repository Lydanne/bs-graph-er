import { stratify, tree } from "d3-hierarchy";

const g = tree();

export const getLayoutedElements = (nodes: string | any[], edges: any[]) => {
  if (nodes.length === 0) return { nodes, edges };

  const { width, height } = document
    .querySelector(`[data-id="${nodes[0].id}"]`)
    .getBoundingClientRect();
  const hierarchy = stratify()
    .id((node: { id: any }) => node.id)
    .parentId(
      (node: { id: any }) =>
        edges.find((edge) => edge.target === node.id)?.source
    );
  const root = hierarchy(nodes);

  // 增加水平和垂直间距
  const horizontalSpacing = 100; // 调整水平间距
  const verticalSpacing = 50; // 调整垂直间距
  const layout = g.size([
    height * 2 + verticalSpacing,
    width * 2 + horizontalSpacing,
  ])(root);

  return {
    nodes: layout.descendants().map((node: { data: any; x: any; y: any }) => ({
      ...node.data,
      position: { x: node.y, y: node.x },
    })),
    edges,
  };
};
