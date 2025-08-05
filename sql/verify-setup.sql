-- SupaApp Database Verification Script
-- Run this in your Supabase SQL Editor to verify everything is set up correctly

-- Check if the main table exists
DO $$
DECLARE
    table_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'kv_store_0e8b25fb'
    ) INTO table_exists;
    
    IF table_exists THEN
        RAISE NOTICE '✅ Table kv_store_0e8b25fb exists';
    ELSE
        RAISE NOTICE '❌ Table kv_store_0e8b25fb does not exist - run setup-database.sql first';
    END IF;
END $$;

-- Check if RLS is enabled
DO $$
DECLARE
    rls_enabled boolean;
BEGIN
    SELECT row_security INTO rls_enabled
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'kv_store_0e8b25fb';
    
    IF rls_enabled THEN
        RAISE NOTICE '✅ Row Level Security is enabled';
    ELSE
        RAISE NOTICE '⚠️ Row Level Security is not enabled';
    END IF;
END $$;

-- Check if indexes exist
DO $$
DECLARE
    index_count integer;
BEGIN
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes 
    WHERE tablename = 'kv_store_0e8b25fb';
    
    IF index_count > 0 THEN
        RAISE NOTICE '✅ Indexes created: % indexes found', index_count;
    ELSE
        RAISE NOTICE '⚠️ No indexes found';
    END IF;
END $$;

-- Check if policies exist
DO $$
DECLARE
    policy_count integer;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename = 'kv_store_0e8b25fb';
    
    IF policy_count > 0 THEN
        RAISE NOTICE '✅ Security policies created: % policies found', policy_count;
    ELSE
        RAISE NOTICE '⚠️ No security policies found';
    END IF;
END $$;

-- Check if demo data exists
DO $$
DECLARE
    demo_count integer;
BEGIN
    SELECT COUNT(*) INTO demo_count
    FROM kv_store_0e8b25fb 
    WHERE key LIKE 'community:demo_%' OR key LIKE 'product:demo_%' OR key LIKE 'course:demo_%';
    
    IF demo_count > 0 THEN
        RAISE NOTICE '✅ Demo data inserted: % demo records found', demo_count;
    ELSE
        RAISE NOTICE '⚠️ No demo data found';
    END IF;
END $$;

-- Test basic functionality
DO $$
BEGIN
    -- Try to insert a test record
    INSERT INTO kv_store_0e8b25fb (key, value) 
    VALUES ('test:verification', '{"message": "Database is working!", "timestamp": "' || NOW() || '"}')
    ON CONFLICT (key) DO UPDATE SET 
        value = EXCLUDED.value,
        updated_at = NOW();
    
    RAISE NOTICE '✅ Database write test successful';
    
    -- Clean up test record
    DELETE FROM kv_store_0e8b25fb WHERE key = 'test:verification';
    
    RAISE NOTICE '✅ Database delete test successful';
END $$;

-- Final summary
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 Database verification completed!';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Deploy your Edge Function (JavaScript code) in the Edge Functions section';
    RAISE NOTICE '2. Set SUPABASE_SERVICE_ROLE_KEY environment variable';
    RAISE NOTICE '3. Test the health endpoint: https://mfnwotokumvnszljeuom.supabase.co/functions/v1/make-server-0e8b25fb/health';
    RAISE NOTICE '4. Your SupaApp should show "Live" mode';
    RAISE NOTICE '';
END $$;