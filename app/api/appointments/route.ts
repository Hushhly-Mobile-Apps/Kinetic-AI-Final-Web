import { NextRequest, NextResponse } from 'next/server'

// Enhanced mock data untuk appointments
let appointments = [
  {
    id: '1',
    patientId: '1',
    doctorId: '2',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    time: '10:00 AM',
    doctor: 'Dr. Sarah Miller',
    doctorImage: '/caring-doctor.png',
    type: 'Shoulder Assessment',
    mode: 'In-person',
    location: 'Main Clinic - Room 305',
    duration: '45 minutes',
    status: 'Confirmed',
    notes: 'Please arrive 15 minutes early to complete paperwork',
    insuranceVerified: true,
    reminderSent: false,
    videoLink: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '2',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    time: '2:30 PM',
    doctor: 'Dr. Sarah Miller',
    doctorImage: '/caring-doctor.png',
    type: 'Follow-up Session',
    mode: 'Virtual',
    location: 'Video Conference',
    duration: '30 minutes',
    status: 'Pending',
    notes: 'Link will be sent 30 minutes before appointment',
    insuranceVerified: true,
    reminderSent: false,
    videoLink: 'https://meet.kineticai.com/room/abc123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    patientId: '1',
    doctorId: '3',
    date: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString(),
    time: '11:00 AM',
    doctor: 'Dr. Michael Chen',
    doctorImage: '/friendly-receptionist.png',
    type: 'Progress Evaluation',
    mode: 'In-person',
    location: 'Main Clinic - Room 201',
    duration: '60 minutes',
    status: 'Confirmed',
    notes: 'Bring your exercise log and any questions',
    insuranceVerified: true,
    reminderSent: true,
    videoLink: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    const status = searchParams.get('status')
    
    let filteredAppointments = appointments
    
    if (patientId) {
      filteredAppointments = filteredAppointments.filter(apt => apt.patientId === patientId)
    }
    
    if (status) {
      filteredAppointments = filteredAppointments.filter(apt => apt.status.toLowerCase() === status.toLowerCase())
    }
    
    return NextResponse.json({
      success: true,
      data: filteredAppointments
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const appointmentData = await request.json()
    
    // Validate required fields
    const requiredFields = ['patientId', 'doctorId', 'date', 'time', 'type']
    for (const field of requiredFields) {
      if (!appointmentData[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Check for scheduling conflicts
    const conflictingAppointment = appointments.find(apt => 
      apt.doctorId === appointmentData.doctorId &&
      apt.date === appointmentData.date &&
      apt.time === appointmentData.time &&
      apt.status !== 'Cancelled'
    )
    
    if (conflictingAppointment) {
      return NextResponse.json(
        { success: false, error: 'Doctor is not available at this time' },
        { status: 409 }
      )
    }
    
    const newAppointment = {
      id: (appointments.length + 1).toString(),
      ...appointmentData,
      status: appointmentData.status || 'Pending',
      reminderSent: false,
      insuranceVerified: appointmentData.insuranceVerified || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    appointments.push(newAppointment)
    
    return NextResponse.json({
      success: true,
      data: newAppointment,
      message: 'Appointment scheduled successfully'
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Appointment ID is required' },
        { status: 400 }
      )
    }
    
    const appointmentIndex = appointments.findIndex(apt => apt.id === id)
    
    if (appointmentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Check for scheduling conflicts if date/time is being updated
    if (updateData.date || updateData.time) {
      const conflictingAppointment = appointments.find(apt => 
        apt.id !== id &&
        apt.doctorId === (updateData.doctorId || appointments[appointmentIndex].doctorId) &&
        apt.date === (updateData.date || appointments[appointmentIndex].date) &&
        apt.time === (updateData.time || appointments[appointmentIndex].time) &&
        apt.status !== 'Cancelled'
      )
      
      if (conflictingAppointment) {
        return NextResponse.json(
          { success: false, error: 'Doctor is not available at this time' },
          { status: 409 }
        )
      }
    }

    // Update appointment with new data
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: appointments[appointmentIndex],
      message: 'Appointment updated successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update appointment' },
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
        { success: false, error: 'Appointment ID is required' },
        { status: 400 }
      )
    }
    
    const appointmentIndex = appointments.findIndex(apt => apt.id === id)
    if (appointmentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      )
    }
    
    appointments.splice(appointmentIndex, 1)
    
    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete appointment' },
      { status: 500 }
    )
  }
}