import { describe, it, expect } from 'vitest';
import { parseSkillContent, parseRoadmapContent } from './content';

const SKILL_MDX = `---
title: React
description: A JS library for building UIs
topics:
  - Components
  - Hooks
prerequisites:
  - javascript
resources:
  - title: React Docs
    url: https://react.dev
    type: docs
    free: true
---

Optional body content.
`;

const ROADMAP_JSON = JSON.stringify({
  id: 'frontend-engineer',
  title: 'Frontend Engineer',
  category: 'software',
  description: 'Build UIs',
  nodes: [
    { id: 'react', label: 'React', required: true, phase: 'core', position: { x: 0, y: 0 } },
  ],
  edges: [{ source: 'javascript', target: 'react' }],
});

describe('parseSkillContent', () => {
  it('extracts title and description from frontmatter', () => {
    const skill = parseSkillContent('react', SKILL_MDX);
    expect(skill.title).toBe('React');
    expect(skill.description).toBe('A JS library for building UIs');
  });

  it('extracts topics array', () => {
    const skill = parseSkillContent('react', SKILL_MDX);
    expect(skill.topics).toEqual(['Components', 'Hooks']);
  });

  it('extracts prerequisites array', () => {
    const skill = parseSkillContent('react', SKILL_MDX);
    expect(skill.prerequisites).toEqual(['javascript']);
  });

  it('extracts resources with all fields', () => {
    const skill = parseSkillContent('react', SKILL_MDX);
    expect(skill.resources).toHaveLength(1);
    expect(skill.resources[0]).toEqual({
      title: 'React Docs',
      url: 'https://react.dev',
      type: 'docs',
      free: true,
    });
  });

  it('sets the slug from the argument', () => {
    const skill = parseSkillContent('react', SKILL_MDX);
    expect(skill.slug).toBe('react');
  });

  it('captures markdown body content', () => {
    const skill = parseSkillContent('react', SKILL_MDX);
    expect(skill.content.trim()).toBe('Optional body content.');
  });
});

describe('parseRoadmapContent', () => {
  it('parses roadmap id and title', () => {
    const roadmap = parseRoadmapContent(ROADMAP_JSON);
    expect(roadmap.id).toBe('frontend-engineer');
    expect(roadmap.title).toBe('Frontend Engineer');
  });

  it('parses nodes with required and phase', () => {
    const roadmap = parseRoadmapContent(ROADMAP_JSON);
    expect(roadmap.nodes).toHaveLength(1);
    expect(roadmap.nodes[0].required).toBe(true);
    expect(roadmap.nodes[0].phase).toBe('core');
  });

  it('parses edges', () => {
    const roadmap = parseRoadmapContent(ROADMAP_JSON);
    expect(roadmap.edges[0]).toEqual({ source: 'javascript', target: 'react' });
  });
});

import { getRoadmapStats } from './content';
import type { Roadmap } from './types';

const TEST_ROADMAP: Roadmap = {
  id: 'frontend-engineer',
  title: 'Frontend Engineer',
  category: 'software',
  description: 'Test',
  nodes: [
    { id: 'html-css', label: 'HTML & CSS', required: true, phase: 'foundation', position: { x: 0, y: 0 } },
  ],
  edges: [],
};

describe('getRoadmapStats', () => {
  it('returns skillCount equal to node count', () => {
    const stats = getRoadmapStats(TEST_ROADMAP);
    expect(stats.skillCount).toBe(1);
  });

  it('returns non-negative freeResourceCount', () => {
    const stats = getRoadmapStats(TEST_ROADMAP);
    expect(stats.freeResourceCount).toBeGreaterThanOrEqual(0);
  });

  it('returns estimatedHours as a number', () => {
    const stats = getRoadmapStats(TEST_ROADMAP);
    expect(typeof stats.estimatedHours).toBe('number');
  });
});
