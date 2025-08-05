# SupaApp - Real Supabase Backend Deployment Guide

🚨 **IMPORTANT**: There are TWO separate steps - Database Setup (SQL) and Edge Function Deployment (JavaScript)

## 🚀 Step-by-Step Setup (10 minutes)

### Step 1: Database Setup (SQL Editor)

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project: `mfnwotokumvnszljeuom`
3. Go to **SQL Editor** (left sidebar)
4. Click **"New Query"**
5. **ONLY** copy and paste the contents from `/sql/setup-database.sql` (the SQL file)
6. Click **Run** to create the database table and policies

### Step 2: Edge Function Deployment (Edge Functions Section)

**DO NOT put the JavaScript code in the SQL Editor!**

#### Option A: Supabase Dashboard (Recommended)
1. In your Supabase Dashboard, go to **Edge Functions** (left sidebar)
2. Click **"Create Function"**
3. Function name: `make-server-0e8b25fb`
4. Copy the JavaScript code from `/supabase/functions/server/index.tsx`
5. Paste it in the Edge Function editor (NOT the SQL editor)
6. Click **Deploy**

#### Option B: Supabase CLI (Advanced)
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref mfnwotokumvnszljeuom

# Deploy the function (JavaScript code)
supabase functions deploy make-server-0e8b25fb --project-ref mfnwotokumvnszljeuom
```

### Step 3: Set Environment Variables (CRITICAL)

1. In **Edge Functions** section, click on your function
2. Go to **Settings** or **Environment Variables**
3. Add this environment variable:
   - **Key**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: [Your service role key from Settings → API]

## 🔍 What Goes Where

### ✅ SQL Editor (`/sql/setup-database.sql`)
```sql
-- Create the KV store table if it doesn't exist
CREATE TABLE IF NOT EXISTS kv_store_0e8b25fb (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- ... rest of SQL code
```

### ✅ Edge Functions (`/supabase/functions/server/index.tsx`)
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// ... rest of JavaScript code
```

### ❌ NEVER mix these two!
- SQL code goes in **SQL Editor**
- JavaScript code goes in **Edge Functions**

## ✅ Verification Steps

### 1. Check Database Setup
In SQL Editor, run this query to verify the table was created:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'kv_store_0e8b25fb';
```

### 2. Check Edge Function
Visit this URL in your browser:
```
https://mfnwotokumvnszljeuom.supabase.co/functions/v1/make-server-0e8b25fb/health
```

You should see:
```json
{
  "status": "healthy",
  "message": "SupaApp backend is running smoothly"
}
```

### 3. Check App Status
- Refresh your SupaApp
- It should show **"Live"** mode instead of **"Demo"**
- The banner should say "Connected to your Supabase project"

## 🛠 Troubleshooting

### "syntax error at or near 'import'" 
- ❌ **Problem**: You put JavaScript code in the SQL Editor
- ✅ **Solution**: JavaScript goes in Edge Functions, SQL goes in SQL Editor

### "Failed to fetch" errors
- ✅ Make sure Edge Function is deployed correctly
- ✅ Check environment variables are set
- ✅ Verify the health endpoint works

### Database errors
- ✅ Run the SQL setup script in SQL Editor
- ✅ Check the table was created correctly

## 📋 Complete Checklist

- [ ] ✅ SQL script run in **SQL Editor** 
- [ ] ✅ Table `kv_store_0e8b25fb` created
- [ ] ✅ Edge Function deployed in **Edge Functions**
- [ ] ✅ Environment variable `SUPABASE_SERVICE_ROLE_KEY` set
- [ ] ✅ Health endpoint returns "healthy"
- [ ] ✅ App shows "Live" mode
- [ ] ✅ Storage buckets created automatically

## 🎯 After Successful Setup

Your SupaApp will have:
- ✅ Real user accounts and authentication
- ✅ Live chat with real-time updates
- ✅ File uploads to Supabase Storage
- ✅ Communities, marketplace, and learning features
- ✅ Multi-user support across devices

## 📞 Support

If you're still having issues:
1. **Check which step failed** (Database or Edge Function)
2. **Verify you're using the right editor** (SQL vs Edge Functions)
3. **Check the logs** in each section for error messages
4. **Test each component separately** (database query, health endpoint)

Remember: **SQL code ≠ JavaScript code**. They go in different places! 🎯