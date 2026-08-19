-- Seed data for projects table
-- Inserts the same data that was previously hardcoded in lib/i18n/en.ts and es.ts

INSERT INTO projects (title, description, url, tags, project_type) VALUES
  ('Corporate Web Platform', 'Full stack website with admin panel, blog and authentication. Built with Next.js and a microservices backend.', 'https://vercel.com', ARRAY['Next.js', 'TypeScript', 'PostgreSQL'], 'web'),
  ('Figma Design System', 'Complete design system based on Atomic Design with tokens, components and interactive documentation.', 'https://www.figma.com/community', ARRAY['Figma', 'Design System', 'Atomic Design'], 'figma'),
  ('Indie Game on Itch.io', '2D game prototype with platformer mechanics, published on Itch.io for community feedback.', 'https://itch.io', ARRAY['GameDev', 'Pixel Art', 'WebGL'], 'game')
ON CONFLICT DO NOTHING;