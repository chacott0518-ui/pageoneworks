// lib/admin/constants.ts

export const SUPER_ADMIN_EMAIL = 'chacott0518@gmail.com'

export const ADMIN_ROLES = {
  SUPER: 'super',
  ADMIN: 'admin',
} as const

export type AdminRole = (typeof ADMIN_ROLES)[keyof typeof ADMIN_ROLES]

export const PAGE_SIZE = 20

export const ADMIN_THEME = {
  bg: '#0a0a0c',
  surface: 'rgba(255,255,255,0.03)',
  border: '0.5px solid rgba(255,255,255,0.06)',
  gold: '#C9A96E',
  text: 'rgba(255,255,255,0.82)',
  sub: 'rgba(255,255,255,0.4)',
  meta: 'rgba(255,255,255,0.25)',
  danger: 'rgba(255,70,70,0.9)',
  warning: 'rgba(255,180,0,0.9)',
  success: 'rgba(70,200,100,0.9)',
} as const

export const NOTICES_SQL = `-- 이 SQL을 Supabase SQL Editor에서 먼저 실행하세요
CREATE TABLE IF NOT EXISTS community_notices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE community_notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notices_read" ON community_notices FOR SELECT USING (true);
CREATE POLICY "notices_admin" ON community_notices USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE TABLE IF NOT EXISTS ad_banners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_name text NOT NULL,
  image_url text,
  link_url text,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE ad_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ads_read" ON ad_banners FOR SELECT USING (true);
CREATE POLICY "ads_admin" ON ad_banners USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);`
