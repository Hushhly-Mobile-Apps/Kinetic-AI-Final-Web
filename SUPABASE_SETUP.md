# Supabase Setup Guide for Kinetic AI

This guide will help you set up Supabase for your Kinetic AI application.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up or log in
2. Create a new project
3. Choose a name for your project and set a secure database password
4. Select a region closest to your target users
5. Wait for your project to be created (may take a few minutes)

## 2. Configure Your Environment Variables

1. In your Supabase project dashboard, go to "Settings" > "API"
2. Copy the "Project URL" and "anon public" key
3. Create a `.env.local` file in the root of your project (copy from `.env.local.example`)
4. Set the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Set Up the Database Schema

1. In your Supabase project dashboard, go to "SQL Editor"
2. Create a new query
3. Copy the contents of the `supabase-schema.sql` file in the root of this project
4. Run the query to create all the required tables and security policies

## 4. Configure Authentication

1. In your Supabase project dashboard, go to "Authentication" > "Providers"
2. Enable "Email" provider and configure as needed:
   - Customize the email template if desired
   - Enable "Confirm email" for added security
3. (Optional) Enable additional providers like Google, GitHub, etc. if needed

## 5. Set Up Storage

1. In your Supabase project dashboard, go to "Storage"
2. Create the following buckets:
   - `avatars` - for user profile images
   - `exercises` - for exercise tutorial videos and images
   - `session-data` - for pose estimation data
   - `media` - for general media uploads

3. Set the following policies for each bucket:

#### Avatars Bucket

Add these RLS policies:
- Allow authenticated users to view all avatars:
  ```sql
  (bucket_id = 'avatars'::text) AND (auth.role() = 'authenticated'::text)
  ```
- Allow users to upload their own avatar:
  ```sql
  (bucket_id = 'avatars'::text) AND (auth.uid()::text = (storage.foldername(name))[1])
  ```

#### Exercises Bucket

Add these RLS policies:
- Allow anyone to view exercise media:
  ```sql
  (bucket_id = 'exercises'::text)
  ```
- Allow only admins to upload exercise media:
  ```sql
  (bucket_id = 'exercises'::text) AND (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  ```

#### Session Data Bucket

Add these RLS policies:
- Allow users to view their own session data:
  ```sql
  (bucket_id = 'session-data'::text) AND (auth.uid()::text = (storage.foldername(name))[1])
  ```
- Allow therapists to view session data for their patients:
  ```sql
  (bucket_id = 'session-data'::text) AND (
    EXISTS (
      SELECT 1 FROM therapy_sessions
      WHERE provider_id = auth.uid() AND user_id::text = (storage.foldername(name))[1]
    )
  )
  ```

## 6. Set Up Edge Functions (Optional, for Advanced Features)

1. Install Supabase CLI if not already installed:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   ```

3. Deploy functions for automated tasks:
   ```bash
   supabase functions deploy send-appointment-reminders
   supabase functions deploy generate-weekly-reports
   ```

## 7. Configure Real-time Subscriptions

1. In your Supabase project dashboard, go to "Database" > "Replication"
2. Ensure that publication `supabase_realtime` is enabled
3. Add the tables you want to enable for real-time updates:
   - `user_status`
   - `messages`
   - `notifications`
   - `therapy_sessions` (only status changes)
   - `appointments`

## 8. Setting Up Database Triggers for Notifications

1. Run the following SQL in the SQL Editor:

```sql
-- Function to create notifications
CREATE OR REPLACE FUNCTION create_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, type, metadata)
  VALUES (
    NEW.user_id,
    CASE
      WHEN TG_TABLE_NAME = 'appointments' THEN 'New Appointment'
      WHEN TG_TABLE_NAME = 'therapy_sessions' THEN 'Therapy Session Update'
      WHEN TG_TABLE_NAME = 'messages' THEN 'New Message'
      ELSE 'New Notification'
    END,
    CASE
      WHEN TG_TABLE_NAME = 'appointments' THEN 'You have a new appointment scheduled'
      WHEN TG_TABLE_NAME = 'therapy_sessions' THEN 'Your therapy session has been updated'
      WHEN TG_TABLE_NAME = 'messages' THEN 'You have received a new message'
      ELSE 'You have a new notification'
    END,
    TG_TABLE_NAME,
    jsonb_build_object('id', NEW.id, 'created_at', NEW.created_at)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new appointments
CREATE TRIGGER on_appointment_created
AFTER INSERT ON appointments
FOR EACH ROW EXECUTE FUNCTION create_notification();

-- Trigger for new messages
CREATE TRIGGER on_message_created
AFTER INSERT ON messages
FOR EACH ROW
WHEN (NEW.sender_id <> NEW.receiver_id)
EXECUTE FUNCTION create_notification();
```

## 9. Test Your Setup

1. Start your application:
   ```bash
   npm run dev
   ```

2. Register a new user to test authentication
3. Create a therapy session to test database operations
4. Upload an avatar to test storage
5. Send a message to test real-time features

## Troubleshooting

- **Authentication Issues**: Check that your environment variables are correctly set
- **Database Errors**: Check the SQL Editor logs for any errors in your schema
- **Storage Problems**: Verify your bucket policies are correctly configured
- **Real-time Not Working**: Ensure the tables are added to the realtime publication

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)