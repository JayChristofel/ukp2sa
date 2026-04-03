-- ==========================================
-- UKP2SA SUPABASE MIGRATION SCHEMA (FULL)
-- ==========================================
-- Run this in the Supabase SQL Editor.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PARTNERS (INSTANSI)
create table if not exists public.partners (
  id text primary key, -- Slug-style ID (e.g., 'p1', 'sar-nasional')
  name text not null,
  owner text,
  category text check (category in ('Satgas', 'K/L', 'Pemda', 'NGO', 'Mitra')) default 'Satgas',
  url text,
  image_src text,
  status text check (status in ('Active', 'Inactive')) default 'Active',
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. ROLES & PERMISSIONS (RBAC)
create table if not exists public.permissions (
  id text primary key, -- slug: 'reports:read'
  name text not null,
  module text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.roles (
  id text primary key, -- slug: 'admin', 'partner'
  name text not null,
  description text not null,
  permissions text[] default '{}', -- Array of permission IDs
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. USERS
create table if not exists public.users (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text unique not null,
  password text, 
  role text default 'public', -- References roles(id) but kept as text for flexibility
  instansi_id text references public.partners(id) on delete set null,
  status text default 'ACTIVE',
  avatar text,
  reset_token text,
  reset_token_expiry timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. REPORTS (LAPORAN)
create table if not exists public.reports (
  id text primary key,
  title text not null,
  description text not null,
  location text not null,
  regency text not null,
  district text,
  village text,
  address text,
  reporter_name text not null,
  contact_phone text, -- Encrypted
  nik text,           -- Encrypted
  latitude text,
  longitude text,
  status text check (status in ('Diproses', 'Selesai', 'Menunggu')) default 'Menunggu',
  category text not null,
  source text default 'rest',
  reporter_type text default 'masyarakat',
  is_verified boolean default false,
  images text[] default '{}',
  answers jsonb default '[]',
  admin_reply jsonb default null,
  satellite_intel jsonb default null,
  instansi_id text references public.partners(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ALIGNMENTS (Tumpang Tindih Lahan/Program)
create table if not exists public.alignments (
  id uuid default uuid_generate_v4() primary key,
  location text not null,
  is_overlapping boolean default false,
  conflict_details text,
  programs jsonb default '[]', -- Array of program objects
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. BENEFICIARIES (Penerima Manfaat)
create table if not exists public.beneficiaries (
  id uuid default uuid_generate_v4() primary key,
  nik text unique not null,
  name text not null,
  regency text not null,
  timeline jsonb default '[]', -- Array of timeline events
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. FINANCIAL RECORDS & KPI
create table if not exists public.financial_records (
  id uuid default uuid_generate_v4() primary key,
  instansi_id text references public.partners(id),
  program_name text not null,
  allocation numeric default 0,
  realization numeric default 0,
  percentage numeric default 0,
  source text not null,
  disbursement_stage text not null,
  history jsonb default '[]',
  last_update timestamp with time zone default now(),
  status text check (status in ('Draft', 'Final')) default 'Draft',
  order_id text,
  payment_status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.kpi_targets (
  id uuid default uuid_generate_v4() primary key,
  sector text not null,
  indicator text not null,
  unit text not null,
  target numeric default 0,
  actual numeric default 0,
  last_update timestamp with time zone default now(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. DASHBOARD METRICS (KEY-VALUE STORE)
create table if not exists public.dashboard_metrics (
  key text primary key,
  value jsonb not null,
  last_update timestamp with time zone default now(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. SATELLITE BLOGS & INTEL
create table if not exists public.public_updates (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  summary text not null,
  content text not null,
  category text not null,
  publish_date timestamp with time zone default now(),
  author text not null,
  image text,
  tags text[] default '{}',
  views integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.satellite_intel (
  id uuid default uuid_generate_v4() primary key,
  intel_id text not null,
  type text not null,
  value numeric not null,
  coordinates numeric[] not null, -- [lng, lat]
  timestamp timestamp with time zone default now(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. QUESTIONS & TOPICS (FORM SYSTEM)
create table if not exists public.topics (
  id integer primary key,
  name_id text not null,
  name_en text not null,
  count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.questions (
  id integer primary key,
  topic_id integer references public.topics(id) on delete cascade,
  parent_id integer,
  question_id text not null,
  question_en text not null,
  question_type text not null,
  options jsonb default '[]',
  required boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. TASKS
create table if not exists public.tasks (
  id uuid default uuid_generate_v4() primary key,
  report_id text references public.reports(id) on delete set null,
  title text not null,
  assigned_to text references public.partners(id),
  assigned_to_category text not null,
  priority text default 'Medium',
  status text default 'Pending',
  deadline text,
  notes text,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. AUDIT LOGS & NOTIFICATIONS
create table if not exists public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  action text not null,
  module text not null,
  details text,
  level text default 'info',
  user_email text,
  user_name text,
  ip text,
  ua text,
  diff jsonb,
  meta jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  type text default 'system',
  priority text default 'low',
  action_label text,
  link text,
  external_id text unique,
  is_read boolean default false,
  read_by uuid[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 13. AUTH UTILS (LOGINS & RESETS)
create table if not exists public.login_attempts (
  id uuid default uuid_generate_v4() primary key,
  email text not null,
  ip text,
  success boolean,
  created_at timestamp with time zone default now()
);

create table if not exists public.password_resets (
  id uuid default uuid_generate_v4() primary key,
  email text not null,
  token text unique not null,
  expires_at timestamp with time zone not null,
  used boolean default false,
  created_at timestamp with time zone default now()
);

-- Triggers for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_partners_updated_at before update on public.partners for each row execute procedure update_updated_at_column();
create trigger update_users_updated_at before update on public.users for each row execute procedure update_updated_at_column();
create trigger update_reports_updated_at before update on public.reports for each row execute procedure update_updated_at_column();
create trigger update_notifications_updated_at before update on public.notifications for each row execute procedure update_updated_at_column();
create trigger update_roles_updated_at before update on public.roles for each row execute procedure update_updated_at_column();
create trigger update_permissions_updated_at before update on public.permissions for each row execute procedure update_updated_at_column();
create trigger update_alignments_updated_at before update on public.alignments for each row execute procedure update_updated_at_column();
create trigger update_beneficiaries_updated_at before update on public.beneficiaries for each row execute procedure update_updated_at_column();
create trigger update_financial_records_updated_at before update on public.financial_records for each row execute procedure update_updated_at_column();
create trigger update_kpi_targets_updated_at before update on public.kpi_targets for each row execute procedure update_updated_at_column();
create trigger update_dashboard_metrics_updated_at before update on public.dashboard_metrics for each row execute procedure update_updated_at_column();
create trigger update_public_updates_updated_at before update on public.public_updates for each row execute procedure update_updated_at_column();
create trigger update_topics_updated_at before update on public.topics for each row execute procedure update_updated_at_column();
create trigger update_questions_updated_at before update on public.questions for each row execute procedure update_updated_at_column();
create trigger update_tasks_updated_at before update on public.tasks for each row execute procedure update_updated_at_column();

-- 15. REFRESH TOKENS (MOBILE)
create table if not exists public.refresh_tokens (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  token text unique not null,
  expires_at timestamp with time zone not null,
  is_revoked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
