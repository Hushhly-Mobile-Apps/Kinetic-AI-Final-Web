import { NextRequest, NextResponse } from 'next/server'

// Mock data untuk progress tracking
let progressData = {
  '1': { // patientId
    overall: 72,
    pain: {
      current: 3,
      initial: 8,
      history: [
        { date: '2023-12-01', level: 8 },
        { date: '2023-12-15', level: 7 },
        { date: '2024-01-01', level: 6 },
        { date: '2024-01-15', level: 5 },
        { date: '2024-02-01', level: 4 },
        { date: '2024-02-15', level: 3 }
      ]
    },
    mobility: {
      current: 68,
      initial: 20,
      history: [
        { date: '2023-12-01', level: 20 },
        { date: '2023-12-15', level: 30 },
        { date: '2024-01-01', level: 40 },
        { date: '2024-01-15', level: 50 },
        { date: '2024-02-01', level: 60 },
        { date: '2024-02-15', level: 68 }
      ]
    },
    strength: {
      current: 65,
      initial: 30,
      history: [
        { date: '2023-12-01', level: 30 },
        { date: '2023-12-15', level: 35 },
        { date: '2024-01-01', level: 45 },
        { date: '2024-01-15', level: 50 },
        { date: '2024-02-01', level: 60 },
        { date: '2024-02-15', level: 65 }
      ]
    },
    weeklyActivity: [
      {
        day: 'Monday',
        exercise: 'Knee Exercises',
        status: 'Completed',
        difficulty: 8,
        duration: 20,
      },
      {
        day: 'Tuesday',
        exercise: 'Stretching Routine',
        status: 'Completed',
        difficulty: 6,
        duration: 15,
      },
      {
        day: 'Wednesday',
        exercise: 'Strength Training',
        status: 'Completed',
        difficulty: 9,
        duration: 25,
      },
      {
        day: 'Thursday',
        exercise: 'Balance Exercises',
        status: 'Missed',
        difficulty: 7,
        duration: 15,
      },
      {
        day: 'Friday',
        exercise: 'Cardio Session',
        status: 'Upcoming',
        difficulty: 8,
        duration: 20,
      },
      {
        day: 'Saturday',
        exercise: 'Rest Day',
        status: 'N/A',
        difficulty: 0,
        duration: 0,
      },
      {
        day: 'Sunday',
        exercise: 'Light Stretching',
        status: 'Upcoming',
        difficulty: 4,
        duration: 10,
      }
    ],
    achievements: [
      {
        id: '1',
        title: 'Perfect Week Streak',
        description: '3 days ago',
        icon: 'trophy'
      },
      {
        id: '2',
        title: 'Pain Reduction Milestone',
        description: '1 week ago',
        icon: 'zap'
      },
      {
        id: '3',
        title: 'Form Master Badge',
        description: '2 weeks ago',
        icon: 'award'
      }
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    const metric = searchParams.get('metric')
    
    if (!patientId) {
      return NextResponse.json(
        { success: false, error: 'Patient ID is required' },
        { status: 400 }
      )
    }
    
    const patientProgress = progressData[patientId as keyof typeof progressData]
    if (!patientProgress) {
      return NextResponse.json(
        { success: false, error: 'Patient progress data not found' },
        { status: 404 }
      )
    }
    
    if (metric) {
      // Return specific metric data
      const metricData = patientProgress[metric as keyof typeof patientProgress]
      if (!metricData) {
        return NextResponse.json(
          { success: false, error: 'Metric not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        data: metricData
      })
    }
    
    return NextResponse.json({
      success: true,
      data: patientProgress
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch progress data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientId, metric, value } = body
    
    if (!patientId || !metric || value === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    let patientProgress = progressData[patientId as keyof typeof progressData]
    if (!patientProgress) {
      // Create new patient progress data if it doesn't exist
      patientProgress = {
        overall: 0,
        pain: { current: 0, initial: 0, history: [] },
        mobility: { current: 0, initial: 0, history: [] },
        strength: { current: 0, initial: 0, history: [] },
        weeklyActivity: [],
        achievements: []
      }
      progressData = { ...progressData, [patientId]: patientProgress }
    }
    
    if (metric === 'pain' || metric === 'mobility' || metric === 'strength') {
      // Update metric current value
      patientProgress[metric].current = value
      
      // Add to history
      patientProgress[metric].history.push({
        date: new Date().toISOString().split('T')[0],
        level: value
      })
      
      // Recalculate overall progress
      patientProgress.overall = Math.round(
        (patientProgress.pain.current + patientProgress.mobility.current + patientProgress.strength.current) / 3
      )
    } else if (metric === 'weeklyActivity') {
      // Add new activity
      patientProgress.weeklyActivity.push(value)
    } else if (metric === 'achievement') {
      // Add new achievement
      patientProgress.achievements.push({
        id: (patientProgress.achievements.length + 1).toString(),
        ...value,
        description: 'Just now'
      })
    }
    
    return NextResponse.json({
      success: true,
      data: patientProgress
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update progress data' },
      { status: 500 }
    )
  }
}