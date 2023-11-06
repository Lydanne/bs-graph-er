import { Button, Toast } from "@douyinfe/semi-ui";
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./index.module.css";
import { useTranslation } from "next-i18next";

import ReactFlow, {
  Background,
  BackgroundVariant,
  ControlButton,
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
import { IconExpand } from "@douyinfe/semi-icons";

const nodeTypes = {
  kvlist: KVList,
};

export const LayoutFlow = ({
  initialNodes = [],
  initialEdges = [],
  fullscreen = false,
}) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      {
        direction: "LR",
      }
    );

    setNodes([...(layoutedNodes as any)]);
    setEdges([...layoutedEdges]);

    window.requestAnimationFrame(() => {
      fitView();
    });
  }, [nodes, edges]);

  // useEffect(() => {
  //   setEdges(initialEdges);
  //   setNodes(initialNodes);
  // }, [initialNodes, initialEdges, setEdges, setNodes]);

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

  const expand = useCallback(() => {
    const nw = open("/", "_block");
    if (nw) {
      (nw as any).options = () => ({
        initialEdges,
        initialNodes,
        fullscreen: true,
      });
    }
  }, [initialEdges, initialNodes]);

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
      minZoom={0.1}
    >
      <Controls>
        {!fullscreen && (
          <ControlButton onClick={() => expand()}>
            <IconExpand />
          </ControlButton>
        )}
      </Controls>
      {fullscreen && <MiniMap />}
      <NodeToolbar />
      {/* <NodeResizer /> */}
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  );
};
