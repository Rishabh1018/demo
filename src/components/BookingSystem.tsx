import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import {
  User,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  CheckCircle2,
} from "lucide-react";
import { api, DEMO_USER_ID } from "../utils/api";

interface Counselor {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  avatar: string;
  rating: number;
  availability: string[];
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export function BookingSystem() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedCounselor, setSelectedCounselor] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [sessionType, setSessionType] = useState<string>("");
  const [concerns, setConcerns] = useState<string>("");
  const [mode, setMode] = useState<string>("");
  const [isBooked, setIsBooked] = useState(false);
  const [counselorRatings, setCounselorRatings] = useState<{
    [key: string]: { rating: number; reviewCount: number };
  }>({});

  // ✅ Helper to format date in Indian style
  const formatDateIndian = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const counselors: Counselor[] = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      title: "Licensed Clinical Psychologist",
      specialties: ["Anxiety", "Depression", "Academic Stress"],
      avatar: "👩‍⚕️",
      rating: 4.9,
      availability: ["Mon", "Wed", "Fri"],
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      title: "Counseling Psychologist",
      specialties: ["Relationship Issues", "Social Anxiety", "Self-Esteem"],
      avatar: "👨‍⚕️",
      rating: 4.8,
      availability: ["Tue", "Thu", "Sat"],
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      title: "Clinical Social Worker",
      specialties: ["Trauma", "PTSD", "Crisis Intervention"],
      avatar: "👩‍⚕️",
      rating: 4.9,
      availability: ["Mon", "Wed", "Fri"],
    },
    {
      id: "4",
      name: "Dr. David Kim",
      title: "Marriage & Family Therapist",
      specialties: ["Family Issues", "Cultural Identity", "Life Transitions"],
      avatar: "👨‍⚕️",
      rating: 4.7,
      availability: ["Tue", "Thu", "Sat"],
    },
  ];

  const timeSlots: TimeSlot[] = [
    { time: "9:00 AM", available: true },
    { time: "10:00 AM", available: false },
    { time: "11:00 AM", available: true },
    { time: "1:00 PM", available: true },
    { time: "2:00 PM", available: true },
    { time: "3:00 PM", available: false },
    { time: "4:00 PM", available: true },
    { time: "5:00 PM", available: true },
  ];

  const sessionTypes = [
    { value: "individual", label: "Individual Therapy (50 min)" },
    { value: "group", label: "Group Therapy (90 min)" },
    { value: "crisis", label: "Crisis Intervention (30 min)" },
    { value: "consultation", label: "Initial Consultation (30 min)" },
  ];

  useEffect(() => {
    const fetchCounselorRatings = async () => {
      const ratings: {
        [key: string]: { rating: number; reviewCount: number };
      } = {};

      for (const counselor of counselors) {
        try {
          const result = await api.getCounselorRating(counselor.id);
          ratings[counselor.id] = {
            rating: result.rating || counselor.rating,
            reviewCount: result.reviewCount || 0,
          };
        } catch (error) {
          console.error(`Failed to fetch rating for ${counselor.name}:`, error);
          ratings[counselor.id] = {
            rating: counselor.rating,
            reviewCount: 0,
          };
        }
      }

      setCounselorRatings(ratings);
    };

    fetchCounselorRatings();
  }, []);

  const handleBooking = async () => {
    if (
      selectedDate &&
      selectedCounselor &&
      selectedTime &&
      sessionType &&
      mode
    ) {
      try {
        const selectedCounselorData = counselors.find(
          (c) => c.id === selectedCounselor
        );
        const selectedSessionType = sessionTypes.find(
          (t) => t.value === sessionType
        );

        const bookingData = {
          userId: DEMO_USER_ID,
          counselorId: selectedCounselor,
          counselorName: selectedCounselorData?.name,
          date: selectedDate.toISOString(),
          time: selectedTime,
          sessionType: sessionType,
          sessionTypeLabel: selectedSessionType?.label,
          concerns: concerns,
          mode: mode,
          status: "confirmed",
        };

        await api.createBooking(bookingData);
        setIsBooked(true);
      } catch (error) {
        console.error("Failed to create booking:", error);
        setIsBooked(true);
      }
    }
  };

  if (isBooked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600 mb-6">
              Your session has been scheduled. You'll receive a confirmation
              email shortly.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
              <p>
                <strong>Date:</strong>{" "}
                {selectedDate ? formatDateIndian(selectedDate) : ""}
              </p>
              <p>
                <strong>Time:</strong> {selectedTime}
              </p>
              <p>
                <strong>Counselor:</strong>{" "}
                {counselors.find((c) => c.id === selectedCounselor)?.name}
              </p>
              <p>
                <strong>Session Type:</strong>{" "}
                {sessionTypes.find((t) => t.value === sessionType)?.label}
              </p>
              <p>
                <strong>Mode:</strong> {mode}
              </p>
            </div>
            <Button onClick={() => setIsBooked(false)} className="w-full">
              Book Another Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book a Counseling Session
          </h1>
          <p className="text-gray-600">
            Schedule a confidential session with our professional counselors
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Counselor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {counselors.map((counselor) => (
                  <div
                    key={counselor.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedCounselor === counselor.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedCounselor(counselor.id)}>
                    <div className="flex items-start space-x-3">
                      <div className="text-3xl">{counselor.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{counselor.name}</h3>
                          <Badge variant="outline">★ {counselor.rating}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {counselor.title}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {counselor.specialties.map((specialty) => (
                            <Badge
                              key={specialty}
                              variant="secondary"
                              className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="session-type">Session Type</Label>
                  <Select value={sessionType} onValueChange={setSessionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mode">Mode</Label>
                  <Select value={mode} onValueChange={setMode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="concerns">Main Concerns (Optional)</Label>
                  <Textarea
                    id="concerns"
                    placeholder="Briefly describe what you'd like to discuss..."
                    value={concerns}
                    onChange={(e) => setConcerns(e.target.value)}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    This information helps your counselor prepare for the
                    session.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Select Date</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) =>
                    date < new Date() || date < new Date("1900-01-01")
                  }
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Available Times</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={
                        selectedTime === slot.time ? "default" : "outline"
                      }
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className="justify-center">
                      {slot.time}
                    </Button>
                  ))}
                </div>
                {selectedDate && (
                  <p className="text-sm text-gray-600 mt-4">
                    Showing availability for {formatDateIndian(selectedDate)}
                  </p>
                )}
              </CardContent>
            </Card>

            {selectedCounselor &&
              selectedDate &&
              selectedTime &&
              sessionType &&
              mode && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800">
                      Booking Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Counselor:</span>
                      <span className="font-medium">
                        {
                          counselors.find((c) => c.id === selectedCounselor)
                            ?.name
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">
                        {formatDateIndian(selectedDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Session:</span>
                      <span className="font-medium">
                        {
                          sessionTypes.find((t) => t.value === sessionType)
                            ?.label
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mode:</span>
                      <span className="font-medium">{mode}</span>
                    </div>
                    <Button onClick={handleBooking} className="w-full mt-4">
                      Confirm Booking
                    </Button>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>

        <Alert className="mt-8">
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            <strong>Location:</strong> All sessions are held at the Campus
            Counseling Center (Building A, Room 201). For your first visit,
            please arrive 10 minutes early to complete intake forms.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
