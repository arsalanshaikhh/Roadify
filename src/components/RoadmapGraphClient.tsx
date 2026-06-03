'use client';

import dynamic from 'next/dynamic';
import type { RoadmapNode, RoadmapEdge } from '@/lib/types';

const RoadmapGraph = dynamic(() => import('@/components/RoadmapGraph'), { ssr: false });

interface Props {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  fromRole: string;
}

export default function RoadmapGraphClient({ nodes, edges, fromRole }: Props) {
  return <RoadmapGraph nodes={nodes} edges={edges} fromRole={fromRole} />;
}
