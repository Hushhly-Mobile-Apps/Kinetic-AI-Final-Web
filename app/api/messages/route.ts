import { NextRequest, NextResponse } from 'next/server'

// Mock data untuk messages
let conversations = [
  {
    id: '1',
    participants: ['1', '2'], // patient and doctor IDs
    lastMessage: {
      id: '1',
      senderId: '2',
      content: 'Let me know if you have any questions about the exercises',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    messages: [
      {
        id: '1',
        senderId: '1',
        content: 'Hi Dr. Miller, I completed today\'s exercises but I\'m experiencing some discomfort in my shoulder.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        read: true
      },
      {
        id: '2',
        senderId: '2',
        content: 'Thank you for letting me know. Can you describe the type of discomfort? Is it sharp pain or more of an ache?',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        read: true
      },
      {
        id: '3',
        senderId: '1',
        content: 'It\'s more of a dull ache, especially when I raise my arm above shoulder level.',
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
        read: true
      },
      {
        id: '4',
        senderId: '2',
        content: 'That\'s normal for your stage of recovery. Let\'s reduce the intensity slightly for the next few days. Let me know if you have any questions about the exercises',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false
      }
    ]
  },
  {
    id: '2',
    participants: ['1', '7'], // patient and another doctor
    lastMessage: {
      id: '5',
      senderId: '7',
      content: 'Your progress looks good. We\'ll discuss more in our next session',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    messages: [
      {
        id: '5',
        senderId: '7',
        content: 'Your progress looks good. We\'ll discuss more in our next session',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: true
      }
    ]
  }
]

// Mock users data
const users = {
  '1': { id: '1', name: 'Alex Johnson', avatar: '/smiling-brown-haired-woman.png', role: 'patient' },
  '2': { id: '2', name: 'Dr. Sarah Miller', avatar: '/caring-doctor.png', role: 'provider' },
  '7': { id: '7', name: 'Dr. James Wilson', avatar: '/older-man-glasses.png', role: 'provider' },
  'admin': { id: 'admin', name: 'Admin Team', avatar: '/friendly-receptionist.png', role: 'admin' }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const conversationId = searchParams.get('conversationId')
    
    if (conversationId) {
      // Get specific conversation
      const conversation = conversations.find(conv => conv.id === conversationId)
      if (!conversation) {
        return NextResponse.json(
          { success: false, error: 'Conversation not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        data: conversation
      })
    }
    
    if (userId) {
      // Get conversations for specific user
      const userConversations = conversations
        .filter(conv => conv.participants.includes(userId))
        .map(conv => {
          const otherParticipantId = conv.participants.find(p => p !== userId)
          const otherParticipant = users[otherParticipantId as keyof typeof users]
          
          return {
            id: conv.id,
            name: otherParticipant?.name || 'Unknown',
            avatar: otherParticipant?.avatar || '/default-avatar.png',
            lastMessage: conv.lastMessage.content,
            unread: !conv.lastMessage.read && conv.lastMessage.senderId !== userId,
            timestamp: conv.lastMessage.timestamp
          }
        })
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      
      return NextResponse.json({
        success: true,
        data: userConversations
      })
    }
    
    return NextResponse.json({
      success: true,
      data: conversations
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, senderId, content } = body
    
    if (!conversationId || !senderId || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const conversationIndex = conversations.findIndex(conv => conv.id === conversationId)
    if (conversationIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      )
    }
    
    const newMessage = {
      id: (Date.now()).toString(),
      senderId,
      content,
      timestamp: new Date().toISOString(),
      read: false
    }
    
    conversations[conversationIndex].messages.push(newMessage)
    conversations[conversationIndex].lastMessage = newMessage
    
    return NextResponse.json({
      success: true,
      data: newMessage
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, messageId, read } = body
    
    const conversationIndex = conversations.findIndex(conv => conv.id === conversationId)
    if (conversationIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      )
    }
    
    const messageIndex = conversations[conversationIndex].messages.findIndex(msg => msg.id === messageId)
    if (messageIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      )
    }
    
    conversations[conversationIndex].messages[messageIndex].read = read
    
    return NextResponse.json({
      success: true,
      message: 'Message updated successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update message' },
      { status: 500 }
    )
  }
}