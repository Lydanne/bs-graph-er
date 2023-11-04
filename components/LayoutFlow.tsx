import { Button, Toast } from "@douyinfe/semi-ui";
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./index.module.css";
import { useTranslation } from "next-i18next";

import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  NodeResizer,
  NodeToolbar,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";

import "reactflow/dist/style.css";
import { getLayoutedElements } from "@/utils/layout";
import { KVList } from "./KVList";

const nodeTypes = {
  kvlist: KVList,
};

export const LayoutFlow = ({ initialNodes = [], initialEdges = [] }) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );

    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);

    window.requestAnimationFrame(() => {
      fitView();
    });
  }, [nodes, edges]);

  useEffect(() => {});

  const onConnect = useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
    [setEdges]
  );

  const onInit = useCallback(
    (t: any) => {
      onLayout();
      setTimeout(() => {
        t.fitView({ maxZoom: 0.9 });
      });
    },
    [onLayout]
  );

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      attributionPosition="bottom-left"
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={onInit}
    >
      <Controls />
      <MiniMap />
      <NodeToolbar />
      <NodeResizer />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  );
};
