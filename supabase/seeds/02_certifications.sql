-- Seed data for certifications table
-- Inserts the same data that was previously hardcoded in lib/site-data.ts

INSERT INTO certifications (issuer, name, url) VALUES
  ('AWS Academy', 'Cloud Foundations', 'https://www.credly.com/go/7rICEgFK'),
  ('AWS Academy', 'Cloud Operations', 'https://www.credly.com/go/9rxSOtxR'),
  ('AWS Academy', 'Cloud Security Foundations', 'https://www.credly.com/go/l6gfX93S'),
  ('Cisco', 'Introduction to Cybersecurity', '/badges/I2CSUpdate20260623-30-5vf9uf.pdf'),
  ('Cisco', 'Introduction to IoT', '/badges/IntrotoIoTUpdate20260623-30-od6ruh.pdf'),
  ('Cisco', 'Network Support and Security', '/badges/NetworkSupportandSecurityUpdate20260623-30-bxoehw.pdf'),
  ('Cisco', 'Operating Systems Basics', '/badges/OperatingSystemsBasicsUpdate20260623-31-wihhfg.pdf'),
  ('Kaggle', 'Computer Vision', 'https://www.kaggle.com/danielperegrino')
ON CONFLICT DO NOTHING;