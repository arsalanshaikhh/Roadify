'use client';

import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useRouter } from 'next/navigation';
import SkillNode from './SkillNode';
import { useProgress } from '@/context/ProgressContext';
import type { RoadmapNode, RoadmapEdge } from '@/lib/types';

const nodeTypes = { skill: SkillNode };

interface Props {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  fromRole: string;
}

export default function RoadmapGraph({ nodes, edges, fromRole }: Props) {
  const router = useRouter();
  const { isComplete } = useProgress();
  const rfRef = useRef<ReactFlowInstance | null>(null);

  const flowNodes: Node[] = nodes.map((n) => ({
    id: n.id,
    type: 'skill',
    position: n.position,
    data: { label: n.label, required: n.required, phase: n.phase, isComplete: isComplete(n.id) },
  }));

  const flowEdges: Edge[] = edges.map((e, i) => ({
    id: `e-${i}`,
    source: e.source,
    target: e.target,
    animated: true,
    style: { stroke: '#475569', strokeWidth: 1.5 },
  }));

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      router.push(`/skill/${node.id}?from=${fromRole}`);
    },
    [router, fromRole]
  );

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onInit={(instance) => { rfRef.current = instance; }}
        fitView
        className="bg-gray-950"
      >
        <Background color="#1e293b" gap={24} />
        <Controls className="!bg-gray-900 !border-gray-700 !text-gray-300" />
        <MiniMap
          className="!bg-gray-900 !border-gray-700"
          nodeColor={(n) => {
            const d = n.data as { isComplete?: boolean; phase?: string };
            if (d.isComplete) return '#10b981';
            return d.phase === 'foundation' ? '#6366f1' : d.phase === 'core' ? '#0ea5e9' : '#10b981';
          }}
          maskColor="rgba(0,0,0,0.4)"
        />
      </ReactFlow>
      <button
        onClick={() => rfRef.current?.fitView()}
        title="Reset view"
        className="absolute bottom-20 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-gray-900 text-gray-400 hover:text-white hover:border-gray-500 transition-colors shadow"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
