-- Add 'client' role to existing app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'client';

-- Project Managers (admin-managed contact cards)
CREATE TABLE public.project_managers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  photo_url TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.project_managers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage project managers" ON public.project_managers
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can view project managers" ON public.project_managers
  FOR SELECT TO authenticated USING (true);

CREATE TRIGGER trg_pm_updated BEFORE UPDATE ON public.project_managers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Add manager + founder fields to projects
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES public.project_managers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS founder_name TEXT,
  ADD COLUMN IF NOT EXISTS founder_title TEXT;

-- Project ↔ Client portal access mapping
CREATE TABLE public.project_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, user_id)
);
ALTER TABLE public.project_clients ENABLE ROW LEVEL SECURITY;

-- Helper: does the current user have access to this project as a client?
CREATE OR REPLACE FUNCTION public.user_has_project_access(_project_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_clients
    WHERE project_id = _project_id AND user_id = auth.uid()
  )
$$;

CREATE POLICY "Admins manage project_clients" ON public.project_clients
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients view their own mapping" ON public.project_clients
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Proposals
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  client_display_name TEXT,
  scope TEXT,
  terms TEXT,
  currency TEXT NOT NULL DEFAULT 'EUR',
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  founder_name TEXT,
  founder_title TEXT,
  founder_signature_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  accepted_by_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage proposals" ON public.proposals
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients view their proposal" ON public.proposals
  FOR SELECT TO authenticated
  USING (public.user_has_project_access(project_id));

CREATE POLICY "Clients can accept their proposal" ON public.proposals
  FOR UPDATE TO authenticated
  USING (public.user_has_project_access(project_id))
  WITH CHECK (public.user_has_project_access(project_id));

CREATE TRIGGER trg_proposals_updated BEFORE UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Proposal line items
CREATE TABLE public.proposal_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  qty NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.proposal_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage proposal_items" ON public.proposal_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients view proposal_items" ON public.proposal_items
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.proposals p
    WHERE p.id = proposal_id AND public.user_has_project_access(p.project_id)
  ));

-- Proposal milestones (timeline)
CREATE TABLE public.proposal_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.proposal_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage proposal_milestones" ON public.proposal_milestones
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients view proposal_milestones" ON public.proposal_milestones
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.proposals p
    WHERE p.id = proposal_id AND public.user_has_project_access(p.project_id)
  ));

-- Project progress milestones (checklist)
CREATE TABLE public.project_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  done BOOLEAN NOT NULL DEFAULT false,
  done_at TIMESTAMPTZ,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage project_milestones" ON public.project_milestones
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients view project_milestones" ON public.project_milestones
  FOR SELECT TO authenticated
  USING (public.user_has_project_access(project_id));

CREATE TRIGGER trg_project_milestones_updated BEFORE UPDATE ON public.project_milestones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Project messages (client ↔ PM thread)
CREATE TABLE public.project_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_role TEXT NOT NULL,
  sender_name TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage project_messages" ON public.project_messages
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients view project_messages" ON public.project_messages
  FOR SELECT TO authenticated
  USING (public.user_has_project_access(project_id));

CREATE POLICY "Clients send project_messages" ON public.project_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND public.user_has_project_access(project_id)
  );

CREATE INDEX idx_project_messages_project ON public.project_messages(project_id, created_at DESC);
CREATE INDEX idx_project_milestones_project ON public.project_milestones(project_id, sort_order);
CREATE INDEX idx_proposal_items_proposal ON public.proposal_items(proposal_id, sort_order);
CREATE INDEX idx_proposal_milestones_proposal ON public.proposal_milestones(proposal_id, sort_order);
CREATE INDEX idx_project_clients_user ON public.project_clients(user_id);