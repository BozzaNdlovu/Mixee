# SupaApp Deployment Troubleshooting

## 🚨 Common Errors & Quick Fixes

### ❌ Error: "Module not found kv_store.tsx"
**What Happened**: Edge Functions can only deploy a single file, but the code was trying to import from a separate file.

**✅ Quick Fix**:
1. ✅ **Use the updated Edge Function code** - I've removed the import and inlined the KV functions
2. ✅ **Copy the complete updated index.tsx** - It's now self-contained
3. ✅ **Deploy the new version** - Should work without import errors

### ❌ Error: "syntax error at or near 'import'"
**What Happened**: You tried to run JavaScript/TypeScript code in the SQL Editor.

**✅ Quick Fix**:
1. **STOP** - Don't put JavaScript code in SQL Editor
2. **SQL Editor** is only for `.sql` files (database setup)
3. **Edge Functions** is for `.tsx`/`.ts` files (server code)

### ❌ Error: "policy already exists" 
**What Happened**: You ran the SQL script multiple times and some policies already exist.

**✅ Quick Fix**:
1. **No problem!** - The updated SQL script handles this automatically
2. **Re-run the script** - It will drop and recreate policies safely
3. **Look for success message** - "Database setup completed successfully!"

### ❌ Error: "function already exists"
**What Happened**: Trigger functions already exist from previous runs.

**✅ Quick Fix**:
1. **This is normal** - The script uses `CREATE OR REPLACE FUNCTION`
2. **Continue running** - Functions will be updated to latest version
3. **Check final status** - Look for the success summary

---

## 📋 Step-by-Step Fix Guide

### Step 1: Clear Previous Attempts (If Needed)
1. Go to **SQL Editor** in Supabase Dashboard
2. If you have errors, you can safely re-run the entire script
3. The new script is **idempotent** (safe to run multiple times)

### Step 2: Run the COMPLETE SQL Script
1. Copy the **entire** contents of `/sql/setup-database.sql`
2. Paste in SQL Editor (should be ~300+ lines)
3. Click **Run** and wait for completion
4. Look for: "✅ SupaApp database setup completed successfully!"

### Step 3: Deploy Edge Function (Updated - No More Import Errors!)
1. Go to **Edge Functions** (different section!)
2. Click **Create Function** (or delete old one and recreate)
3. Name: `make-server-0e8b25fb`
4. Copy contents from **UPDATED** `/supabase/functions/server/index.tsx`
5. Click **Deploy** - should work without import errors now!

### Step 4: Set Environment Variable
1. In Edge Functions, go to your function settings
2. Add: `SUPABASE_SERVICE_ROLE_KEY` = [your service role key]
3. Save and redeploy function

---

## 🔍 What Goes Where - Visual Guide

```
Supabase Dashboard
├── 📊 SQL Editor
│   └── ✅ ONLY: setup-database.sql
│       ├── CREATE TABLE statements
│       ├── CREATE POLICY statements  
│       ├── INSERT demo data
│       └── ❌ NO JavaScript code!
│
├── ⚡ Edge Functions  
│   └── ✅ ONLY: index.tsx (UPDATED - self-contained)
│       ├── import statements
│       ├── Inline KV functions (no separate file needed)
│       ├── JavaScript/TypeScript code
│       └── ❌ NO SQL code!
│
└── ⚙️ Settings → API
    └── 🔑 Get service role key here
```

---

## 🧪 Test Your Setup Step-by-Step

### 1. Database Test (SQL Editor)
```sql
-- Run this to verify table exists
SELECT COUNT(*) FROM kv_store_0e8b25fb;
```
**Expected**: Returns a number (like 8 demo records)
**❌ If Error**: Re-run the complete setup-database.sql script

### 2. Policy Test (SQL Editor)
```sql
-- Check if policies were created
SELECT policyname FROM pg_policies WHERE tablename = 'kv_store_0e8b25fb';
```
**Expected**: Shows 3 policy names
**❌ If Empty**: Re-run setup-database.sql - policies will be recreated

### 3. Edge Function Test (Browser)
Visit: `https://mfnwotokumvnszljeuom.supabase.co/functions/v1/make-server-0e8b25fb/health`

**Expected**:
```json
{
  "status": "healthy",
  "message": "SupaApp backend is running smoothly"
}
```
**❌ If 404**: Function not deployed - check Edge Functions section
**❌ If 500**: Check environment variables are set
**❌ If "Module not found"**: Use the updated index.tsx file

### 4. App Test
- Refresh your SupaApp
- Should show **"Live"** instead of **"Demo"**
- Can register new accounts

---

## 🛠 Specific Error Solutions

### Database Errors

#### "relation kv_store_0e8b25fb does not exist"
- ✅ Table wasn't created - re-run setup-database.sql
- ✅ Check you're connected to the right project

#### "permission denied for table kv_store_0e8b25fb"
- ✅ RLS policies issue - re-run setup-database.sql
- ✅ Make sure service role key is set in Edge Function

#### "duplicate key value violates unique constraint"
- ✅ This is fine - demo data already exists
- ✅ Script uses ON CONFLICT to handle duplicates

### Edge Function Errors

#### "Module not found" / "failed to create the graph"
- ✅ Use the **updated** index.tsx file - it's now self-contained
- ✅ Don't use the old version that imports kv_store.tsx
- ✅ The new version has KV functions built-in

#### "Function not found" (404)
- ✅ Function name must be exactly: `make-server-0e8b25fb`
- ✅ Deploy in Edge Functions section (not SQL Editor)
- ✅ Wait 1-2 minutes after deployment

#### "Internal server error" (500)
- ✅ Check Edge Function logs for details
- ✅ Verify SUPABASE_SERVICE_ROLE_KEY is set
- ✅ Make sure database setup completed successfully

#### "Unauthorized" (401)
- ✅ Service role key missing or incorrect
- ✅ Get key from Settings → API (service_role, not anon)

### App Errors

#### Still shows "Demo Mode"
- ✅ Both database AND Edge Function must work
- ✅ Test health endpoint first: should return "healthy"
- ✅ Check browser console for errors

#### "Failed to fetch" errors
- ✅ Edge Function not responding - check deployment
- ✅ Network issue - try health endpoint in browser
- ✅ CORS issue - function includes CORS headers

---

## ✅ Success Indicators

### ✅ SQL Editor Success
```
🎉 SupaApp database setup completed successfully!
✅ Table: kv_store_0e8b25fb created
✅ Policies: 3 security policies active
✅ Indexes: 6 performance indexes created
✅ Demo data: 8+ sample records inserted
```

### ✅ Edge Function Success
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "SupaApp Backend"
}
```

### ✅ App Success
- Shows "Live" mode with green indicator
- Can create new user accounts
- Features work with real data
- No "Demo" banner showing

---

## 🔄 Reset Instructions (If All Else Fails)

If you want to start completely fresh:

### Reset Database
```sql
-- CAUTION: This deletes all data!
DROP TABLE IF EXISTS kv_store_0e8b25fb CASCADE;
-- Then re-run setup-database.sql
```

### Reset Edge Function
1. Delete the function in Edge Functions section
2. Create a new one with the same name
3. Deploy the **UPDATED** code (no kv_store import)
4. Set environment variables again

---

## 📞 Still Need Help?

### Check These Locations for Error Details:
1. **SQL Editor**: Error messages after running SQL
2. **Edge Functions → Logs**: Runtime errors and console output
3. **Browser Console**: Network errors when using the app
4. **Supabase Logs**: General project logs and API errors

### Common Success Flow:
1. ✅ SQL script runs without errors → Green checkmarks in output
2. ✅ Edge Function deploys successfully → Health endpoint works  
3. ✅ Environment variables set → Function can access database
4. ✅ App connects → Shows "Live" mode and works with real data

### Most Common Issues:
1. **Mixing SQL and JavaScript code** - Make sure you're using the right editor for each file type!
2. **Using old Edge Function code** - The new version is self-contained and doesn't import kv_store.tsx
3. **Missing environment variables** - Service role key must be set for the function to work

---

**Remember**: The setup is designed to be robust. If something fails, you can safely re-run any step! 🎯

## 🆕 What's Different in the Updated Version?

### ✅ Fixed Edge Function Issues:
- **No more kv_store.tsx import** - KV functions are now inline
- **Self-contained deployment** - Single file with everything needed
- **No module dependency errors** - Works with Edge Function limitations
- **Same functionality** - All features work exactly the same

### ✅ Benefits:
- **Easier deployment** - Just paste one file
- **No import errors** - Edge Functions support this approach
- **Better reliability** - No external dependencies
- **Same performance** - KV operations work identically

The app functionality remains exactly the same - just the backend deployment is now much simpler! 🌟