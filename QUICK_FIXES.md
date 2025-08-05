# SupaApp Quick Fixes - Step 3 Common Issues

## 🚨 Issue: App Still Shows "Demo Mode"

### Quick Fix #1: Force Refresh
```bash
# Clear browser cache and refresh
1. Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. Wait 15-20 seconds for health check
3. Look for status change to "Live"
```

### Quick Fix #2: Check Health Endpoint
```bash
# Test this URL directly in browser:
https://mfnwotokumvnszljeuom.supabase.co/functions/v1/make-server-0e8b25fb/health

# Should return JSON with "status": "healthy"
# If 404: Function not deployed
# If 500: Environment variables missing
```

### Quick Fix #3: Verify Environment Variables
```bash
1. Supabase Dashboard → Edge Functions
2. Click on: make-server-0e8b25fb
3. Go to: Settings → Environment Variables
4. Must have: SUPABASE_SERVICE_ROLE_KEY = [your key]
5. Redeploy function after adding variables
```

---

## 🚨 Issue: Health Endpoint Returns 404

### Quick Fix: Redeploy Edge Function
```bash
1. Supabase Dashboard → Edge Functions
2. Delete existing function (if any)
3. Create new function: make-server-0e8b25fb
4. Copy UPDATED index.tsx content (self-contained version)
5. Deploy
6. Set SUPABASE_SERVICE_ROLE_KEY environment variable
```

---

## 🚨 Issue: Health Endpoint Returns 500

### Quick Fix: Environment Variables
```bash
1. Get your service role key:
   - Supabase Dashboard → Settings → API
   - Copy the "service_role" key (NOT anon key)

2. Set in Edge Function:
   - Edge Functions → [your function] → Settings
   - Add: SUPABASE_SERVICE_ROLE_KEY = [paste key here]
   
3. Redeploy the function
```

---

## 🚨 Issue: "Failed to create account"

### Quick Fix: Database Check
```sql
-- Run in SQL Editor to verify table exists:
SELECT COUNT(*) FROM kv_store_0e8b25fb;

-- Should return a number (even 0 is fine)
-- If error: Re-run setup-database.sql
```

---

## 🚨 Issue: Browser Console Errors

### Common Error Messages & Fixes:

#### "Failed to fetch"
```bash
Fix: Health endpoint not working
1. Test health URL manually
2. Check Edge Function deployment
3. Verify environment variables
```

#### "CORS error"
```bash
Fix: Edge Function CORS issue
1. Use the UPDATED index.tsx (includes CORS)
2. Redeploy function with correct CORS headers
```

#### "Network request failed"
```bash
Fix: Function not responding
1. Check Edge Function logs
2. Verify function is active/deployed
3. Check environment variables
```

---

## ⚡ Super Quick Diagnostic

### Run This 2-Minute Test:

#### Step 1: Health Check (30 seconds)
```bash
Open: https://mfnwotokumvnszljeuom.supabase.co/functions/v1/make-server-0e8b25fb/health
Expect: JSON with "healthy" status
```

#### Step 2: Database Check (30 seconds)
```sql
SQL Editor: SELECT COUNT(*) FROM kv_store_0e8b25fb;
Expect: Number returned (no error)
```

#### Step 3: App Check (30 seconds)
```bash
Refresh app → Look for green "Live" status
Expect: No demo banner, green dot in status
```

#### Step 4: Function Check (30 seconds)
```bash
Supabase → Edge Functions → make-server-0e8b25fb
Expect: Status "Active" + Environment variables set
```

### Results:
- **All ✅**: You're live! 🎉
- **Health ❌**: Redeploy Edge Function
- **Database ❌**: Re-run SQL setup
- **App ❌**: Clear cache and refresh
- **Function ❌**: Check deployment and environment variables

---

## 🔄 Nuclear Reset (If All Else Fails)

### Complete Fresh Start:
```bash
1. Delete Edge Function in Supabase
2. Re-run setup-database.sql in SQL Editor
3. Create new Edge Function with UPDATED index.tsx
4. Set SUPABASE_SERVICE_ROLE_KEY environment variable
5. Hard refresh app (Ctrl+Shift+R)
```

---

## ✅ Success Indicators

### Your app is working when you see:
- 🟢 **Green "Live" status** in app header
- 📱 **No demo mode banner**
- 🔗 **Health endpoint returns JSON**
- 👤 **Can register new users**
- 💬 **Messages send and persist**
- 🔄 **Data survives page refresh**

### Time to success: **5-10 minutes** for most fixes

---

**Remember**: If one thing fails, everything shows as demo mode. Usually it's just one small fix needed! 🎯