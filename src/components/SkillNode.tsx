import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';

interface SkillNodeData extends Record<string, unknown> {
  label: string;
  required: boolean;
  phase: 'foundation' | 'core' | 'advanced';
  isComplete?: boolean;
}

type SkillNode = Node<SkillNodeData>;

const phaseColors: Record<string, string> = {
  foundation: 'border-indigo-500',
  core: 'border-sky-500',
  advanced: 'border-emerald-500',
};

export default function SkillNode({ data }: NodeProps<SkillNode>) {
  const nodeData = data as SkillNodeData;
  const isComplete = nodeData.isComplete;

  return (
    <div
      title={`${nodeData.label} — click to explore resources`}
      className={`relative rounded-lg border-2 px-3 py-2 text-sm shadow cursor-pointer transition-all ${
        isComplete
          ? 'border-emerald-500 bg-emerald-950/80 text-emerald-300'
          : `${phaseColors[nodeData.phase]} bg-gray-900 text-white hover:brightness-110`
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-600" />
      <div className="flex items-center gap-2">
        {isComplete && <span className="text-emerald-400 text-xs">✓</span>}
        <span className={isComplete ? 'line-through opacity-70' : ''}>{nodeData.label}</span>
        {!isComplete && (nodeData.required ? (
          <span className="text-xs text-red-400">req</span>
        ) : (
          <span className="text-xs text-sky-400">opt</span>
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-600" />
    </div>
  );
}
