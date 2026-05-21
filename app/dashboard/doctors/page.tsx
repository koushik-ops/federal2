"use client"

import { useState } from "react"
import { 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  Calendar,
  Filter,
  Search,
  Video,
  MessageSquare,
  IndianRupee,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Doctor {
  id: number
  name: string
  specialty: string
  experience: string
  rating: number
  reviews: number
  location: string
  distance: string
  available: boolean
  nextSlot: string
  consultationFee: number
  image: string
  languages: string[]
}

export default function DoctorsNearbyPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [specialty, setSpecialty] = useState("all")
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      specialty: "General Physician",
      experience: "12 years",
      rating: 4.8,
      reviews: 234,
      location: "Apollo Clinic, Koramangala",
      distance: "2.3 km",
      available: true,
      nextSlot: "Today, 4:30 PM",
      consultationFee: 150,
      image: "",
      languages: ["English", "Hindi", "Kannada"],
    },
    {
      id: 2,
      name: "Dr. Rajesh Kumar",
      specialty: "Cardiologist",
      experience: "18 years",
      rating: 4.9,
      reviews: 412,
      location: "Fortis Hospital, Bannerghatta",
      distance: "4.5 km",
      available: true,
      nextSlot: "Tomorrow, 10:00 AM",
      consultationFee: 150,
      image: "",
      languages: ["English", "Hindi", "Telugu"],
    },
    {
      id: 3,
      name: "Dr. Anita Patel",
      specialty: "Dermatologist",
      experience: "8 years",
      rating: 4.7,
      reviews: 189,
      location: "Skin Care Center, Indiranagar",
      distance: "3.1 km",
      available: false,
      nextSlot: "May 22, 11:30 AM",
      consultationFee: 150,
      image: "",
      languages: ["English", "Hindi", "Gujarati"],
    },
    {
      id: 4,
      name: "Dr. Suresh Reddy",
      specialty: "Orthopedic",
      experience: "15 years",
      rating: 4.6,
      reviews: 298,
      location: "Manipal Hospital, Whitefield",
      distance: "8.2 km",
      available: true,
      nextSlot: "Today, 6:00 PM",
      consultationFee: 150,
      image: "",
      languages: ["English", "Telugu", "Kannada"],
    },
    {
      id: 5,
      name: "Dr. Meera Nair",
      specialty: "Neurologist",
      experience: "20 years",
      rating: 4.9,
      reviews: 521,
      location: "NIMHANS, Hosur Road",
      distance: "5.7 km",
      available: true,
      nextSlot: "Tomorrow, 2:00 PM",
      consultationFee: 150,
      image: "",
      languages: ["English", "Hindi", "Malayalam"],
    },
    {
      id: 6,
      name: "Dr. Vikram Singh",
      specialty: "Hematologist",
      experience: "14 years",
      rating: 4.8,
      reviews: 167,
      location: "Narayana Health, HSR Layout",
      distance: "3.8 km",
      available: true,
      nextSlot: "Today, 5:30 PM",
      consultationFee: 150,
      image: "",
      languages: ["English", "Hindi", "Punjabi"],
    },
  ]

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecialty = 
      specialty === "all" || 
      doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
    return matchesSearch && matchesSpecialty
  })

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Doctors Nearby
        </h1>
        <p className="text-muted-foreground mt-1">
          Find and book appointments with healthcare specialists
        </p>
      </div>

      {/* Pricing Info */}
      <Card className="glass-card border-primary/30">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg gradient-button">
              <IndianRupee className="h-6 w-6 text-black" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Consultation Pricing</h3>
              <p className="text-sm text-muted-foreground">
                <span className="text-secondary font-semibold">Rs 150</span> for first 10 minutes, then{" "}
                <span className="text-secondary font-semibold">Rs 10</span> per minute
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="glass-card border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors or specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-0"
              />
            </div>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="w-full md:w-[200px] bg-input border-0">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                <SelectItem value="general">General Physician</SelectItem>
                <SelectItem value="cardio">Cardiologist</SelectItem>
                <SelectItem value="derma">Dermatologist</SelectItem>
                <SelectItem value="ortho">Orthopedic</SelectItem>
                <SelectItem value="neuro">Neurologist</SelectItem>
                <SelectItem value="hemato">Hematologist</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Doctors List */}
      <div className="grid gap-4">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="glass-card border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Doctor Info */}
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-16 w-16 border-2 border-primary/30">
                    <AvatarImage src={doctor.image} />
                    <AvatarFallback className="bg-primary/20 text-primary text-lg font-semibold">
                      {doctor.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          {doctor.name}
                        </h3>
                        <p className="text-sm text-primary">{doctor.specialty}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {doctor.experience} experience
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-lg">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-yellow-400">
                          {doctor.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({doctor.reviews})
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {doctor.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {doctor.distance} away
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {doctor.languages.map((lang) => (
                        <Badge 
                          key={lang} 
                          variant="secondary" 
                          className="text-xs bg-muted/50"
                        >
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Booking Section */}
                <div className="flex flex-col gap-3 md:items-end md:min-w-[200px]">
                  <div className="text-right">
                    {doctor.available ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Next Available</Badge>
                    )}
                    <p className="text-sm mt-1">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {doctor.nextSlot}
                    </p>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full md:w-auto gradient-button text-black font-semibold"
                        onClick={() => setSelectedDoctor(doctor)}
                      >
                        Book Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass border-border/50">
                      <DialogHeader>
                        <DialogTitle>Book Appointment</DialogTitle>
                        <DialogDescription>
                          Choose your preferred consultation type with {doctor.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors">
                          <div className="p-3 rounded-lg bg-primary/20">
                            <Video className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">Video Consultation</h4>
                            <p className="text-sm text-muted-foreground">
                              Consult via video call from home
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors">
                          <div className="p-3 rounded-lg bg-secondary/20">
                            <MapPin className="h-5 w-5 text-secondary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">In-Person Visit</h4>
                            <p className="text-sm text-muted-foreground">
                              Visit the clinic for consultation
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors">
                          <div className="p-3 rounded-lg bg-green-500/20">
                            <MessageSquare className="h-5 w-5 text-green-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">Chat Consultation</h4>
                            <p className="text-sm text-muted-foreground">
                              Text-based consultation
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="pt-4 border-t border-border">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Consultation Fee</span>
                            <span className="font-semibold text-foreground">
                              Rs {doctor.consultationFee} for first 10 min
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            + Rs 10 per minute after
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" size="sm" className="w-full md:w-auto border-border">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Clinic
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <Card className="glass-card border-border/50">
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No doctors found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
