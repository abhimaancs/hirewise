-- Run this in Supabase SQL Editor (supabase.com > your project > SQL Editor)

-- Profiles table (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('candidate', 'company')),
  name text not null,
  email text not null,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Candidate details
create table candidate_profiles (
  id uuid references profiles on delete cascade primary key,
  college text,
  skills text[] default '{}',
  experience_years int default 0,
  resume_url text,
  resume_text text,
  bio text,
  location text
);

-- Company details
create table company_profiles (
  id uuid references profiles on delete cascade primary key,
  company_name text not null,
  website text,
  description text,
  location text
);

-- Jobs
create table jobs (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references profiles on delete cascade not null,
  title text not null,
  description text not null,
  required_skills text[] default '{}',
  location text not null,
  salary_range text,
  job_type text check (job_type in ('full-time', 'part-time', 'internship', 'remote')) default 'full-time',
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Conversations (between a candidate and company)
create table conversations (
  id uuid default gen_random_uuid() primary key,
  candidate_id uuid references profiles on delete cascade not null,
  company_id uuid references profiles on delete cascade not null,
  job_id uuid references jobs on delete set null,
  created_at timestamp with time zone default now(),
  unique(candidate_id, company_id, job_id)
);

-- Messages
create table messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references conversations on delete cascade not null,
  sender_id uuid references profiles on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table candidate_profiles enable row level security;
alter table company_profiles enable row level security;
alter table jobs enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

-- Policies: profiles visible to all logged-in users
create policy "Profiles are viewable by everyone" on profiles for select using (auth.role() = 'authenticated');
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Jobs visible to all, only company can insert/update
create policy "Jobs are viewable by everyone" on jobs for select using (true);
create policy "Companies can manage their jobs" on jobs for all using (auth.uid() = company_id);

-- Messages: only conversation participants can see/send
create policy "Conversation participants can view messages" on messages
  for select using (
    auth.uid() in (
      select candidate_id from conversations where id = conversation_id
      union
      select company_id from conversations where id = conversation_id
    )
  );

create policy "Conversation participants can send messages" on messages
  for insert with check (
    auth.uid() = sender_id and
    auth.uid() in (
      select candidate_id from conversations where id = conversation_id
      union
      select company_id from conversations where id = conversation_id
    )
  );

-- Enable realtime for messages
alter publication supabase_realtime add table messages;
