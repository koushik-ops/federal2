"use client"

import { useState } from "react"
import { 
  User, 
  Heart, 
  Droplets, 
  AlertTriangle, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  Activity,
  FileText,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface HealthInfo {
  bloodGroup: string
  height: string
  weight: string
  allergies: string[]
  chronicConditions: string[]
  medications: string[]
}

interface UserProfile {
  name: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  emergencyContact: {
    name: string
    phone: string
    relation: string
  }
}

const medicalHistory = [
  { date: "May 2026", event: "Annual Checkup", type: "checkup" },
  { date: "March 2026", event: "Blood Test - Normal", type: "test" },
  { date: "January 2026", event: "Flu Treatment", type: "treatment" },
  { date: "November 2025", event: "Dental Checkup", type: "checkup" },
  { date: "August 2025", event: "Eye Examination", type: "test" },
]

const upcomingAppointments = [
  { date: "May 25, 2026", time: "10:00 AM", doctor: "Dr. Sarah Mitchell", type: "Follow-up" },
  { date: "June 5, 2026", time: "2:30 PM", doctor: "Dr. James Chen", type: "Consultation" },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    dateOfBirth: "1990-05-15",
    address: "123 Health Street, Mumbai, Maharashtra 400001",
    emergencyContact: {
      name: "Jane Doe",
      phone: "+91 98765 43211",
      relation: "Spouse"
    }
  })
  const [healthInfo, setHealthInfo] = useState<HealthInfo>({
    bloodGroup: "O+",
    height: "175 cm",
    weight: "70 kg",
    allergies: ["Penicillin", "Peanuts"],
    chronicConditions: ["Mild Hypertension"],
    medications: ["Amlodipine 5mg"]
  })
  const [newAllergy, setNewAllergy] = useState("")
  const [newCondition, setNewCondition] = useState("")

  const handleSave = () => {
    setIsEditing(false)
  }

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setHealthInfo(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }))
      setNewAllergy("")
    }
  }

  const removeAllergy = (index: number) => {
    setHealthInfo(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }))
  }

  const addCondition = () => {
    if (newCondition.trim()) {
      setHealthInfo(prev => ({
        ...prev,
        chronicConditions: [...prev.chronicConditions, newCondition.trim()]
      }))
      setNewCondition("")
    }
  }

  const removeCondition = (index: number) => {
    setHealthInfo(prev => ({
      ...prev,
      chronicConditions: prev.chronicConditions.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-8 transition-colors duration-300">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal and health information</p>
          </div>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={isEditing ? "bg-green-500 hover:bg-green-600" : "bg-gradient-to-r from-pink-500 to-purple-500"}
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-foreground">
                <User className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                Personal Information
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  {isEditing ? (
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 border-border bg-muted/50 text-foreground"
                    />
                  ) : (
                    <p className="mt-1 text-foreground font-medium">{profile.name}</p>
                  )}
                </div>
                <div>
                  <Label className="text-muted-foreground">Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="mt-1 border-border bg-muted/50 text-foreground"
                    />
                  ) : (
                    <p className="mt-1 text-foreground font-medium">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                  )}
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground/80" />
                    {isEditing ? (
                      <Input
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="border-border bg-muted/50 text-foreground"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{profile.email}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground/80" />
                    {isEditing ? (
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="border-border bg-muted/50 text-foreground"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{profile.phone}</p>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground">Address</Label>
                  <div className="mt-1 flex items-start gap-2">
                    <MapPin className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/80" />
                    {isEditing ? (
                      <Input
                        value={profile.address}
                        onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                        className="border-border bg-muted/50 text-foreground"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{profile.address}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Health Metrics */}
            <div className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Activity className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                Health Metrics
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 p-4 text-center">
                  <Droplets className="mx-auto mb-2 h-6 w-6 text-red-500 dark:text-red-400" />
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  {isEditing ? (
                    <Input
                      value={healthInfo.bloodGroup}
                      onChange={(e) => setHealthInfo(prev => ({ ...prev, bloodGroup: e.target.value }))}
                      className="mt-1 border-border bg-muted/50 text-center text-foreground"
                    />
                  ) : (
                    <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">{healthInfo.bloodGroup}</p>
                  )}
                </div>
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 p-4 text-center">
                  <Activity className="mx-auto mb-2 h-6 w-6 text-blue-500 dark:text-blue-400" />
                  <p className="text-sm text-muted-foreground">Height</p>
                  {isEditing ? (
                    <Input
                      value={healthInfo.height}
                      onChange={(e) => setHealthInfo(prev => ({ ...prev, height: e.target.value }))}
                      className="mt-1 border-border bg-muted/50 text-center text-foreground"
                    />
                  ) : (
                    <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{healthInfo.height}</p>
                  )}
                </div>
                <div className="rounded-2xl border border-green-500/20 bg-green-500/5 dark:bg-green-500/10 p-4 text-center">
                  <Heart className="mx-auto mb-2 h-6 w-6 text-green-500 dark:text-green-400" />
                  <p className="text-sm text-muted-foreground">Weight</p>
                  {isEditing ? (
                    <Input
                      value={healthInfo.weight}
                      onChange={(e) => setHealthInfo(prev => ({ ...prev, weight: e.target.value }))}
                      className="mt-1 border-border bg-muted/50 text-center text-foreground"
                    />
                  ) : (
                    <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{healthInfo.weight}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Allergies */}
            <div className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                Allergies
              </h2>
              <div className="flex flex-wrap gap-2">
                {healthInfo.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 rounded-full bg-yellow-500/10 dark:bg-yellow-500/20 border border-yellow-500/20 px-4 py-2 text-sm font-medium text-yellow-700 dark:text-yellow-400"
                  >
                    {allergy}
                    {isEditing && (
                      <button onClick={() => removeAllergy(index)} className="hover:text-foreground">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </span>
                ))}
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <Input
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      placeholder="Add allergy"
                      className="h-9 w-32 border-border bg-muted/50 text-foreground"
                      onKeyPress={(e) => e.key === "Enter" && addAllergy()}
                    />
                    <Button size="sm" onClick={addAllergy} className="h-9">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Chronic Conditions */}
            <div className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Heart className="h-5 w-5 text-red-500 dark:text-red-400" />
                Chronic Conditions
              </h2>
              <div className="flex flex-wrap gap-2">
                {healthInfo.chronicConditions.map((condition, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 rounded-full bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400"
                  >
                    {condition}
                    {isEditing && (
                      <button onClick={() => removeCondition(index)} className="hover:text-foreground">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </span>
                ))}
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <Input
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      placeholder="Add condition"
                      className="h-9 w-40 border-border bg-muted/50 text-foreground"
                      onKeyPress={(e) => e.key === "Enter" && addCondition()}
                    />
                    <Button size="sm" onClick={addCondition} className="h-9">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Emergency Contact */}
            <div className="rounded-3xl border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-red-600 dark:text-red-400">
                <Phone className="h-5 w-5" />
                Emergency Contact
              </h2>
              <div className="space-y-3 font-medium">
                <div>
                  <p className="text-sm text-muted-foreground font-normal">Name</p>
                  <p className="text-foreground">{profile.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-normal">Phone</p>
                  <p className="text-foreground">{profile.emergencyContact.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-normal">Relation</p>
                  <p className="text-foreground">{profile.emergencyContact.relation}</p>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Calendar className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                Upcoming Appointments
              </h2>
              <div className="space-y-3">
                {upcomingAppointments.map((apt, index) => (
                  <div key={index} className="rounded-xl border border-border bg-muted/50 p-3">
                    <p className="font-medium text-foreground">{apt.doctor}</p>
                    <p className="text-sm text-pink-600 dark:text-pink-400 font-medium">{apt.type}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {apt.date} at {apt.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical History */}
            <div className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <FileText className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                Medical History
              </h2>
              <div className="relative space-y-4">
                {/* Timeline line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />
                
                {medicalHistory.map((event, index) => (
                  <div key={index} className="relative flex gap-4 pl-6">
                    <div className={`absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full ${
                      event.type === "treatment" ? "bg-pink-500" :
                      event.type === "test" ? "bg-blue-500" :
                      "bg-green-500"
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{event.event}</p>
                      <p className="text-xs text-muted-foreground/80">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
