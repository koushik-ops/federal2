"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit2,
  Shield,
  Bell,
  Moon,
  Sun,
  LogOut,
  ChevronRight,
  FileText,
  Activity,
  Heart,
  Droplet,
  Scale,
  Ruler,
  Clock,
  Settings,
  HelpCircle,
  Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)

  const userProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    location: "Bangalore, Karnataka",
    dateOfBirth: "January 15, 1990",
    bloodGroup: "O+",
    height: "175 cm",
    weight: "72 kg",
    allergies: ["Penicillin", "Peanuts"],
    chronicConditions: ["Mild Hypertension"],
    memberSince: "March 2024",
  }

  const medicalHistory = [
    { date: "May 15, 2026", event: "Blood Test - CBC", result: "Mild Anemia detected" },
    { date: "April 28, 2026", event: "General Checkup", result: "Normal" },
    { date: "March 10, 2026", event: "Chest X-Ray", result: "No abnormalities" },
    { date: "February 5, 2026", event: "Blood Pressure Check", result: "Slightly elevated" },
  ]

  const upcomingAppointments = [
    { doctor: "Dr. Priya Sharma", specialty: "General Physician", date: "May 22, 2026", time: "4:30 PM" },
    { doctor: "Dr. Rajesh Kumar", specialty: "Cardiologist", date: "June 1, 2026", time: "10:00 AM" },
  ]

  const stats = [
    { label: "Reports Uploaded", value: 12, icon: FileText },
    { label: "AI Analyses", value: 8, icon: Activity },
    { label: "Consultations", value: 5, icon: User },
  ]

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            My Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and health information
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="glass-card border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary/30">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                  JD
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-foreground">{userProfile.name}</h2>
              <p className="text-muted-foreground">{userProfile.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {userProfile.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {userProfile.location}
                </span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <Droplet className="mr-1 h-3 w-3" />
                  {userProfile.bloodGroup}
                </Badge>
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  Member since {userProfile.memberSince}
                </Badge>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-border">
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="glass border-border/50">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Update your personal information
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={userProfile.name} className="bg-input border-0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue={userProfile.phone} className="bg-input border-0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue={userProfile.location} className="bg-input border-0" />
                  </div>
                  <Button className="w-full gradient-button text-black font-semibold">
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass-card border-border/50">
            <CardContent className="pt-6 text-center">
              <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="health" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 w-full md:w-auto">
          <TabsTrigger value="health">Health Info</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Health Info Tab */}
        <TabsContent value="health" className="space-y-4">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Health Information
              </CardTitle>
              <CardDescription>Your basic health metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Calendar className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium text-foreground">{userProfile.dateOfBirth}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <Droplet className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Group</p>
                    <p className="font-medium text-foreground">{userProfile.bloodGroup}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <Ruler className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Height</p>
                    <p className="font-medium text-foreground">{userProfile.height}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                  <div className="p-2 rounded-lg bg-yellow-500/20">
                    <Scale className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium text-foreground">{userProfile.weight}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Known Allergies</h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.allergies.map((allergy) => (
                      <Badge key={allergy} variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Chronic Conditions</h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.chronicConditions.map((condition) => (
                      <Badge key={condition} className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Medical History
              </CardTitle>
              <CardDescription>Your past medical events and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicalHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/30"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">{item.event}</p>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                        <Badge variant="secondary">{item.result}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 border-border" asChild>
                <Link href="/dashboard/reports">
                  View All Reports
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Your scheduled consultations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-primary/30">
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {appointment.doctor.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{appointment.doctor}</p>
                        <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{appointment.date}</p>
                      <p className="text-sm text-secondary">{appointment.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 gradient-button text-black font-semibold" asChild>
                <Link href="/dashboard/doctors">
                  Book New Appointment
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                App Settings
              </CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-yellow-400" />}
                  <div>
                    <p className="font-medium text-foreground">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Use dark theme</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive health reminders</p>
                  </div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <Separator />

              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Lock className="mr-3 h-5 w-5" />
                  Change Password
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Shield className="mr-3 h-5 w-5" />
                  Privacy Settings
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <HelpCircle className="mr-3 h-5 w-5" />
                  Help & Support
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
              </div>

              <Separator />

              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" asChild>
                <Link href="/">
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
