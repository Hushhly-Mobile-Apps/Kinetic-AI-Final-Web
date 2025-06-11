'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Calendar, Clock, MapPin, Video, Phone, Edit, Trash2, Plus, CheckCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'

interface Appointment {
  id: string
  patientId: string
  doctorId: string
  date: string
  time: string
  doctor: string
  doctorImage?: string
  type: string
  mode: 'In-person' | 'Virtual'
  location: string
  duration: string
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed'
  notes?: string
  insuranceVerified: boolean
  reminderSent: boolean
  videoLink?: string
  createdAt: string
  updatedAt: string
}

interface AppointmentsManagerProps {
  patientId?: string
  onAppointmentUpdate?: (appointment: Appointment) => void
}

export function AppointmentsManager({ patientId, onAppointmentUpdate }: AppointmentsManagerProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  // Form state for new/edit appointment
  const [formData, setFormData] = useState({
    doctorId: '',
    doctor: '',
    date: '',
    time: '',
    type: '',
    mode: 'In-person' as 'In-person' | 'Virtual',
    location: '',
    duration: '30 minutes',
    notes: ''
  })

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const params = patientId ? `?patientId=${patientId}` : ''
      const response = await fetch(`/api/appointments${params}`)
      const result = await response.json()
      
      if (result.success) {
        setAppointments(result.data)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to fetch appointments',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch appointments',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Create new appointment
  const createAppointment = async () => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          patientId: patientId || '1',
          status: 'Pending'
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setAppointments(prev => [...prev, result.data])
        setIsDialogOpen(false)
        resetForm()
        toast({
          title: 'Success',
          description: result.message || 'Appointment scheduled successfully'
        })
        onAppointmentUpdate?.(result.data)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to schedule appointment',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to schedule appointment',
        variant: 'destructive'
      })
    }
  }

  // Update appointment
  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setAppointments(prev => 
          prev.map(apt => apt.id === id ? result.data : apt)
        )
        toast({
          title: 'Success',
          description: result.message || 'Appointment updated successfully'
        })
        onAppointmentUpdate?.(result.data)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update appointment',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update appointment',
        variant: 'destructive'
      })
    }
  }

  // Cancel appointment
  const cancelAppointment = async (id: string) => {
    await updateAppointment(id, { status: 'Cancelled' })
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      doctorId: '',
      doctor: '',
      date: '',
      time: '',
      type: '',
      mode: 'In-person',
      location: '',
      duration: '30 minutes',
      notes: ''
    })
    setIsEditing(false)
    setSelectedAppointment(null)
  }

  // Handle edit
  const handleEdit = (appointment: Appointment) => {
    setFormData({
      doctorId: appointment.doctorId,
      doctor: appointment.doctor,
      date: appointment.date.split('T')[0],
      time: appointment.time,
      type: appointment.type,
      mode: appointment.mode,
      location: appointment.location,
      duration: appointment.duration,
      notes: appointment.notes || ''
    })
    setSelectedAppointment(appointment)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // Handle save
  const handleSave = async () => {
    if (isEditing && selectedAppointment) {
      await updateAppointment(selectedAppointment.id, formData)
      setIsDialogOpen(false)
      resetForm()
    } else {
      await createAppointment()
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      case 'Completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  useEffect(() => {
    fetchAppointments()
  }, [patientId])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-black">Appointments</h2>
          <p className="text-black mt-1">Manage your upcoming and past appointments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#014585] hover:bg-[#013a70] text-white" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-black">
                {isEditing ? 'Edit Appointment' : 'Schedule New Appointment'}
              </DialogTitle>
              <DialogDescription className="text-black">
                {isEditing ? 'Update appointment details' : 'Fill in the details for your new appointment'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-black">Doctor</label>
                <Input
                  value={formData.doctor}
                  onChange={(e) => setFormData(prev => ({ ...prev, doctor: e.target.value }))}
                  placeholder="Dr. Sarah Miller"
                  className="text-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-black">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="text-black"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-black">Time</label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="text-black"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-black">Appointment Type</label>
                <Input
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  placeholder="Shoulder Assessment"
                  className="text-black"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-black">Mode</label>
                <Select value={formData.mode} onValueChange={(value: 'In-person' | 'Virtual') => setFormData(prev => ({ ...prev, mode: value }))}>
                  <SelectTrigger className="text-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In-person">In-person</SelectItem>
                    <SelectItem value="Virtual">Virtual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-black">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Main Clinic - Room 305"
                  className="text-black"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-black">Notes</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any special instructions..."
                  className="text-black"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1 bg-[#014585] hover:bg-[#013a70] text-white">
                  {isEditing ? 'Update' : 'Schedule'}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="text-black">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">No appointments scheduled</h3>
              <p className="text-black mb-4">Schedule your first appointment to get started</p>
              <Button className="bg-[#014585] hover:bg-[#013a70] text-white" onClick={() => setIsDialogOpen(true)}>
                Schedule Appointment
              </Button>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {appointment.doctorImage && (
                      <Image
                        src={appointment.doctorImage}
                        alt={appointment.doctor}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-black">{appointment.type}</h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-black font-medium mb-1">{appointment.doctor}</p>
                      <div className="flex items-center gap-4 text-sm text-black">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(appointment.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appointment.time}
                        </div>
                        <div className="flex items-center gap-1">
                          {appointment.mode === 'Virtual' ? (
                            <Video className="w-4 h-4" />
                          ) : (
                            <MapPin className="w-4 h-4" />
                          )}
                          {appointment.location}
                        </div>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-black mt-2 bg-gray-50 p-2 rounded">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {appointment.status === 'Confirmed' && appointment.mode === 'Virtual' && appointment.videoLink && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <Video className="w-4 h-4 mr-1" />
                        Join Call
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleEdit(appointment)} className="text-black">
                      <Edit className="w-4 h-4" />
                    </Button>
                    {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => cancelAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}