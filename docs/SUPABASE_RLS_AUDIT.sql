-- docs/SUPABASE_RLS_AUDIT.sql
-- =============================================================================
-- PAGEONEWORKS Supabase RLS / 권한 점검 SQL (조회 전용)
-- =============================================================================
--
-- 사용 방법:
--   * 이 파일은 Supabase 대시보드 > SQL Editor 에서 사용자가 직접 실행해야 합니다.
--   * Cursor / 애플리케이션 코드에서 자동 실행하지 마세요.
--
-- 안전성:
--   * 이 파일은 조회 전용(SELECT)이며 정책이나 데이터를 변경하지 않습니다.
--   * DROP / ALTER / CREATE POLICY / INSERT / UPDATE / DELETE 를 포함하지 않습니다.
--   * 운영 DB 상태를 변경하지 않습니다.
--
-- 결과 공유 시 주의:
--   * 결과를 외부에 공유할 때는 이메일, UUID, 개인정보, 토큰 등 민감 정보를
--     반드시 마스킹하세요.
--
-- 점검 대상 테이블:
--   community_posts, community_comments, profiles,
--   community_notices, ad_banners, article_views
-- =============================================================================


-- -----------------------------------------------------------------------------
-- [1] 각 테이블의 RLS 활성화 여부
-- relrowsecurity = RLS 켜짐 / relforcerowsecurity = 소유자에게도 강제
-- -----------------------------------------------------------------------------
SELECT
  n.nspname                        AS schema_name,
  c.relname                        AS table_name,
  c.relrowsecurity                 AS rls_enabled,
  c.relforcerowsecurity            AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN (
    'community_posts',
    'community_comments',
    'profiles',
    'community_notices',
    'ad_banners',
    'article_views'
  )
ORDER BY c.relname;


-- -----------------------------------------------------------------------------
-- [2] 각 테이블의 정책(policy) 상세 목록
-- 정책 이름 / 명령(command) / 적용 roles / USING / WITH CHECK 조건 포함
-- cmd: r=SELECT, a=INSERT, w=UPDATE, d=DELETE, *=ALL
-- -----------------------------------------------------------------------------
SELECT
  schemaname                       AS schema_name,
  tablename                        AS table_name,
  policyname                       AS policy_name,
  permissive,
  roles,                            -- 정책이 적용되는 roles 목록
  cmd                              AS command,
  qual                             AS using_expression,        -- USING 조건
  with_check                       AS with_check_expression     -- WITH CHECK 조건
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'community_posts',
    'community_comments',
    'profiles',
    'community_notices',
    'ad_banners',
    'article_views'
  )
ORDER BY tablename, policyname;


-- -----------------------------------------------------------------------------
-- [2-1] 정책이 전혀 없는데 RLS 가 켜진(또는 꺼진) 테이블 점검 보조
-- RLS 가 켜져 있고 정책이 0개면 모든 접근이 차단됨 / RLS 가 꺼져 있으면 모두 허용됨
-- -----------------------------------------------------------------------------
SELECT
  c.relname                        AS table_name,
  c.relrowsecurity                 AS rls_enabled,
  COUNT(p.policyname)              AS policy_count
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_policies p
  ON p.schemaname = n.nspname AND p.tablename = c.relname
WHERE n.nspname = 'public'
  AND c.relname IN (
    'community_posts',
    'community_comments',
    'profiles',
    'community_notices',
    'ad_banners',
    'article_views'
  )
GROUP BY c.relname, c.relrowsecurity
ORDER BY c.relname;


-- -----------------------------------------------------------------------------
-- [3] 테이블 권한(GRANT) 점검 - 역할별 테이블 권한
-- anon / authenticated / public 역할에 어떤 권한이 부여되어 있는지 확인
-- -----------------------------------------------------------------------------
SELECT
  table_schema,
  table_name,
  grantee,                          -- 권한을 받은 role (anon, authenticated, public 등)
  privilege_type,                   -- SELECT / INSERT / UPDATE / DELETE 등
  is_grantable
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN (
    'community_posts',
    'community_comments',
    'profiles',
    'community_notices',
    'ad_banners',
    'article_views'
  )
ORDER BY table_name, grantee, privilege_type;


-- -----------------------------------------------------------------------------
-- [4] public / anon 역할의 과도한 쓰기 권한 점검
-- anon 또는 public 에 INSERT/UPDATE/DELETE 권한이 있으면 위험 신호
-- -----------------------------------------------------------------------------
SELECT
  table_name,
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'public')
  AND privilege_type IN ('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES')
  AND table_name IN (
    'community_posts',
    'community_comments',
    'profiles',
    'community_notices',
    'ad_banners',
    'article_views'
  )
ORDER BY table_name, grantee, privilege_type;


-- -----------------------------------------------------------------------------
-- [5] SECURITY DEFINER 함수 점검
-- prosecdef = true 인 함수는 정의자 권한으로 실행되므로 RLS 우회 가능 → 검토 필요
-- (예: increment_article_view 등 RPC 함수)
-- -----------------------------------------------------------------------------
SELECT
  n.nspname                        AS schema_name,
  p.proname                        AS function_name,
  pg_get_function_identity_arguments(p.oid) AS arguments,
  p.prosecdef                      AS is_security_definer,
  r.rolname                        AS owner
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
JOIN pg_roles r ON r.oid = p.proowner
WHERE n.nspname = 'public'
ORDER BY p.prosecdef DESC, p.proname;


-- -----------------------------------------------------------------------------
-- [6] 함수 실행 권한(EXECUTE) 점검
-- anon / public 에 위험한 함수 실행 권한이 부여되어 있는지 확인
-- -----------------------------------------------------------------------------
SELECT
  routine_schema,
  routine_name,
  grantee,
  privilege_type
FROM information_schema.role_routine_grants
WHERE routine_schema = 'public'
  AND grantee IN ('anon', 'public', 'authenticated')
ORDER BY routine_name, grantee;
