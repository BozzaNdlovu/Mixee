-- SupaApp Database Setup
-- Run this SQL in your Supabase SQL Editor to set up the database
-- This script is idempotent - safe to run multiple times

-- Create the KV store table if it doesn't exist
CREATE TABLE IF NOT EXISTS kv_store_0e8b25fb (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index for faster prefix searches (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_kv_store_key_prefix') THEN
        CREATE INDEX idx_kv_store_key_prefix ON kv_store_0e8b25fb USING btree (key);
    END IF;
END $$;

-- Create a trigger function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop the trigger if it exists, then create it (safe to run multiple times)
DROP TRIGGER IF EXISTS update_kv_store_updated_at ON kv_store_0e8b25fb;
CREATE TRIGGER update_kv_store_updated_at
    BEFORE UPDATE ON kv_store_0e8b25fb
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - idempotent operation
ALTER TABLE kv_store_0e8b25fb ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
-- This ensures we always have the latest policy definitions
DO $$
BEGIN
    -- Drop policies if they exist (no error if they don't exist)
    DROP POLICY IF EXISTS "Service role can manage all kv data" ON kv_store_0e8b25fb;
    DROP POLICY IF EXISTS "Users can read public data" ON kv_store_0e8b25fb;
    DROP POLICY IF EXISTS "Users can manage own data" ON kv_store_0e8b25fb;
    
    RAISE NOTICE 'Existing policies dropped (if any)';
END $$;

-- Create policies for the service role (used by Edge Functions)
-- This allows the Edge Function to read/write all data
CREATE POLICY "Service role can manage all kv data" ON kv_store_0e8b25fb
    FOR ALL 
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Create policies for authenticated users (more restrictive)
-- Users can only access their own data or public data
CREATE POLICY "Users can read public data" ON kv_store_0e8b25fb
    FOR SELECT 
    USING (
        auth.role() = 'authenticated' 
        AND (
            key LIKE 'community:%' 
            OR key LIKE 'post:global:%'
            OR key LIKE 'product:%'
            OR key LIKE 'course:%'
            OR key LIKE 'user:%'
        )
    );

-- Users can manage their own data
CREATE POLICY "Users can manage own data" ON kv_store_0e8b25fb
    FOR ALL 
    USING (
        auth.role() = 'authenticated' 
        AND (
            key LIKE CONCAT('user:', auth.uid()::text, '%')
            OR key LIKE CONCAT('conversation:', auth.uid()::text, ':%')
            OR key LIKE CONCAT('message:%:', auth.uid()::text)
        )
    )
    WITH CHECK (
        auth.role() = 'authenticated' 
        AND (
            key LIKE CONCAT('user:', auth.uid()::text, '%')
            OR key LIKE CONCAT('conversation:', auth.uid()::text, ':%')
            OR key LIKE CONCAT('message:%:', auth.uid()::text)
        )
    );

-- Insert or update demo data (safe to run multiple times)
INSERT INTO kv_store_0e8b25fb (key, value) VALUES 
(
    'community:demo_1', 
    '{
        "id": "demo_1",
        "name": "Cape Town Tech Hub",
        "description": "Connect with local developers and entrepreneurs in Cape Town",
        "category": "Technology",
        "memberCount": 1247,
        "isPublic": true,
        "location": "Cape Town, SA",
        "createdAt": "2024-01-01T00:00:00Z"
    }'::jsonb
),
(
    'community:demo_2',
    '{
        "id": "demo_2", 
        "name": "South African Startups",
        "description": "Building the future of Africa, one startup at a time",
        "category": "Business",
        "memberCount": 892,
        "isPublic": true,
        "location": "South Africa",
        "createdAt": "2024-01-01T00:00:00Z"
    }'::jsonb
),
(
    'community:demo_3',
    '{
        "id": "demo_3",
        "name": "Local Artists Network",
        "description": "Showcase your art and connect with fellow creatives",
        "category": "Arts",
        "memberCount": 567,
        "isPublic": true,
        "location": "Western Cape",
        "createdAt": "2024-01-01T00:00:00Z"
    }'::jsonb
),
(
    'product:demo_1',
    '{
        "id": "demo_1",
        "title": "MacBook Pro 14\"",
        "description": "Excellent condition, barely used",
        "price": 25000,
        "currency": "ZAR",
        "category": "Electronics",
        "location": "Cape Town",
        "isAvailable": true,
        "sellerId": "demo-seller",
        "sellerName": "Demo Seller",
        "createdAt": "2024-01-01T00:00:00Z"
    }'::jsonb
),
(
    'product:demo_2',
    '{
        "id": "demo_2",
        "title": "Handmade Ceramic Vase",
        "description": "Beautiful locally crafted pottery",
        "price": 450,
        "currency": "ZAR",
        "category": "Art",
        "location": "Stellenbosch",
        "isAvailable": true,
        "sellerId": "demo-seller-2",
        "sellerName": "Demo Artist",
        "createdAt": "2024-01-01T00:00:00Z"
    }'::jsonb
),
(
    'course:demo_1',
    '{
        "id": "demo_1",
        "title": "React Native Development",
        "description": "Learn to build mobile apps with React Native",
        "category": "Technology",
        "price": 299,
        "duration": "8 weeks",
        "enrolledCount": 156,
        "rating": 4.8,
        "instructorId": "demo-instructor",
        "instructorName": "Demo Instructor",
        "createdAt": "2024-01-01T00:00:00Z"
    }'::jsonb
),
(
    'course:demo_2',
    '{
        "id": "demo_2",
        "title": "Digital Marketing Fundamentals",
        "description": "Master the basics of online marketing",
        "category": "Marketing",
        "price": 199,
        "duration": "6 weeks",
        "enrolledCount": 203,
        "rating": 4.6,
        "instructorId": "demo-instructor-2",
        "instructorName": "Demo Marketer",
        "createdAt": "2024-01-01T00:00:00Z"
    }'::jsonb
),
(
    'post:global:demo_1',
    '{
        "id": "demo_1",
        "content": "Just launched my new app! Excited to share it with the community 🚀",
        "type": "text",
        "authorId": "demo-user-1",
        "authorName": "Demo Developer",
        "location": "Cape Town, SA",
        "likeCount": 23,
        "commentCount": 8,
        "createdAt": "2024-01-01T00:00:00Z"
    }'::jsonb
),
(
    'post:global:demo_2',
    '{
        "id": "demo_2",
        "content": "Beautiful sunset from Table Mountain tonight! 🌅",
        "type": "image",
        "authorId": "demo-user-2",
        "authorName": "Demo Photographer",
        "location": "Cape Town, SA",
        "likeCount": 45,
        "commentCount": 12,
        "createdAt": "2024-01-01T00:00:00Z"
    }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- Create additional indexes for better performance (only if they don't exist)
DO $$
BEGIN
    -- Index for created_at column
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_kv_store_created_at') THEN
        CREATE INDEX idx_kv_store_created_at ON kv_store_0e8b25fb (created_at);
    END IF;
    
    -- GIN index for JSONB value column for faster JSON queries
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_kv_store_value_gin') THEN
        CREATE INDEX idx_kv_store_value_gin ON kv_store_0e8b25fb USING GIN (value);
    END IF;
    
    -- Partial index for community keys
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_kv_store_community_keys') THEN
        CREATE INDEX idx_kv_store_community_keys ON kv_store_0e8b25fb (key) 
        WHERE key LIKE 'community:%';
    END IF;
    
    -- Partial index for user keys
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_kv_store_user_keys') THEN
        CREATE INDEX idx_kv_store_user_keys ON kv_store_0e8b25fb (key) 
        WHERE key LIKE 'user:%';
    END IF;
    
    RAISE NOTICE 'Database indexes created successfully';
END $$;

-- Create a function to clean up old data (optional maintenance function)
CREATE OR REPLACE FUNCTION cleanup_old_kv_data()
RETURNS void AS $$
BEGIN
    -- Delete records older than 1 year for temporary data
    DELETE FROM kv_store_0e8b25fb 
    WHERE key LIKE 'session:%' 
    AND created_at < NOW() - INTERVAL '1 year';
    
    -- Delete old messages (older than 6 months)
    DELETE FROM kv_store_0e8b25fb 
    WHERE key LIKE 'message:%'
    AND created_at < NOW() - INTERVAL '6 months';
    
    RAISE NOTICE 'Old data cleanup completed';
END;
$$ language 'plpgsql';

-- Function to get statistics about the KV store
CREATE OR REPLACE FUNCTION get_kv_stats()
RETURNS TABLE (
    total_records bigint,
    communities bigint,
    users bigint,
    messages bigint,
    products bigint,
    courses bigint,
    posts bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM kv_store_0e8b25fb) as total_records,
        (SELECT COUNT(*) FROM kv_store_0e8b25fb WHERE key LIKE 'community:%') as communities,
        (SELECT COUNT(*) FROM kv_store_0e8b25fb WHERE key LIKE 'user:%') as users,
        (SELECT COUNT(*) FROM kv_store_0e8b25fb WHERE key LIKE 'message:%') as messages,
        (SELECT COUNT(*) FROM kv_store_0e8b25fb WHERE key LIKE 'product:%') as products,
        (SELECT COUNT(*) FROM kv_store_0e8b25fb WHERE key LIKE 'course:%') as courses,
        (SELECT COUNT(*) FROM kv_store_0e8b25fb WHERE key LIKE 'post:%') as posts;
END;
$$ language 'plpgsql';

-- Final verification and success message
DO $$
DECLARE
    table_exists boolean;
    policy_count integer;
    index_count integer;
    demo_count integer;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'kv_store_0e8b25fb'
    ) INTO table_exists;
    
    -- Count policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename = 'kv_store_0e8b25fb';
    
    -- Count indexes
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes 
    WHERE tablename = 'kv_store_0e8b25fb';
    
    -- Count demo data
    SELECT COUNT(*) INTO demo_count
    FROM kv_store_0e8b25fb 
    WHERE key LIKE '%demo%';
    
    -- Report results
    RAISE NOTICE '';
    RAISE NOTICE '🎉 SupaApp database setup completed successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Table: kv_store_0e8b25fb created';
    RAISE NOTICE '✅ Policies: % security policies active', policy_count;
    RAISE NOTICE '✅ Indexes: % performance indexes created', index_count;
    RAISE NOTICE '✅ Demo data: % sample records inserted', demo_count;
    RAISE NOTICE '✅ RLS: Row Level Security enabled';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Next steps:';
    RAISE NOTICE '1. Deploy your Edge Function in the Edge Functions section';
    RAISE NOTICE '2. Set SUPABASE_SERVICE_ROLE_KEY environment variable';
    RAISE NOTICE '3. Test: https://mfnwotokumvnszljeuom.supabase.co/functions/v1/make-server-0e8b25fb/health';
    RAISE NOTICE '4. Your SupaApp should show "Live" mode';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Troubleshooting: Run verify-setup.sql if you encounter issues';
    RAISE NOTICE '';
    
    -- Additional validation
    IF NOT table_exists THEN
        RAISE EXCEPTION 'Table creation failed!';
    END IF;
    
    IF policy_count < 3 THEN
        RAISE WARNING 'Expected 3 policies, found %', policy_count;
    END IF;
    
    IF demo_count < 8 THEN
        RAISE WARNING 'Expected 8+ demo records, found %', demo_count;
    END IF;
    
END $$;

-- Grant necessary permissions (idempotent)
GRANT ALL ON kv_store_0e8b25fb TO service_role;
GRANT ALL ON kv_store_0e8b25fb TO postgres;

-- Success indicator for external monitoring
SELECT 
    'SupaApp Database Setup Complete' as status,
    NOW() as timestamp,
    (SELECT COUNT(*) FROM kv_store_0e8b25fb) as total_records;