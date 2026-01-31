# Database Schema (Future Implementation)

When adding user authentication and subscription tracking, use this schema with PostgreSQL (Supabase recommended).

## Tables

### users
Managed by Supabase Auth - extends default user table

```sql
-- Custom user profile data
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  language VARCHAR(2) DEFAULT 'en',
  theme VARCHAR(10) DEFAULT 'dark',
  timezone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### sessions
Store coaching sessions (currently in localStorage)

```sql
CREATE TABLE coaching_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  input TEXT NOT NULL,
  language VARCHAR(2) NOT NULL,
  overthinking_type VARCHAR(50) NOT NULL,
  action_output TEXT NOT NULL,
  ignore_output TEXT NOT NULL,
  reframe_output TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster user queries
CREATE INDEX idx_sessions_user_id ON coaching_sessions(user_id);
CREATE INDEX idx_sessions_created_at ON coaching_sessions(created_at DESC);
```

### subscriptions
Track Stripe subscription status

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users UNIQUE,
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255),
  plan_id VARCHAR(50), -- 'free', 'basic', 'pro'
  status VARCHAR(50), -- 'active', 'cancelled', 'past_due'
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
```

### usage_tracking
Track API usage per user (for rate limiting/analytics)

```sql
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  action_type VARCHAR(50) NOT NULL, -- 'coaching_session', 'api_call'
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_usage_user_id ON usage_tracking(user_id);
CREATE INDEX idx_usage_created_at ON usage_tracking(created_at DESC);
```

## Row Level Security (RLS)

Enable RLS for all tables to ensure users can only access their own data:

```sql
-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can read their own sessions
CREATE POLICY "Users can view own sessions"
  ON coaching_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create sessions
CREATE POLICY "Users can create sessions"
  ON coaching_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view their subscription
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);
```

## Migration Steps

1. **Set up Supabase project**
   - Create account at supabase.com
   - Create new project
   - Get API keys

2. **Run migrations**
   ```sql
   -- Run the CREATE TABLE statements above
   -- Run the RLS policies
   ```

3. **Update environment variables**
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key
   ```

4. **Update frontend code**
   - Install: `npm install @supabase/supabase-js`
   - Uncomment auth service implementation
   - Update storage service to use database instead of localStorage

5. **Update backend code**
   - Add Supabase client initialization
   - Add middleware to verify JWT tokens
   - Add database queries instead of in-memory processing

## GDPR Compliance

When implementing database:

1. **Data deletion endpoint**
```sql
-- Function to delete all user data
CREATE OR REPLACE FUNCTION delete_user_data(user_uuid UUID)
RETURNS void AS $$
BEGIN
  DELETE FROM usage_tracking WHERE user_id = user_uuid;
  DELETE FROM coaching_sessions WHERE user_id = user_uuid;
  DELETE FROM subscriptions WHERE user_id = user_uuid;
  DELETE FROM user_profiles WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

2. **Data export endpoint**
- Create API endpoint to export all user data as JSON
- Include all sessions, profile data, subscription info

3. **Add privacy policy and terms of service**
- Update footer links to actual pages
- Include cookie consent if adding analytics
