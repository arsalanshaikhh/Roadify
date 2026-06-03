'use client';

import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useRouter } from 'next/navigation';
import SkillNode from './SkillNode';
import type { RoadmapNode, RoadmapEdge } from '@/lib/types';

const nodeTypes = { skill: SkillNode };

interface Props {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  fromRole: string;
}

export default function RoadmapGraph({ nodes, edges, fromRole }: Props) {
  const router = useRouter();

  const flowNodes: Node[] = nodes.map((n) => ({
    id: n.id,
    type: 'skill',
    position: n.position,
    data: { label: n.label, required: n.required, phase: n.phase },
  }));

  const flowEdges: Edge[] = edges.map((e, i) => ({
    id: `e-${i}`,
    source: e.source,
    target: e.target,
    style: { stroke: '#475569' },
  }));

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      router.push(`/skill/${node.id}?from=${fromRole}`);
    },
    [router, fromRole]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        className="bg-gray-950"
      >
        <Background color="#1e293b" gap={24} />
        <Controls className="!bg-gray-900 !border-gray-700 !text-gray-300" />
      </ReactFlow>
    </div>
  );
}
