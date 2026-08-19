-- Seed data for tech_stacks table
-- Inserts the same data that was previously hardcoded in lib/i18n/en.ts and es.ts under techStack.groups

INSERT INTO tech_stacks (category, name, proficiency, years_experience, display_order) VALUES
  -- Frontend
  ('Frontend', 'Next.js', 'expert', 3, 1),
  ('Frontend', 'React', 'expert', 4, 2),
  ('Frontend', 'Vite', 'advanced', 2, 3),
  ('Frontend', 'Flutter', 'intermediate', 2, 4),
  ('Frontend', 'TypeScript', 'expert', 4, 5),
  ('Frontend', 'Tailwind CSS', 'advanced', 3, 6),

  -- Backend & Architecture
  ('Backend & Architecture', 'Python', 'expert', 4, 1),
  ('Backend & Architecture', 'FastAPI', 'advanced', 3, 2),
  ('Backend & Architecture', 'Django', 'advanced', 3, 3),
  ('Backend & Architecture', 'Nest.js', 'advanced', 3, 4),
  ('Backend & Architecture', 'Hexagonal Architecture', 'advanced', 3, 5),
  ('Backend & Architecture', 'Microservices', 'advanced', 3, 6),

  -- Databases & AI
  ('Databases & AI', 'PostgreSQL', 'advanced', 3, 1),
  ('Databases & AI', 'MongoDB', 'intermediate', 2, 2),
  ('Databases & AI', 'Redis', 'intermediate', 2, 3),
  ('Databases & AI', 'Supabase', 'advanced', 2, 4),
  ('Databases & AI', 'Firebase', 'intermediate', 2, 5),
  ('Databases & AI', 'LangGraph', 'intermediate', 1, 6),
  ('Databases & AI', 'RAG', 'intermediate', 1, 7),
  ('Databases & AI', 'YOLO', 'intermediate', 1, 8),
  ('Databases & AI', 'OpenCV', 'intermediate', 1, 9),

  -- Cloud & DevOps
  ('Cloud & DevOps', 'Docker', 'advanced', 3, 1),
  ('Cloud & DevOps', 'AWS', 'advanced', 3, 2),
  ('Cloud & DevOps', 'Railway', 'intermediate', 2, 3),
  ('Cloud & DevOps', 'Linux', 'advanced', 4, 4)
ON CONFLICT DO NOTHING;