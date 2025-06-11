import { NextRequest, NextResponse } from 'next/server'

// Mock data untuk video library
let videos = [
  {
    id: '1',
    title: 'Shoulder Mobility Basics',
    description: 'Learn the fundamental movements for shoulder rehabilitation',
    category: 'Shoulder',
    difficulty: 'Beginner',
    duration: '8:45',
    thumbnail: '/video-thumbnails/shoulder-mobility.jpg',
    videoUrl: '/videos/shoulder-mobility.mp4',
    instructor: 'Dr. Sarah Miller',
    views: 1250,
    likes: 89,
    tags: ['shoulder', 'mobility', 'beginner', 'rehabilitation'],
    uploadDate: '2024-01-15',
    status: 'Published',
    exercises: [
      'Arm Circles',
      'Shoulder Rolls',
      'Cross-body Stretch',
      'Wall Slides'
    ]
  },
  {
    id: '2',
    title: 'Advanced Knee Strengthening',
    description: 'Progressive exercises for knee stability and strength',
    category: 'Knee',
    difficulty: 'Advanced',
    duration: '12:30',
    thumbnail: '/video-thumbnails/knee-strengthening.jpg',
    videoUrl: '/videos/knee-strengthening.mp4',
    instructor: 'Dr. James Wilson',
    views: 890,
    likes: 67,
    tags: ['knee', 'strengthening', 'advanced', 'stability'],
    uploadDate: '2024-01-20',
    status: 'Published',
    exercises: [
      'Single Leg Squats',
      'Step-ups',
      'Lateral Lunges',
      'Calf Raises'
    ]
  },
  {
    id: '3',
    title: 'Core Stability Fundamentals',
    description: 'Essential core exercises for overall stability',
    category: 'Core',
    difficulty: 'Intermediate',
    duration: '10:15',
    thumbnail: '/video-thumbnails/core-stability.jpg',
    videoUrl: '/videos/core-stability.mp4',
    instructor: 'Dr. Emily Chen',
    views: 1450,
    likes: 112,
    tags: ['core', 'stability', 'intermediate', 'balance'],
    uploadDate: '2024-02-01',
    status: 'Published',
    exercises: [
      'Plank Variations',
      'Dead Bug',
      'Bird Dog',
      'Side Plank'
    ]
  },
  {
    id: '4',
    title: 'Back Pain Relief Routine',
    description: 'Gentle exercises to alleviate lower back pain',
    category: 'Back',
    difficulty: 'Beginner',
    duration: '15:20',
    thumbnail: '/video-thumbnails/back-pain-relief.jpg',
    videoUrl: '/videos/back-pain-relief.mp4',
    instructor: 'Dr. Sarah Miller',
    views: 2100,
    likes: 156,
    tags: ['back', 'pain relief', 'beginner', 'gentle'],
    uploadDate: '2024-02-10',
    status: 'Published',
    exercises: [
      'Cat-Cow Stretch',
      'Knee to Chest',
      'Pelvic Tilts',
      'Child\'s Pose'
    ]
  },
  {
    id: '5',
    title: 'Hip Flexibility Workshop',
    description: 'Comprehensive hip mobility and flexibility training',
    category: 'Hip',
    difficulty: 'Intermediate',
    duration: '18:45',
    thumbnail: '/video-thumbnails/hip-flexibility.jpg',
    videoUrl: '/videos/hip-flexibility.mp4',
    instructor: 'Dr. James Wilson',
    views: 750,
    likes: 45,
    tags: ['hip', 'flexibility', 'intermediate', 'mobility'],
    uploadDate: '2024-02-15',
    status: 'Published',
    exercises: [
      'Hip Circles',
      'Pigeon Pose',
      'Hip Flexor Stretch',
      'Butterfly Stretch'
    ]
  }
]

const categories = ['All', 'Shoulder', 'Knee', 'Core', 'Back', 'Hip', 'Ankle', 'Neck']
const difficulties = ['Beginner', 'Intermediate', 'Advanced']

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')
    const instructor = searchParams.get('instructor')
    const videoId = searchParams.get('id')
    
    if (videoId) {
      // Get specific video
      const video = videos.find(v => v.id === videoId)
      if (!video) {
        return NextResponse.json(
          { success: false, error: 'Video not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        data: video
      })
    }
    
    let filteredVideos = videos
    
    // Filter by category
    if (category && category !== 'All') {
      filteredVideos = filteredVideos.filter(video => 
        video.category.toLowerCase() === category.toLowerCase()
      )
    }
    
    // Filter by difficulty
    if (difficulty) {
      filteredVideos = filteredVideos.filter(video => 
        video.difficulty.toLowerCase() === difficulty.toLowerCase()
      )
    }
    
    // Filter by instructor
    if (instructor) {
      filteredVideos = filteredVideos.filter(video => 
        video.instructor.toLowerCase().includes(instructor.toLowerCase())
      )
    }
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredVideos = filteredVideos.filter(video => 
        video.title.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        videos: filteredVideos,
        categories,
        difficulties,
        total: filteredVideos.length
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newVideo = {
      id: (videos.length + 1).toString(),
      ...body,
      views: 0,
      likes: 0,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Published'
    }
    
    videos.push(newVideo)
    
    return NextResponse.json({
      success: true,
      data: newVideo
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to upload video' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, ...updateData } = body
    
    const videoIndex = videos.findIndex(video => video.id === id)
    if (videoIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      )
    }
    
    if (action === 'like') {
      videos[videoIndex].likes += 1
    } else if (action === 'view') {
      videos[videoIndex].views += 1
    } else {
      videos[videoIndex] = { ...videos[videoIndex], ...updateData }
    }
    
    return NextResponse.json({
      success: true,
      data: videos[videoIndex]
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update video' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Video ID is required' },
        { status: 400 }
      )
    }
    
    const videoIndex = videos.findIndex(video => video.id === id)
    if (videoIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      )
    }
    
    videos.splice(videoIndex, 1)
    
    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete video' },
      { status: 500 }
    )
  }
}