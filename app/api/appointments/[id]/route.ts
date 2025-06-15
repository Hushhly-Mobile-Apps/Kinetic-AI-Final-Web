import { NextRequest, NextResponse } from 'next/server'

// Mock data untuk appointments (same as main route)
let appointments = [
  {
    id: '1',
    patientId: '1',
    doctorId: '2',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    time: '10:00 AM',
    doctor: 'Dr. Sarah Miller',
    type: 'Shoulder Assessment',
    mode: 'In-person',
    location: 'Main Clinic - Room 305',
    duration: '45 minutes',
    status: 'Confirmed',
    notes: 'Please arrive 15 minutes early to complete paperwork',
    insuranceVerified: true,
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
    type: 'Follow-up Session',
    mode: 'Virtual',
    location: 'Video Conference',
    duration: '30 minutes',
    status: 'Pending',
    notes: 'Link will be sent 30 minutes before appointment',
    insuranceVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// GET single appointment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = appointments.find(apt => apt.id === params.id)
    
    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: appointment
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointment' },
      { status: 500 }
    )
  }
}

// PUT update appointment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updateData = await request.json()
    const appointmentIndex = appointments.findIndex(apt => apt.id === params.id)
    
    if (appointmentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      )
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

// DELETE appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentIndex = appointments.findIndex(apt => apt.id === params.id)
    
    if (appointmentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Remove appointment
    const deletedAppointment = appointments.splice(appointmentIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedAppointment,
      message: 'Appointment cancelled successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to cancel appointment' },
      { status: 500 }
    )
  }
}