-- =============================================================================
-- Seed Super Admin
-- =============================================================================
-- This script promotes an existing Supabase Auth user to super_admin.
-- Run this once after the clinic_users_and_active_flag migration has been applied.
--
-- STEP 1: Create the Auth user
-- Option A — Supabase Dashboard:
--   Go to Authentication > Users > "Add user"
--   Set email + password, then copy the UUID shown in the Users table.
--
-- Option B — SQL (run in Supabase SQL Editor, requires service role):
--   SELECT supabase_admin.create_user(
--     '{"email": "admin@yourdomain.com", "password": "ChangeMe123!", "email_confirm": true}'::jsonb
--   );
--   Then find the UUID via: SELECT id FROM auth.users WHERE email = 'admin@yourdomain.com';
--
-- STEP 2: Run the INSERT below
-- Replace <AUTH_USER_UUID> with the UUID obtained from Step 1.
-- =============================================================================

-- Replace <AUTH_USER_UUID> with the UUID from Supabase Auth > Users table
INSERT INTO clinic_users (user_id, clinic_id, role, status)
VALUES ('<AUTH_USER_UUID>', NULL, 'super_admin', 'approved');

-- Verify the row was inserted correctly:
-- SELECT * FROM clinic_users WHERE role = 'super_admin';
