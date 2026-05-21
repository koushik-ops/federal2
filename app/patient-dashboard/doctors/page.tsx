"use client"

import { useState, useEffect } from "react"
import { 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  Video, 
  MessageSquare,
  Filter,
  Search,
  Navigation,
  Heart,
  ChevronRight,
  Calendar,
  IndianRupee,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Mitchell",
    specialty: "Endocrinologist",
    hospital: "City Medical Center",
    distance: "1.2 km",
    rating: 4.8,
    reviews: 234,
    available: true,
    nextSlot: "Today, 4:30 PM",
    experience: "15 years",
    languages: ["English", "Hindi"],
    image: null,
    consultationFee: 150
  },
  {
    id: 2,
    name: "Dr. James Chen",
    specialty: "Cardiologist",
    hospital: "Heart Care Institute",
    distance: "2.5 km",
    rating: 4.9,
    reviews: 412,
    available: true,
    nextSlot: "Today, 5:00 PM",
    experience: "20 years",
    languages: ["English"],
    image: null,
    consultationFee: 150
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    specialty: "General Physician",
    hospital: "Community Health Clinic",
    distance: "0.8 km",
    rating: 4.7,
    reviews: 189,
    available: false,
    nextSlot: "Tomorrow, 10:00 AM",
    experience: "10 years",
    languages: ["English", "Hindi", "Tamil"],
    image: null,
    consultationFee: 150
  },
  {
    id: 4,
    name: "Dr. Michael Brown",
    specialty: "Neurologist",
    hospital: "Brain & Spine Center",
    distance: "3.1 km",
    rating: 4.6,
    reviews: 156,
    available: true,
    nextSlot: "Today, 6:00 PM",
    experience: "12 years",
    languages: ["English"],
    image: null,
    consultationFee: 150
  },
  {
    id: 5,
    name: "Dr. Aisha Khan",
    specialty: "Dermatologist",
    hospital: "Skin Care Clinic",
    distance: "1.8 km",
    rating: 4.9,
    reviews: 298,
    available: true,
    nextSlot: "Today, 3:30 PM",
    experience: "8 years",
    languages: ["English", "Hindi", "Urdu"],
    image: null,
    consultationFee: 150
  },
  {
    id: 6,
    name: "Dr. Robert Wilson",
    specialty: "Orthopedic Surgeon",
    hospital: "Bone & Joint Hospital",
    distance: "4.2 km",
    rating: 4.8,
    reviews: 321,
    available: false,
    nextSlot: "Tomorrow, 11:00 AM",
    experience: "18 years",
    languages: ["English"],
    image: null,
    consultationFee: 150
  }
]

const specialties = ["All", "Cardiologist", "Endocrinologist", "General Physician", "Neurologist", "Dermatologist", "Orthopedic Surgeon"]

export default function DoctorsNearbyPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All")
  const [locationGranted, setLocationGranted] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [selectedConsultationType, setSelectedConsultationType] = useState<"video" | "in-person" | "chat" | null>(null)

  useEffect(() => {
    // Request location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationGranted(true),
        () => setLocationGranted(false)
      )
    }
  }, [])

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecialty = selectedSpecialty === "All" || doctor.specialty === selectedSpecialty
    return matchesSearch && matchesSpecialty
  })

  const handleBookAppointment = (doctor: typeof doctors[0]) => {
    setSelectedDoctor(doctor)
    setBookingDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-8">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-white">Nearby Doctors</h1>
          <p className="text-gray-400">Find and book appointments with healthcare specialists near you</p>
        </div>

        {/* Location Status */}
        {!locationGranted && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4">
            <div className="flex items-center gap-3">
              <Navigation className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-400">Enable location to find doctors near you</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
              onClick={() => {
                navigator.geolocation.getCurrentPosition(
                  () => setLocationGranted(true),
                  () => alert("Please enable location access in your browser settings")
                )
              }}
            >
              Enable Location
            </Button>
          </div>
        )}

        {/* Pricing Info */}
        <div className="mb-6 rounded-2xl border border-pink-500/30 bg-pink-500/10 p-4">
          <div className="flex items-center gap-3">
            <IndianRupee className="h-5 w-5 text-pink-400" />
            <span className="text-pink-400">
              Consultation: <span className="font-semibold">Rs 150 for first 10 minutes</span>, then Rs 10/minute
            </span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search doctors, specialties, hospitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-xl border-white/10 bg-white/5 pl-12 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  selectedSpecialty === specialty
                    ? "bg-pink-500 text-white"
                    : "border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all hover:border-pink-500/30 hover:bg-white/5"
            >
              {/* Doctor Info */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20">
                    <span className="text-2xl font-bold text-pink-400">
                      {doctor.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{doctor.name}</h3>
                    <p className="text-sm text-pink-400">{doctor.specialty}</p>
                    <p className="text-xs text-gray-500">{doctor.hospital}</p>
                  </div>
                </div>
                <button className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-pink-400">
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              {/* Stats */}
              <div className="mb-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 rounded-lg bg-yellow-500/20 px-3 py-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-yellow-400">{doctor.rating}</span>
                  <span className="text-yellow-400/60">({doctor.reviews})</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  {doctor.distance}
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Clock className="h-4 w-4" />
                  {doctor.experience}
                </div>
              </div>

              {/* Availability */}
              <div className={`mb-4 flex items-center gap-2 rounded-xl p-3 ${
                doctor.available ? "bg-green-500/10" : "bg-gray-500/10"
              }`}>
                <div className={`h-2 w-2 rounded-full ${doctor.available ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
                <span className={`text-sm ${doctor.available ? "text-green-400" : "text-gray-400"}`}>
                  {doctor.available ? "Available Now" : "Next Available"}
                </span>
                <span className={`ml-auto text-sm font-medium ${doctor.available ? "text-green-400" : "text-gray-400"}`}>
                  {doctor.nextSlot}
                </span>
              </div>

              {/* Languages */}
              <div className="mb-4 flex flex-wrap gap-2">
                {doctor.languages.map((lang) => (
                  <span key={lang} className="rounded-lg bg-white/5 px-2 py-1 text-xs text-gray-400">
                    {lang}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                >
                  <Video className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={() => handleBookAppointment(doctor)}
                className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-12 text-center backdrop-blur-xl">
            <p className="text-gray-400">No doctors found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="border-white/10 bg-black/95 text-white backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          
          {selectedDoctor && (
            <div className="space-y-6">
              {/* Doctor Preview */}
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20">
                  <span className="text-lg font-bold text-pink-400">
                    {selectedDoctor.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-white">{selectedDoctor.name}</p>
                  <p className="text-sm text-pink-400">{selectedDoctor.specialty}</p>
                </div>
              </div>

              {/* Consultation Type */}
              <div>
                <p className="mb-3 text-sm text-gray-400">Select consultation type</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setSelectedConsultationType("video")}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                      selectedConsultationType === "video"
                        ? "border-pink-500 bg-pink-500/20"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <Video className="h-6 w-6 text-pink-400" />
                    <span className="text-sm text-white">Video Call</span>
                  </button>
                  <button
                    onClick={() => setSelectedConsultationType("in-person")}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                      selectedConsultationType === "in-person"
                        ? "border-pink-500 bg-pink-500/20"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <MapPin className="h-6 w-6 text-purple-400" />
                    <span className="text-sm text-white">In-Person</span>
                  </button>
                  <button
                    onClick={() => setSelectedConsultationType("chat")}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                      selectedConsultationType === "chat"
                        ? "border-pink-500 bg-pink-500/20"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <MessageSquare className="h-6 w-6 text-orange-400" />
                    <span className="text-sm text-white">Chat</span>
                  </button>
                </div>
              </div>

              {/* Pricing */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Consultation Fee</span>
                  <span className="text-lg font-semibold text-white">Rs {selectedDoctor.consultationFee}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">First 10 minutes, then Rs 10/minute after</p>
              </div>

              {/* Confirm Button */}
              <Button
                onClick={() => {
                  setBookingDialogOpen(false)
                  alert("Appointment booked successfully!")
                }}
                disabled={!selectedConsultationType}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
              >
                Confirm Booking
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
