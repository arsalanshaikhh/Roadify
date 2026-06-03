import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Roadmap, Skill, SkillFrontmatter, Category } from './types';

const contentDir = path.join(process.cwd(), 'content');

export function parseSkillContent(slug: string, raw: string): Skill {
  const { data, content } = matter(raw);
  return { slug, ...(data as SkillFrontmatter), content };
}

export function parseRoadmapContent(json: string): Roadmap {
  return JSON.parse(json) as Roadmap;
}

export function getCategories(): Category[] {
  const raw = fs.readFileSync(path.join(contentDir, 'categories.json'), 'utf-8');
  return JSON.parse(raw);
}

export function getAllRoadmaps(): Roadmap[] {
  const dir = path.join(contentDir, 'roadmaps');
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => parseRoadmapContent(fs.readFileSync(path.join(dir, f), 'utf-8')));
}

export function getRoadmap(id: string): Roadmap | null {
  const filePath = path.join(contentDir, 'roadmaps', `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  return parseRoadmapContent(fs.readFileSync(filePath, 'utf-8'));
}

export function getSkill(slug: string): Skill | null {
  const filePath = path.join(contentDir, 'skills', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return parseSkillContent(slug, fs.readFileSync(filePath, 'utf-8'));
}

export function getAllSkillSlugs(): string[] {
  const dir = path.join(contentDir, 'skills');
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', ''));
}
