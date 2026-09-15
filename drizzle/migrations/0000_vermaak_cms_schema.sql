-- ============ roles ============
create type public.app_role as enum ('admin', 'editor', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_editor(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','editor'))
$$;

create policy "Users read own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid());
create policy "Admins read all roles" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- ============ profiles ============
create table public.profiles (
  id uuid primary key,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Users read own profile" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "Users update own profile" on public.profiles
  for update to authenticated using (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  -- first user becomes admin so the team can access the CMS
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ shared timestamp trigger ============
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- ============ ventures ============
create type public.venture_status as enum ('active', 'developing', 'coming_soon');

create table public.ventures (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  categories text[] not null default '{}',
  category text,
  logo_url text,
  cover_image_url text,
  url text,
  cta_label text,
  status public.venture_status not null default 'active',
  featured boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.ventures to anon;
grant select, insert, update, delete on public.ventures to authenticated;
grant all on public.ventures to service_role;
alter table public.ventures enable row level security;
create policy "Ventures are public" on public.ventures for select using (true);
create policy "Editors manage ventures" on public.ventures for all to authenticated
  using (public.is_editor(auth.uid())) with check (public.is_editor(auth.uid()));
create trigger ventures_updated_at before update on public.ventures
  for each row execute function public.set_updated_at();

-- ============ projects ============
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  client text,
  sector text,
  description text,
  image_url text,
  services text[] not null default '{}',
  year int,
  impact text,
  case_study_url text,
  featured boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.projects to anon;
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "Projects are public" on public.projects for select using (true);
create policy "Editors manage projects" on public.projects for all to authenticated
  using (public.is_editor(auth.uid())) with check (public.is_editor(auth.uid()));
create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- ============ insights ============
create table public.insights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  author text,
  published_at date not null default current_date,
  category text,
  image_url text,
  excerpt text,
  content text,
  tags text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.insights to anon;
grant select, insert, update, delete on public.insights to authenticated;
grant all on public.insights to service_role;
alter table public.insights enable row level security;
create policy "Published insights are public" on public.insights for select using (published);
create policy "Editors manage insights" on public.insights for all to authenticated
  using (public.is_editor(auth.uid())) with check (public.is_editor(auth.uid()));
create trigger insights_updated_at before update on public.insights
  for each row execute function public.set_updated_at();

-- ============ partners ============
create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  category text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.partners to anon;
grant select, insert, update, delete on public.partners to authenticated;
grant all on public.partners to service_role;
alter table public.partners enable row level security;
create policy "Partners are public" on public.partners for select using (true);
create policy "Editors manage partners" on public.partners for all to authenticated
  using (public.is_editor(auth.uid())) with check (public.is_editor(auth.uid()));

-- ============ team ============
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text,
  bio text,
  photo_url text,
  linkedin_url text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.team_members to anon;
grant select, insert, update, delete on public.team_members to authenticated;
grant all on public.team_members to service_role;
alter table public.team_members enable row level security;
create policy "Team is public" on public.team_members for select using (true);
create policy "Editors manage team" on public.team_members for all to authenticated
  using (public.is_editor(auth.uid())) with check (public.is_editor(auth.uid()));

-- ============ stats ============
create table public.stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  suffix text,
  display_order int not null default 0
);
grant select on public.stats to anon;
grant select, insert, update, delete on public.stats to authenticated;
grant all on public.stats to service_role;
alter table public.stats enable row level security;
create policy "Stats are public" on public.stats for select using (true);
create policy "Editors manage stats" on public.stats for all to authenticated
  using (public.is_editor(auth.uid())) with check (public.is_editor(auth.uid()));

-- ============ timeline ============
create table public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  title text not null,
  description text,
  display_order int not null default 0
);
grant select on public.timeline_events to anon;
grant select, insert, update, delete on public.timeline_events to authenticated;
grant all on public.timeline_events to service_role;
alter table public.timeline_events enable row level security;
create policy "Timeline is public" on public.timeline_events for select using (true);
create policy "Editors manage timeline" on public.timeline_events for all to authenticated
  using (public.is_editor(auth.uid())) with check (public.is_editor(auth.uid()));

-- ============ services ============
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  capabilities text[] not null default '{}',
  deliverables text[] not null default '{}',
  display_order int not null default 0
);
grant select on public.services to anon;
grant select, insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "Services are public" on public.services for select using (true);
create policy "Editors manage services" on public.services for all to authenticated
  using (public.is_editor(auth.uid())) with check (public.is_editor(auth.uid()));

-- ============ site settings ============
create table public.site_settings (
  key text primary key,
  value text,
  label text,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon;
grant select, insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "Settings are public" on public.site_settings for select using (true);
create policy "Editors manage settings" on public.site_settings for all to authenticated
  using (public.is_editor(auth.uid())) with check (public.is_editor(auth.uid()));

-- ============ leads ============
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organisation text,
  email text not null,
  phone text,
  country text,
  area_of_interest text,
  message text not null,
  created_at timestamptz not null default now()
);
grant insert on public.contact_submissions to anon;
grant select, insert, delete on public.contact_submissions to authenticated;
grant all on public.contact_submissions to service_role;
alter table public.contact_submissions enable row level security;
create policy "Anyone can submit an enquiry" on public.contact_submissions for insert to anon, authenticated with check (true);
create policy "Editors read enquiries" on public.contact_submissions for select to authenticated using (public.is_editor(auth.uid()));
create policy "Editors delete enquiries" on public.contact_submissions for delete to authenticated using (public.is_editor(auth.uid()));

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null unique,
  created_at timestamptz not null default now()
);
grant insert on public.newsletter_subscribers to anon;
grant select, insert, delete on public.newsletter_subscribers to authenticated;
grant all on public.newsletter_subscribers to service_role;
alter table public.newsletter_subscribers enable row level security;
create policy "Anyone can subscribe" on public.newsletter_subscribers for insert to anon, authenticated with check (true);
create policy "Editors read subscribers" on public.newsletter_subscribers for select to authenticated using (public.is_editor(auth.uid()));
create policy "Editors delete subscribers" on public.newsletter_subscribers for delete to authenticated using (public.is_editor(auth.uid()));

-- ============ seed ============
insert into public.ventures (name, slug, short_description, full_description, categories, url, cta_label, status, display_order) values
('Vermaak Academy','vermaak-academy','A learning and skills platform designed to equip individuals and organisations with practical capabilities for the digital economy.','Vermaak Academy delivers professional training, masterclasses and structured programmes that build digital, creative and technical capability for individuals, teams and institutions across Africa.','{"Professional training","Masterclasses","Digital skills","Technology","Creative skills","Future of work"}','https://academy.vermaak.africa','Visit Vermaak Academy','active',1),
('Vermaak Consults','vermaak-consults','A consulting practice helping organisations solve complex challenges through strategy, technology, data, research, project management and organisational development.','Vermaak Consults partners with governments, development organisations, corporates and founders on digital transformation, data and analytics, research, monitoring and evaluation, organisational development and creative economy advisory.','{"Digital transformation","Data and analytics","Research","Project management","Monitoring, Evaluation and Learning","Organisational development","Gender and inclusion","Knowledge management","Creative economy advisory"}','https://consult.vermaak.africa','Explore Vermaak Consults','active',2),
('EventSuite','eventsuite','A digital event technology platform designed to simplify event management, engagement and experiences.','EventSuite brings registration, ticketing, event websites, digital invitations, payments, attendee management, event photography and analytics into one platform built for African event ecosystems.','{"Event registration","Ticketing","Event websites","Digital invitations","Event payments","Attendee management","Analytics"}','https://event.vermaak.africa','Explore EventSuite','developing',3),
('Vermaak Events','vermaak-events','A platform for designing, producing and delivering memorable events and experiences.','From conferences and summits to creative productions and cultural experiences, Vermaak Events designs and delivers gatherings that move people and ideas.','{"Events","Experiences","Creative productions"}',null,'Discover Vermaak Events','active',4),
('Creator House','creator-house','A future platform supporting creators, digital talent, collaboration, production and creative entrepreneurship.','Creator House will offer studio access, collaboration, production support, mentorship and commercial pathways for African creators and digital talent.','{"Creators","Community","Production","Creative entrepreneurship"}',null,'Join the waitlist','coming_soon',5),
('Vermaak Galleries','vermaak-galleries','A future digital and physical platform for showcasing African creative work, digital art, photography, design and cultural expression.','Vermaak Galleries will curate and exhibit African creative work across digital and physical spaces, connecting artists and designers with audiences and markets.','{"Digital art","Photography","Design","Exhibitions","Culture"}',null,'Join the waitlist','coming_soon',6);

insert into public.stats (label, value, display_order) values
('People Reached','12,400',1),
('Organisations Supported','86',2),
('Projects Delivered','120',3),
('Events Produced','45',4),
('Countries & Markets','11',5);

insert into public.services (title, slug, description, capabilities, deliverables, display_order) values
('Digital Transformation','digital-transformation','We help organisations rethink how they operate, deliver and grow with digital tools, processes and culture.','{"Digital strategy","Process redesign","Systems selection","Change management"}','{"Digital roadmap","Operating model","Implementation plan"}',1),
('Technology & Product Development','technology-product-development','We design and build platforms, tools and automations that solve practical problems.','{"Product discovery","UX and UI design","Web and platform development","Automation and integrations"}','{"Product prototype","Production platform","Technical documentation"}',2),
('Data & Analytics','data-analytics','We turn data into decisions with clean pipelines, dashboards and analysis.','{"Data collection","Dashboards","Analysis and modelling","Data governance"}','{"Analytics dashboard","Data report","Governance framework"}',3),
('Research & Knowledge Management','research-knowledge-management','We design and deliver research that stands up to scrutiny and knowledge systems that keep it usable.','{"Study design","Qualitative and quantitative research","Knowledge products","Learning systems"}','{"Research report","Policy brief","Knowledge repository"}',4),
('Project & Programme Management','project-programme-management','We plan, manage and deliver complex projects and programmes across sectors.','{"Programme design","Delivery management","Risk and quality","Reporting"}','{"Delivery plan","Progress reports","Close-out report"}',5),
('Training & Capacity Development','training-capacity-development','We build capability through practical, well-designed learning experiences.','{"Curriculum design","Facilitation","Masterclasses","Coaching"}','{"Curriculum","Training delivery","Assessment report"}',6),
('Creative Economy Advisory','creative-economy-advisory','We advise creative businesses, institutions and funders on strategy, markets and ecosystem building.','{"Market analysis","Business models","Ecosystem mapping","Creative programming"}','{"Advisory report","Business model","Programme design"}',7),
('Events & Experiences','events-experiences','We design and deliver events, from intimate convenings to large public experiences.','{"Concept and design","Production","Event technology","Documentation"}','{"Event concept","Delivered event","Event report"}',8),
('Organisational Development','organisational-development','We strengthen structures, systems, culture and leadership so organisations can deliver.','{"Structure and roles","Systems and policies","Culture and leadership","Performance management"}','{"OD assessment","Policy pack","Development plan"}',9),
('Gender, Inclusion & Social Impact','gender-inclusion-social-impact','We help organisations design work that is inclusive, equitable and measurable in its impact.','{"Gender analysis","Inclusion strategy","Safeguarding","Impact measurement"}','{"Gender assessment","Inclusion strategy","Impact framework"}',10);

insert into public.timeline_events (year, title, description, display_order) values
('2019','A creative practice begins','Vermaak starts as a small creative and technology practice working with local organisations and creators.',1),
('2021','Consulting takes shape','The consulting practice formalises around research, data, project management and organisational development.',2),
('2023','Academy launches','Vermaak Academy launches its first professional training and masterclass programmes.',3),
('2024','EventSuite in development','Work begins on EventSuite, an event technology platform built for African event ecosystems.',4),
('2026','An ecosystem','Vermaak operates as an umbrella company developing multiple platforms, products and ventures.',5);

insert into public.projects (name, slug, client, sector, description, services, year, impact, featured, display_order) values
('Digital Skills Accelerator','digital-skills-accelerator','Regional Development Partner','Training','A twelve-week accelerator equipping young professionals with practical digital and creative skills.','{"Curriculum design","Facilitation","Monitoring and evaluation"}',2025,'740 participants trained across four cohorts, with 61% reporting new work within six months.',true,1),
('National Creative Economy Study','national-creative-economy-study','Ministry of Culture (placeholder)','Research','A baseline study mapping the size, structure and constraints of the national creative economy.','{"Study design","Data collection","Analysis","Policy brief"}',2025,'Findings adopted into a national creative industries strategy.',true,2),
('Data Platform for a Health Programme','health-programme-data-platform','International NGO','Technology','A reporting platform consolidating field data from 40 sites into one decision dashboard.','{"Product discovery","Platform development","Dashboards"}',2024,'Reporting time reduced from three weeks to two days.',true,3),
('Continental Innovation Summit','continental-innovation-summit','Innovation Network','Events','End-to-end design and production of a two-day summit for founders, funders and policymakers.','{"Event concept","Production","Event technology"}',2024,'1,200 delegates from 14 countries; 96% satisfaction score.',false,4),
('Brand and Digital Identity for a Creative Fund','creative-fund-brand','Creative Fund','Creative','A full brand and digital identity system for a new fund supporting African creatives.','{"Brand strategy","Design system","Website"}',2024,'Applications increased fourfold in the first funding cycle.',false,5),
('Organisational Review and Restructure','organisational-review','Pan-African Association','Consulting','A structural and systems review with a practical restructuring and performance plan.','{"OD assessment","Structure design","Policy development"}',2023,'New structure adopted; staff clarity scores up 38%.',false,6);

insert into public.insights (title, slug, author, published_at, category, excerpt, content, tags, featured) values
('Why Africa''s creative economy needs infrastructure, not just talent','creative-economy-infrastructure','Vermaak Editorial','2026-06-12','Perspectives','Talent is abundant. What is scarce is the infrastructure that turns talent into markets, income and institutions.','Africa does not have a talent problem. Across the continent, young people are producing work of extraordinary quality with limited tools and even less capital.

What is missing is infrastructure: payment rails that work across borders, rights and licensing systems, distribution platforms, training pathways that are recognised by employers, and data that makes the sector legible to investors and policymakers.

Building that infrastructure is slow, unglamorous work. It is also the work that decides whether a generation of creative talent becomes a creative economy.',
'{"Creative economy","Policy","Infrastructure"}',true),
('Designing training that actually changes how people work','training-that-changes-work','Vermaak Academy','2026-05-04','Learning','Most training is measured by attendance. It should be measured by what changes afterwards.','A workshop that ends in applause and changes nothing is a cost, not an investment.

The programmes that shift practice share three traits: they start from a real task the learner already owns, they build in repetition over weeks rather than hours, and they end with a deliverable the learner''s organisation can use.

Designing for that is harder than designing a curriculum. It is also the only version worth paying for.',
'{"Training","Future of work"}',false),
('What we learned building event technology for African organisers','building-event-technology','EventSuite Team','2026-03-18','Product','Registration is easy. Payments, connectivity and trust are where event technology actually gets built.','Every event platform demo looks the same. The difference shows up in the field: intermittent connectivity at the venue, five payment methods in one audience, and organisers who need to answer a sponsor''s question in the middle of a session.

We have been building EventSuite around those constraints rather than around a feature list — offline-tolerant check-in, local payment options, and analytics an organiser can read on a phone between sessions.',
'{"EventSuite","Product","Events"}',false);

insert into public.partners (name, category, display_order) values
('Development Partner (placeholder)','Development partners',1),
('University Partner (placeholder)','Universities',2),
('Technology Partner (placeholder)','Technology partners',3),
('Government Institution (placeholder)','Government',4),
('Creative Organisation (placeholder)','Creative organisations',5),
('Community Network (placeholder)','Community organisations',6);

insert into public.team_members (name, position, bio, display_order) values
('Team Member','Founder & Managing Director','Placeholder biography — add real team details from the admin dashboard.',1),
('Team Member','Director, Consulting','Placeholder biography — add real team details from the admin dashboard.',2),
('Team Member','Lead, Academy','Placeholder biography — add real team details from the admin dashboard.',3);

insert into public.site_settings (key, value, label) values
('contact_email','hello@vermaak.africa','Contact email'),
('contact_phone','+256 000 000 000','Contact phone'),
('contact_address','Kampala, Uganda','Address'),
('social_linkedin','https://linkedin.com','LinkedIn'),
('social_instagram','https://instagram.com','Instagram'),
('social_facebook','https://facebook.com','Facebook'),
('social_x','https://x.com','X'),
('social_youtube','https://youtube.com','YouTube'),
('footer_tagline','Building Africa''s Creative and Digital Future.','Footer tagline'),
('seo_title','Vermaak | Building Africa''s Creative & Digital Future','Homepage SEO title'),
('seo_description','Vermaak is an African creative-economy and digital-workforce company building talent, markets, products and systems for Africa''s digital and creative economy.','Homepage meta description'),
('analytics_ga_id','','Google Analytics ID'),
('analytics_meta_pixel','','Meta Pixel ID');