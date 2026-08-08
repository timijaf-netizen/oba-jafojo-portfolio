/**
 * One-time setup script.
 *
 *   npm run setup-admin
 *
 * It does two things using your Supabase SERVICE ROLE key (server-side only):
 *   1. Creates the admin login (email + password) so you can sign in at /admin.
 *   2. Seeds the site_content row with the built-in placeholder content, so the
 *      admin panel opens with everything already filled in and editable.
 *
 * Reads these from .env.local (or your shell environment):
 *   SUPABASE_URL                (or NEXT_PUBLIC_SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ADMIN_EMAIL
 *   ADMIN_PASSWORD
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// --- tiny .env.local loader (no dependency required) ----------------------
try {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const envPath = join(__dirname, "..", ".env.local");
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2];
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (!(key in process.env)) process.env[key] = val;
  }
} catch {
  // no .env.local — rely on the shell environment
}

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

if (!url) fail("SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) is missing.");
if (!serviceKey) fail("SUPABASE_SERVICE_ROLE_KEY is missing.");
if (!email) fail("ADMIN_EMAIL is missing.");
if (!password) fail("ADMIN_PASSWORD is missing.");
if (password.length < 8) fail("ADMIN_PASSWORD should be at least 8 characters.");

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function loadDefaultContent() {
  const mod = await import("../lib/defaultContent.js");
  return mod.defaultContent;
}

async function ensureAdminUser() {
  // Try to create; if the user already exists, update the password instead.
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (!error) {
    console.log(`✓ Created admin user: ${email}`);
    return;
  }

  const already = /registered|exists|already/i.test(error.message || "");
  if (!already) fail(`Could not create admin user: ${error.message}`);

  // Find the existing user and reset the password to the one in env.
  const { data: list, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) fail(`Could not list users: ${listErr.message}`);
  const existing = list.users.find(
    (u) => (u.email || "").toLowerCase() === email.toLowerCase()
  );
  if (!existing) fail("User reported as existing but could not be found.");

  const { error: updErr } = await supabase.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
  });
  if (updErr) fail(`Could not update existing admin password: ${updErr.message}`);
  console.log(`✓ Admin user already existed — password reset for: ${email}`);
}

async function seedContent() {
  const defaultContent = await loadDefaultContent();

  // Only seed if the row is empty, so we never overwrite real edits.
  const { data: existing } = await supabase
    .from("site_content")
    .select("data")
    .eq("id", 1)
    .maybeSingle();

  const isEmpty =
    !existing?.data || Object.keys(existing.data || {}).length === 0;

  if (!isEmpty) {
    console.log("• site_content already has data — leaving it untouched.");
    return;
  }

  const { error } = await supabase.from("site_content").upsert({
    id: 1,
    data: defaultContent,
    updated_at: new Date().toISOString(),
  });
  if (error) fail(`Could not seed content: ${error.message}`);
  console.log("✓ Seeded site_content with placeholder content.");
}

(async () => {
  console.log("\nSetting up your portfolio admin…\n");
  await ensureAdminUser();
  await seedContent();
  console.log(`\nDone. Sign in at /admin with:\n  email:    ${email}\n  password: (the ADMIN_PASSWORD you set)\n`);
})();
