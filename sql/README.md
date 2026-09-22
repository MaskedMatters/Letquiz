# Letquiz Database SQL Scripts

This directory contains all PostgreSQL scripts for configuring, managing, and resetting the **Letquiz** Supabase backend.

## File Manifest

| File | Description | When to Run |
|---|---|---|
| [`01_schema.sql`](file:///home/maskedmatters/Documents/Letquiz/sql/01_schema.sql) | Complete database schema including tables, RLS policies, permissions, and forking support. | When setting up a new Supabase project or updating database structure. |
| [`02_reset_database.sql`](file:///home/maskedmatters/Documents/Letquiz/sql/02_reset_database.sql) | Wipes all users, profiles, decks, cards, folders, classes, announcements, and test results. | When you want to clear all data and start 100% fresh. |

---

## Instructions

### 1. How to Initialize the Database (`01_schema.sql`)
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** in the left navigation sidebar.
3. Click **New Query**.
4. Copy the entire contents of [`01_schema.sql`](file:///home/maskedmatters/Documents/Letquiz/sql/01_schema.sql) and paste into the query editor.
5. Click **Run**.

---

### 2. How to Wipe All Users & Reset Database (`02_reset_database.sql`)
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor**.
3. Click **New Query**.
4. Copy the entire contents of [`02_reset_database.sql`](file:///home/maskedmatters/Documents/Letquiz/sql/02_reset_database.sql) and paste into the query editor.
5. Click **Run**.

*(Note: This deletes all users from `auth.users` and cascades to delete all profiles, decks, flashcards, folders, classes, announcements, and practice test logs).*
