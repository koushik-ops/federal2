"use client"

import { useState } from "react"
import { 
  User, 
  Stethoscope, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Calendar, 
  Clock, 
  Edit2, 
  Save, 
  X, 
  Plus, 
  Activity, 
  Building2, 
  Briefcase, 
  CheckCircle,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/lib/user-context"

interface DoctorProfile {
  name: string
  email: string
  phone: string
  specialty: string
  license: string
  affiliation: string
  bio: string
}

const recentActivity = [
  { date: "May 2026", event: "Approved Patient Diagnostic Plan", type: "case" },
  { date: "May 2026", event: "Completed video consult with Patient John Doe", type: "consult" },
  { date: "April 2026", event: "Participated in Federated Learning Node update", type: "system" },
  { date: "April 2026", event: "Published paper on AI SHAP Explainability in Diagnostics", type: "publication" },
]

export default function DoctorProfilePage() {
  const { user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<DoctorProfile>({
    name: user?.name || "Dr. Sarah Mitchell",
    email: user?.email || "sarah.mitchell@pulsekin.com",
    phone: "+91 98765 43220",
    specialty: "Cardiologist",
    license: "MCI-87492-IN",
    affiliation: "PulseKin General Hospital, Mumbai",
    bio: "Specialist in cardiovascular diseases, echocardiography, and preventive cardiology. Passionate about leveraging privacy-preserving AI and federated learning to improve patient diagnosis, drug screening and clinical trials."
  })

  const [metrics] = useState({
    experience: "12 years",
    casesSolved: "420",
    consultations: "1,280"
  })

  const [specializations, setSpecializations] = useState<string[]>([
    "Echocardiography",
    "Heart Failure Management",
    "Interventional Cardiology",
    "Preventive Care"
  ])

  const [certifications, setCertifications] = useState<string[]>([
    "Board Certified in Cardiovascular Disease",
    "Fellow of the American College of Cardiology (FACC)",
    "Senior Clinical AI Diagnostics Certification"
  ])

  const [newSpec, setNewSpec] = useState("")
  const [newCert, setNewCert] = useState("")

  const handleSave = () => {
    setIsEditing(false)
  }

  const addSpec = () => {
    if (newSpec.trim()) {
      setSpecializations(prev => [...prev, newSpec.trim()])
      setNewSpec("")
    }
  }

  const removeSpec = (index: number) => {
    setSpecializations(prev => prev.filter((_, i) => i !== index))
  }

  const addCert = () => {
    if (newCert.trim()) {
      setCertifications(prev => [...prev, newCert.trim()])
      setNewCert("")
    }
  }

  const removeCert = (index: number) => {
    setCertifications(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-8 transition-colors duration-300">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Doctor Profile</h1>
            <p className="text-muted-foreground">Manage your credentials, professional metrics and settings</p>
          </div>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={isEditing ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"}
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
            {/* Personal & Professional Info */}
            <div className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-foreground">
                <User className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                Professional Information
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
                  <Label className="text-muted-foreground">Specialty / Title</Label>
                  {isEditing ? (
                    <Input
                      value={profile.specialty}
                      onChange={(e) => setProfile(prev => ({ ...prev, specialty: e.target.value }))}
                      className="mt-1 border-border bg-muted/50 text-foreground"
                    />
                  ) : (
                    <p className="mt-1 text-foreground font-medium">{profile.specialty}</p>
                  )}
                </div>
                <div>
                  <Label className="text-muted-foreground">License Number</Label>
                  {isEditing ? (
                    <Input
                      value={profile.license}
                      onChange={(e) => setProfile(prev => ({ ...prev, license: e.target.value }))}
                      className="mt-1 border-border bg-muted/50 text-foreground"
                    />
                  ) : (
                    <p className="mt-1 text-foreground font-medium">{profile.license}</p>
                  )}
                </div>
                <div>
                  <Label className="text-muted-foreground">Affiliation</Label>
                  {isEditing ? (
                    <Input
                      value={profile.affiliation}
                      onChange={(e) => setProfile(prev => ({ ...prev, affiliation: e.target.value }))}
                      className="mt-1 border-border bg-muted/50 text-foreground"
                    />
                  ) : (
                    <p className="mt-1 text-foreground font-medium">{profile.affiliation}</p>
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
                  <Label className="text-muted-foreground">Biography</Label>
                  {isEditing ? (
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="mt-1 w-full rounded-md border border-border bg-muted/50 p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-foreground font-medium leading-relaxed">{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Metrics */}
            <div className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Activity className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                Practice Metrics
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 dark:bg-purple-500/10 p-4 text-center">
                  <Briefcase className="mx-auto mb-2 h-6 w-6 text-purple-500 dark:text-purple-400" />
                  <p className="text-sm text-muted-foreground">Clinical Experience</p>
                  <p className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">{metrics.experience}</p>
                </div>
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 p-4 text-center">
                  <CheckCircle className="mx-auto mb-2 h-6 w-6 text-blue-500 dark:text-blue-400" />
                  <p className="text-sm text-muted-foreground">Cases Resolved</p>
                  <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{metrics.casesSolved}</p>
                </div>
                <div className="rounded-2xl border border-green-500/20 bg-green-500/5 dark:bg-green-500/10 p-4 text-center">
                  <Activity className="mx-auto mb-2 h-6 w-6 text-green-500 dark:text-green-400" />
                  <p className="text-sm text-muted-foreground">Consultations</p>
                  <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{metrics.consultations}</p>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Stethoscope className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                Focus & Specializations
              </h2>
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 rounded-full bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-400"
                  >
                    {spec}
                    {isEditing && (
                      <button onClick={() => removeSpec(index)} className="hover:text-foreground">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </span>
                ))}
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <Input
                      value={newSpec}
                      onChange={(e) => setNewSpec(e.target.value)}
                      placeholder="Add specialty"
                      className="h-9 w-32 border-border bg-muted/50 text-foreground"
                      onKeyPress={(e) => e.key === "Enter" && addSpec()}
                    />
                    <Button size="sm" onClick={addSpec} className="h-9">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Board Certifications */}
            <div className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Award className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                Certifications & Achievements
              </h2>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-amber-500 shrink-0" />
                      <span className="text-sm font-medium text-foreground">{cert}</span>
                    </div>
                    {isEditing && (
                      <button onClick={() => removeCert(index)} className="text-muted-foreground hover:text-red-500 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <div className="flex items-center gap-2 mt-4">
                    <Input
                      value={newCert}
                      onChange={(e) => setNewCert(e.target.value)}
                      placeholder="Add certification details..."
                      className="h-10 flex-1 border-border bg-muted/50 text-foreground"
                      onKeyPress={(e) => e.key === "Enter" && addCert()}
                    />
                    <Button onClick={addCert} className="h-10 bg-purple-600 hover:bg-purple-700 text-white">
                      <Plus className="h-4 w-4 mr-2" /> Add
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hospital Node/Status */}
            <div className="rounded-3xl border border-purple-500/20 bg-purple-500/5 dark:bg-purple-500/10 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-purple-600 dark:text-purple-400">
                <Building2 className="h-5 w-5" />
                Federated Node Health
              </h2>
              <div className="space-y-3 font-medium text-sm">
                <div>
                  <p className="text-xs text-muted-foreground font-normal">Node ID</p>
                  <p className="text-foreground">IND-MUM-NODE-41</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-normal">Role</p>
                  <p className="text-foreground">Clinical Validation Authority</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-normal">Status</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-600 dark:text-green-400">Active & Syncing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Logs */}
            <div className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <FileText className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                Recent Activity
              </h2>
              <div className="relative space-y-4">
                {/* Timeline line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />
                
                {recentActivity.map((event, index) => (
                  <div key={index} className="relative flex gap-4 pl-6">
                    <div className={`absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full ${
                      event.type === "case" ? "bg-purple-500" :
                      event.type === "consult" ? "bg-blue-500" :
                      event.type === "publication" ? "bg-amber-500" :
                      "bg-green-500"
                    }`} />
                    <div>
                      <p className="text-xs font-medium text-foreground">{event.event}</p>
                      <p className="text-[10px] text-muted-foreground/80 mt-0.5">{event.date}</p>
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
