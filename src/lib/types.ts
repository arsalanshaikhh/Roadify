export interface Category {
  id: string;
  label: string;
  color: string;
}

export interface RoadmapNode {
  id: string;
  label: string;
  required: boolean;
  phase: 'foundation' | 'core' | 'advanced';
  position: { x: number; y: number };
}

export interface RoadmapEdge {
  source: string;
  target: string;
}

export interface Roadmap {
  id: string;
  title: string;
  category: string;
  description: string;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

export interface Resource {
  title: string;
  url: string;
  type: 'docs' | 'video' | 'course' | 'article';
  free: boolean;
  rating?: number;
}

export interface SkillFrontmatter {
  title: string;
  description: string;
  topics: string[];
  prerequisites: string[];
  resources: Resource[];
  estimatedHours?: number;
}

export interface Skill extends SkillFrontmatter {
  slug: string;
  content: string;
}

export interface RoadmapStats {
  skillCount: number;
  freeResourceCount: number;
  paidResourceCount: number;
  estimatedHours: number;
}
