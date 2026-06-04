'use client';

import { useEffect } from 'react';
import { useProgress } from '@/context/ProgressContext';
import type { RoadmapNode, RoadmapEdge } from '@/lib/types';
import RoadmapGraphClient from './RoadmapGraphClient';

interface Props {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  fromRole: string;
}

export default function RoadmapPageClient({ nodes, edges, fromRole }: Props) {
  const { completedSlugs } = useProgress();

  const allComplete = nodes.length > 0 && nodes.every((n) => completedSlugs.has(n.id));

  useEffect(() => {
    if (!allComplete) return;
    const key = `roadify_confetti_${fromRole}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    import('canvas-confetti').then((mod) => {
      mod.default({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b'],
      });
    });
  }, [allComplete, fromRole]);

  return <RoadmapGraphClient nodes={nodes} edges={edges} fromRole={fromRole} />;
}
