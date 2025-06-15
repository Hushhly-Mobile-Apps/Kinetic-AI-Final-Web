import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// Fallback to FastAPI backend for complex analysis
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Get auth header for backend requests
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      )
    }

    const body = await request.json();
    const { poseData, videoFrame, sessionId } = body;
    
    // Check if this is a duplicate request (prevent rapid submissions)
    if (sessionId) {
      const { data: recentAnalysis } = await supabase
        .from('pose_analyses')
        .select('created_at')
        .eq('session_id', sessionId)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
      
      if (recentAnalysis && recentAnalysis.length > 0) {
        const lastAnalysisTime = new Date(recentAnalysis[0].created_at).getTime()
        const currentTime = new Date().getTime()
        const timeDiff = currentTime - lastAnalysisTime
        
        // Prevent submissions more frequent than every 500ms
        if (timeDiff < 500) {
          return NextResponse.json({
            success: true,
            message: 'Throttled - using previous analysis',
            analysis: null,
            feedback: "Processing previous movement...",
            score: null,
          })
        }
      }
    }
    
    // Send pose data to backend for analysis
    const response = await fetch(`${BACKEND_URL}/motion/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        pose_data: poseData,
        video_frame: videoFrame,
        session_id: sessionId
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      // Store analysis results in Supabase for future reference
      const timestamp = new Date().toISOString()
      const { error: storageError } = await supabase
        .from('pose_analyses')
        .insert({
          user_id: session.user.id,
          session_id: sessionId,
          pose_data: poseData,
          analysis: data.analysis,
          feedback: data.feedback,
          score: data.score,
          created_at: timestamp
        })
      
      if (storageError) {
        console.error('Error storing pose analysis:', storageError)
      }
      
      // If this is a new high score, update user's best score
      if (data.score && sessionId) {
        const { data: sessionData } = await supabase
          .from('therapy_sessions')
          .select('exercise_id, best_score')
          .eq('id', sessionId)
          .single()
        
        if (sessionData && (!sessionData.best_score || data.score > sessionData.best_score)) {
          await supabase
            .from('therapy_sessions')
            .update({ best_score: data.score, last_activity: timestamp })
            .eq('id', sessionId)
          
          // Also update user's overall stats for this exercise
          if (sessionData.exercise_id) {
            const { data: userStats } = await supabase
              .from('user_exercise_stats')
              .select('best_score')
              .eq('user_id', session.user.id)
              .eq('exercise_id', sessionData.exercise_id)
              .single()
            
            if (!userStats || data.score > (userStats.best_score || 0)) {
              await supabase
                .from('user_exercise_stats')
                .upsert({
                  user_id: session.user.id,
                  exercise_id: sessionData.exercise_id,
                  best_score: data.score,
                  last_performed: timestamp
                }, { onConflict: 'user_id,exercise_id' })
            }
          }
        }
      }
      
      return NextResponse.json({
        success: true,
        message: 'Pose data analyzed successfully',
        analysis: data.analysis,
        feedback: data.feedback,
        score: data.score
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: data.detail || 'Failed to analyze pose data'
        },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Pose estimation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Pose estimation service unavailable',
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 50
    
    // First try to get data from Supabase
    let query = supabase
      .from('pose_analyses')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(limit)
      
    if (sessionId) {
      query = query.eq('session_id', sessionId)
    }
    
    const { data: supabaseData, error: supabaseError } = await query
    
    if (!supabaseError && supabaseData && supabaseData.length > 0) {
      return NextResponse.json({
        success: true,
        history: supabaseData,
        source: 'supabase'
      })
    }
    
    // Fallback to backend API if no data in Supabase
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      )
    }
    
    const response = await fetch(`${BACKEND_URL}/motion/history${sessionId ? `?session_id=${sessionId}` : ''}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      }
    })
    
    const data = await response.json()
    
    if (response.ok) {
      // Store the retrieved data in Supabase for future fast access
      if (Array.isArray(data) && data.length > 0) {
        const supabaseData = data.map((item: any) => ({
          user_id: session.user.id,
          session_id: item.session_id || sessionId,
          pose_data: item.pose_data,
          analysis: item.analysis,
          feedback: item.feedback,
          score: item.score,
          created_at: item.created_at || new Date().toISOString()
        }))
        
        const { error } = await supabase
          .from('pose_analyses')
          .upsert(supabaseData, { onConflict: 'user_id,session_id,created_at' })
        
        if (error) {
          console.error('Error caching pose analysis data:', error)
        }
      }
      
      return NextResponse.json({
        success: true,
        history: data,
        source: 'backend'
      })
    } else {
      return NextResponse.json(
        { success: false, message: data.detail || 'Failed to get pose history' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Pose history error:', error)
    return NextResponse.json(
      { success: false, message: 'Pose estimation service unavailable' },
      { status: 500 }
    )
  }
}