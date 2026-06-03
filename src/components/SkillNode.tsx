import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';

interface SkillNodeData extends Record<string, unknown> {
  label: string;
  required: boolean;
  phase: 'foundation' | 'core' | 'advanced';
}

type SkillNode = Node<SkillNodeData>;

const phaseColors: Record<string, string> = {
  foundation: 'border-indigo-500',
  core: 'border-sky-500',
  advanced: 'border-emerald-500',
};

export default function SkillNode({ data }: NodeProps<SkillNode>) {
  return (
    <div
      className={`rounded-lg border-2 bg-gray-900 px-3 py-2 text-sm text-white shadow ${phaseColors[data.phase]}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-600" />
      <span>{data.label}</span>
      {data.required ? (
        <span className="ml-2 text-xs text-red-400">req</span>
      ) : (
        <span className="ml-2 text-xs text-sky-400">opt</span>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-gray-600" />
    </div>
  );
}
