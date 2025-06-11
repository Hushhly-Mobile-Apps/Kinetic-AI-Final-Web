"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Clock, MapPin, User, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useSocket } from "@/lib/socket-provider"

// Mock data for available therapists
const therapists = [
  {
    id: "th1",
    name: "Dr. Sarah Johnson",
    specialty: "Physical Therapist",
    avatar: "/caring-doctor.png",
    location: "Main Clinic",
    address: "123 Healing Ave, Suite 101",
  },
  {
    id: "th2",
    name: "Dr. Michael Chen",
    specialty: "Sports Rehabilitation",
    avatar: "/placeholder-hx4x6.png",
    location: "Sports Medicine Center",
    address: "456 Recovery Blvd",
  },
  {
    id: "th3",
    name: "Dr. Emily Rodriguez",
    specialty: "Neurological Rehabilitation",
    avatar: "/placeholder-hx4x6.png",
    location: "Neurology Wing",
    address: "789 Wellness Way",
  },
]

// Mock data for available time slots
const generateTimeSlots = (date: Date) => {
  // Generate different time slots based on the day of the week
  const day = date.getDay() // 0 = Sunday, 1 = Monday, etc.
  const isWeekend = day === 0 || day === 6

  const startHour = isWeekend ? 10 : 9
  const endHour = isWeekend ? 14 : 17

  const slots = []
  for (let hour = startHour; hour < endHour; hour++) {
    for (const minute of [0, 30]) {
      // Randomly make some slots unavailable
      const isAvailable = Math.random() > 0.3
      if (isAvailable) {
        slots.push({
          time: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
          available: true,
        })
      }
    }
  }
  return slots
}

export default function ScheduleAppointmentPage() {
  const router = useRouter()
  const { socket, isConnected } = useSocket()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedTherapist, setSelectedTherapist] = useState<string | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [timeSlots, setTimeSlots] = useState<{ time: string; available: boolean }[]>([])
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Update time slots when date changes
  useEffect(() => {
    if (date) {
      setTimeSlots(generateTimeSlots(date))
      setSelectedTime(undefined) // Reset selected time when date changes
    }
  }, [date])

  // Handle appointment submission
  const handleSubmit = () => {
    if (!date || !selectedTherapist || !selectedTime) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const appointmentData = {
        date: format(date, "yyyy-MM-dd"),
        time: selectedTime,
        therapistId: selectedTherapist,
        patientId: "current-user-id", // In a real app, this would come from auth context
      }

      // Emit socket event for real-time updates
      if (socket && isConnected) {
        socket.emit("appointment_created", appointmentData)
      }

      setIsSubmitting(false)
      setIsSuccess(true)

      // Redirect after showing success message
      setTimeout(() => {
        router.push("/appointments")
      }, 2000)
    }, 1500)
  }

  // Get selected therapist data
  const getTherapist = (id: string) => {
    return therapists.find((t) => t.id === id)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Schedule Appointment</h1>

      {isSuccess ? (
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold text-center mb-2">Appointment Scheduled!</h2>
            <p className="text-gray-600 text-center mb-4">
              Your appointment has been successfully scheduled. You will receive a confirmation email shortly.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg w-full mb-4">
              <div className="flex items-center mb-2">
                <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span>{date && format(date, "EEEE, MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <span>{selectedTime}</span>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-500 mr-2" />
                <span>{selectedTherapist && getTherapist(selectedTherapist)?.name}</span>
              </div>
            </div>
            <Button className="w-full" onClick={() => router.push("/appointments")}>
              View My Appointments
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <div
              className={`flex items-center justify-center h-8 w-8 rounded-full ${
                step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              } mr-2`}
            >
              1
            </div>
            <div className={`h-1 w-16 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"} mr-2`}></div>
            <div
              className={`flex items-center justify-center h-8 w-8 rounded-full ${
                step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              } mr-2`}
            >
              2
            </div>
            <div className={`h-1 w-16 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"} mr-2`}></div>
            <div
              className={`flex items-center justify-center h-8 w-8 rounded-full ${
                step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              3
            </div>
          </div>

          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Select a Therapist</h2>
              <RadioGroup value={selectedTherapist} onValueChange={setSelectedTherapist}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {therapists.map((therapist) => (
                    <Card
                      key={therapist.id}
                      className={cn(
                        "cursor-pointer transition-all",
                        selectedTherapist === therapist.id
                          ? "border-blue-600 ring-2 ring-blue-200"
                          : "hover:border-blue-200",
                      )}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start">
                          <RadioGroupItem value={therapist.id} id={therapist.id} className="mt-1 mr-2" />
                          <div>
                            <Label htmlFor={therapist.id} className="text-lg font-medium cursor-pointer">
                              {therapist.name}
                            </Label>
                            <CardDescription>{therapist.specialty}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin size={14} className="mr-1" />
                          {therapist.location}
                        </div>
                        <div className="text-sm text-gray-600">{therapist.address}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </RadioGroup>

              <div className="mt-6 flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!selectedTherapist}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <Card className="md:w-1/2">
                  <CardContent className="pt-6">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                      disabled={(date) => {
                        // Disable past dates and Sundays
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return date < today || date.getDay() === 0
                      }}
                      initialFocus
                    />
                  </CardContent>
                </Card>

                <div className="md:w-1/2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Selected Date</CardTitle>
                      <CardDescription>
                        {date ? format(date, "EEEE, MMMM d, yyyy") : "Please select a date"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {date && selectedTherapist && (
                        <div>
                          <h3 className="text-sm font-medium mb-2">Available Times</h3>
                          {timeSlots.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2">
                              {timeSlots.map((slot, index) => (
                                <Button
                                  key={index}
                                  variant={selectedTime === slot.time ? "default" : "outline"}
                                  className="text-sm"
                                  onClick={() => setSelectedTime(slot.time)}
                                >
                                  {slot.time}
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500">No available times for this date.</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!date || !selectedTime}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Review and Confirm</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Therapist</h3>
                      {selectedTherapist && (
                        <div className="flex items-center mt-1">
                          <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                          <div>
                            <p className="font-medium">{getTherapist(selectedTherapist)?.name}</p>
                            <p className="text-sm text-gray-600">{getTherapist(selectedTherapist)?.specialty}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                      <div className="mt-1">
                        <p className="font-medium">{date && format(date, "EEEE, MMMM d, yyyy")}</p>
                        <p className="text-sm text-gray-600">{selectedTime}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <div className="mt-1">
                        <p className="font-medium">{selectedTherapist && getTherapist(selectedTherapist)?.location}</p>
                        <p className="text-sm text-gray-600">
                          {selectedTherapist && getTherapist(selectedTherapist)?.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col space-y-2">
                  <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Scheduling..." : "Confirm Appointment"}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setStep(2)} disabled={isSubmitting}>
                    Back
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
