# Supabase Migrations for Portfolio Website

This directory contains SQL migration files for the portfolio website's Supabase database.

## Migration Order

1. `000000_create_updated_at_function.sql` - Creates the `update_updated_at_column()` trigger function
2. `000001_create_profiles_table.sql` - Extends auth.users with profile information (roles, etc.)
3. `000002_create_projects_table.sql` - Stores project information (replaces hardcoded data in i18n files)
4. `000003_create_certifications_table.sql` - Stores certification information (replaces hardcoded array in site-data.ts)
5. `000004_create_contact_form_submissions_table.sql` - Stores form submissions from the contact form
6. `000005_create_site_settings_table.sql` - Stores configurable site settings (CV paths, etc.)
7. `000006_create_tech_stacks_table.sql` - Stores technology stack information (replaces hardcoded data in i18n files)

## Tables Overview

### profiles

Extends the built-in `auth.users` table with additional profile information

- Stores user role (user/admin) for access control
- Additional fields like username, full name, avatar, website
- Enables role-based access control for admin features

### projects

Replaces the hardcoded project data found in `lib/i18n/en.ts` and `es.ts` under `projects.items`

- Stores project title, description, URL, tags, type, etc.
- Allows adding/removing/updating projects without code changes

### certifications

Replaces the hardcoded `certifications` array in `lib/site-data.ts`

- Stores certification name, issuer, URL, etc.
- Allows managing certifications through database instead of code/constants

### contact_form_submissions

Stores submissions from the contact form in the RedFox_Solutions section

- Includes all form fields plus metadata (IP, user agent, timestamps)
- Includes status tracking for admin workflow (new, read, replied, archived)

### site_settings

Stores key-value pairs for site-wide configurable settings

- Currently used for CV file paths
- Extensible for other settings like site title, meta tags, etc.

### tech_stacks

Replaces the hardcoded tech stack data found in `lib/i18n/en.ts` and `es.ts` under `techStack.groups`

- Organizes technologies by category (Frontend, Backend & Architecture, etc.)
- Includes optional proficiency, years experience, display ordering
- Allows dynamic management of技术栈 without code deploys

## Applying Migrations

These migrations can be applied through:

1. Supabase Dashboard → SQL Editor
2. Supabase CLI: `supabase db push`
3. Once MCP authentication is working, via the Supabase MCP tools

## Seed Data

Initial data matching the previous hardcoded values can be found in the `seeds/` directory:

- `01_projects.sql` - Project data
- `02_certifications.sql` - Certification data
- `03_site_settings.sql` - CV path settings
- `04_tech_stacks.sql` - Technology stack data

These can be applied after the migrations using:

```bash
# Via psql
psql $SUPABASE_DB_URL -f supabase/seeds/01_projects.sql

# Or via Supabase CLI once available
# supabase db push --seed
```

## Notes

- All tables have Row Level Security (RLS) enabled with appropriate policies
- Public read access is enabled where needed for frontend consumption
- Write access is restricted to authenticated users (admins where appropriate)
- Each table includes `created_at` and `updated_at` timestamps
- The `update_updated_at_column()` function is used to automatically update timestamps
- For admin access control, check the `role` column in the `profiles` table
