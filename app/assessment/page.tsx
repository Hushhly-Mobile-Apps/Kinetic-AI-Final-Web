import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] py-12">
      <header className="w-full bg-[#111827] text-white py-3 px-4 mb-8">
        <div className="container mx-auto flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/kinetic-new-logo.png" alt="Kinetic Logo" width={40} height={40} />
            <span className="font-bold text-xl">KINETIC</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#111827] p-6 text-white">
            <h1 className="text-2xl font-bold">Initial Recovery Assessment</h1>
            <p className="text-[#9ca3af]">Complete this assessment to help us create your personalized recovery plan</p>
          </div>

          <form className="p-6 space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827] border-b pb-2">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter your first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter your last name" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter your phone number" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="Enter your age" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" placeholder="Enter your height" />
                </div>
              </div>
            </div>

            {/* Medical Condition */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827] border-b pb-2">Medical Condition</h2>
              <div className="space-y-2">
                <Label htmlFor="condition">Primary Condition</Label>
                <Select>
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Select your condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="knee-injury">Knee Injury</SelectItem>
                    <SelectItem value="back-pain">Back Pain</SelectItem>
                    <SelectItem value="shoulder-injury">Shoulder Injury</SelectItem>
                    <SelectItem value="hip-replacement">Hip Replacement</SelectItem>
                    <SelectItem value="stroke-recovery">Stroke Recovery</SelectItem>
                    <SelectItem value="sports-injury">Sports Injury</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">How long have you had this condition?</Label>
                <Select>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-week">Less than a week</SelectItem>
                    <SelectItem value="1-4-weeks">1-4 weeks</SelectItem>
                    <SelectItem value="1-3-months">1-3 months</SelectItem>
                    <SelectItem value="3-6-months">3-6 months</SelectItem>
                    <SelectItem value="6-12-months">6-12 months</SelectItem>
                    <SelectItem value="more-than-year">More than a year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Please describe your condition in detail</Label>
                <Textarea
                  id="description"
                  placeholder="Include information about symptoms, previous treatments, and how it affects your daily life"
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Pain Level (0 = No Pain, 10 = Worst Pain)</Label>
                <RadioGroup defaultValue="5" className="flex space-x-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <div key={value} className="flex flex-col items-center">
                      <RadioGroupItem value={value.toString()} id={`pain-${value}`} className="sr-only" />
                      <Label
                        htmlFor={`pain-${value}`}
                        className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border border-gray-300 hover:bg-gray-100 peer-checked:bg-[#111827] peer-checked:text-white"
                      >
                        {value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Medical History */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827] border-b pb-2">Medical History</h2>
              <div className="space-y-2">
                <Label>Do you have any of the following conditions? (Select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "Diabetes",
                    "Heart Disease",
                    "High Blood Pressure",
                    "Arthritis",
                    "Osteoporosis",
                    "Asthma",
                    "Previous Surgery",
                    "Chronic Pain",
                  ].map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox id={`condition-${condition.toLowerCase().replace(" ", "-")}`} />
                      <Label htmlFor={`condition-${condition.toLowerCase().replace(" ", "-")}`}>{condition}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  placeholder="List any medications you are currently taking"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Recovery Goals */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827] border-b pb-2">Recovery Goals</h2>
              <div className="space-y-2">
                <Label>What are your primary goals for recovery? (Select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "Pain Reduction",
                    "Improved Mobility",
                    "Return to Sports",
                    "Perform Daily Activities",
                    "Prevent Future Injuries",
                    "Improve Strength",
                    "Improve Balance",
                    "Prepare for Surgery",
                  ].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox id={`goal-${goal.toLowerCase().replace(" ", "-")}`} />
                      <Label htmlFor={`goal-${goal.toLowerCase().replace(" ", "-")}`}>{goal}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specific-goals">Specific Goals</Label>
                <Textarea
                  id="specific-goals"
                  placeholder="Describe any specific activities you want to return to or goals you want to achieve"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 flex justify-between">
              <Link href="/recovery-journey">
                <Button variant="outline" className="border-[#111827] text-[#111827]">
                  Back
                </Button>
              </Link>
              <Link href="/personalized-plan">
                <Button className="bg-[#111827] hover:bg-[#1f2937]">Submit Assessment</Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
