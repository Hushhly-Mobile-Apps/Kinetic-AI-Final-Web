-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security for all tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

-- User profiles linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('patient', 'provider', 'admin')),
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin users can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admin users can update all profiles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- User status for online/offline tracking
CREATE TABLE IF NOT EXISTS public.user_status (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'offline',
    online_at TIMESTAMP WITH TIME ZONE,
    offline_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on user_status
ALTER TABLE public.user_status ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_status
CREATE POLICY "Users can view all user status" ON public.user_status
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own status" ON public.user_status
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own status" ON public.user_status
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Therapy sessions
CREATE TABLE IF NOT EXISTS public.therapy_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    exercise_id UUID,
    title TEXT,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    end_time TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- in seconds
    status TEXT NOT NULL DEFAULT 'active',
    best_score REAL,
    last_activity TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on therapy_sessions
ALTER TABLE public.therapy_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for therapy_sessions
CREATE POLICY "Users can view their own sessions" ON public.therapy_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Providers can view sessions they're assigned to" ON public.therapy_sessions
    FOR SELECT USING (
        auth.uid() = provider_id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can create their own sessions" ON public.therapy_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON public.therapy_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Providers can update sessions they're assigned to" ON public.therapy_sessions
    FOR UPDATE USING (
        auth.uid() = provider_id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Pose analysis data
CREATE TABLE IF NOT EXISTS public.pose_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.therapy_sessions(id) ON DELETE CASCADE,
    pose_data JSONB,
    analysis JSONB,
    feedback TEXT,
    score REAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS on pose_analyses
ALTER TABLE public.pose_analyses ENABLE ROW LEVEL SECURITY;

-- RLS policies for pose_analyses
CREATE POLICY "Users can view their own analyses" ON public.pose_analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Providers can view analyses for their patients" ON public.pose_analyses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.therapy_sessions
            WHERE id = pose_analyses.session_id AND provider_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can insert their own analyses" ON public.pose_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Video sessions
CREATE TABLE IF NOT EXISTS public.video_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'active',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- in seconds
    metadata JSONB
);

-- Enable RLS on video_sessions
ALTER TABLE public.video_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for video_sessions
CREATE POLICY "Users can view their own video sessions" ON public.video_sessions
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = target_id);

CREATE POLICY "Users can insert their own video sessions" ON public.video_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video sessions" ON public.video_sessions
    FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = target_id);

-- Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled',
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS policies for appointments
CREATE POLICY "Users can view their own appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = provider_id);

CREATE POLICY "Users can insert their own appointments" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" ON public.appointments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Providers can update appointments they're assigned to" ON public.appointments
    FOR UPDATE USING (auth.uid() = provider_id);

-- Progress notes
CREATE TABLE IF NOT EXISTS public.progress_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES public.therapy_sessions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on progress_notes
ALTER TABLE public.progress_notes ENABLE ROW LEVEL SECURITY;

-- RLS policies for progress_notes
CREATE POLICY "Users can view their own progress notes" ON public.progress_notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Providers can view and insert notes for their patients" ON public.progress_notes
    FOR ALL USING (
        auth.uid() = provider_id OR
        EXISTS (
            SELECT 1 FROM public.therapy_sessions
            WHERE id = progress_notes.session_id AND provider_id = auth.uid()
        )
    );

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for messages
CREATE POLICY "Users can view messages they sent or received" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages they send" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update read status of messages they received" ON public.messages
    FOR UPDATE USING (auth.uid() = receiver_id);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    metadata JSONB
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update read status of their notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Create a function to automatically set updated_at on update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at column
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_therapy_sessions_updated_at
BEFORE UPDATE ON public.therapy_sessions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_notes_updated_at
BEFORE UPDATE ON public.progress_notes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Exercise templates
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    difficulty TEXT,
    target_area TEXT,
    instructions TEXT,
    duration INTEGER, -- in seconds
    video_url TEXT,
    thumbnail_url TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on exercises
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- RLS policies for exercises
CREATE POLICY "Everyone can view exercises" ON public.exercises
    FOR SELECT USING (true);

CREATE POLICY "Admin users can manage exercises" ON public.exercises
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- User exercise stats
CREATE TABLE IF NOT EXISTS public.user_exercise_stats (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    best_score REAL,
    times_performed INTEGER DEFAULT 0,
    total_duration INTEGER DEFAULT 0, -- in seconds
    first_performed TIMESTAMP WITH TIME ZONE,
    last_performed TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, exercise_id)
);

-- Enable RLS on user_exercise_stats
ALTER TABLE public.user_exercise_stats ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_exercise_stats
CREATE POLICY "Users can view their own exercise stats" ON public.user_exercise_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise stats" ON public.user_exercise_stats
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercise stats" ON public.user_exercise_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Providers can view exercise stats for their patients" ON public.user_exercise_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.therapy_sessions
            WHERE provider_id = auth.uid() AND user_id = user_exercise_stats.user_id
        ) OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create trigger for user_exercise_stats updates
CREATE TRIGGER update_exercises_updated_at
BEFORE UPDATE ON public.exercises
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();