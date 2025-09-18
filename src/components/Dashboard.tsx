import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Heart, MessageCircle, Calendar, BookOpen, Users, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'
import { api, DEMO_USER_ID } from '../utils/api'

interface DashboardProps {
  onPageChange: (page: string) => void
}

export function Dashboard({ onPageChange }: DashboardProps) {
  const [wellnessScore, setWellnessScore] = useState(75)
  const [userBookings, setUserBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch wellness data
        const wellnessData = await api.getWellnessData(DEMO_USER_ID)
        if (wellnessData.wellnessScore) {
          setWellnessScore(wellnessData.wellnessScore)
        }

        // Fetch user bookings
        const bookingsData = await api.getUserBookings(DEMO_USER_ID)
        if (bookingsData.bookings) {
          setUserBookings(bookingsData.bookings.slice(0, 2)) // Show latest 2
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])
  const upcomingAppointments = [
    { id: 1, date: 'Today, 2:00 PM', counselor: 'Dr. Sarah Johnson', type: 'Individual Session' },
    { id: 2, date: 'Tomorrow, 10:00 AM', counselor: 'Dr. Michael Chen', type: 'Group Therapy' }
  ]

  const recentActivities = [
    { id: 1, action: 'Completed mindfulness exercise', time: '2 hours ago', icon: CheckCircle2 },
    { id: 2, action: 'Participated in peer discussion', time: '1 day ago', icon: Users },
    { id: 3, action: 'Used AI crisis support', time: '3 days ago', icon: MessageCircle }
  ]

  const quickActions = [
    { id: 'chat', title: 'Need Immediate Support?', description: 'Chat with Sukoon, our AI assistant 24/7', icon: MessageCircle, color: 'bg-blue-500' },
    { id: 'booking', title: 'Book a Session', description: 'Schedule with a counselor', icon: Calendar, color: 'bg-green-500' },
    { id: 'resources', title: 'Explore Resources', description: 'Videos, guides & exercises', icon: BookOpen, color: 'bg-purple-500' },
    { id: 'community', title: 'Join Community', description: 'Connect with peers safely', icon: Users, color: 'bg-orange-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Nirvaan</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Set your mind free. Your safe space for mental wellness support. We're here to help you through your college journey.
          </p>
        </div>

        {/* Wellness Overview */}
        <Card className="bg-gradient-to-r from-green-400 to-blue-500 text-white cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onPageChange('wellness')}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6" />
                <span>Your Wellness Journey</span>
              </div>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                View Details →
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span>Overall Wellness Score</span>
                  <span className="font-semibold">{wellnessScore}%</span>
                </div>
                <Progress value={wellnessScore} className="bg-white/20" />
              </div>
              <p className="text-sm opacity-90">
                {wellnessScore >= 80 ? "You're thriving! Keep up the great work!" :
                 wellnessScore >= 60 ? "Good progress! Consider exploring more wellness resources." :
                 "We're here to support you. Let's work together on your wellness."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Card key={action.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onPageChange(action.id)}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`${action.color} p-3 rounded-lg`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Upcoming Sessions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <p className="text-gray-500 text-center">Loading appointments...</p>
                ) : userBookings.length > 0 ? (
                  userBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{booking.counselorName}</p>
                        <p className="text-sm text-gray-600">{booking.sessionTypeLabel}</p>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(booking.date).toLocaleDateString()} at {booking.time}
                        </p>
                      </div>
                      <Badge variant="outline">{booking.status}</Badge>
                    </div>
                  ))
                ) : (
                  upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{appointment.counselor}</p>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.date}
                        </p>
                      </div>
                      <Badge variant="outline">Confirmed</Badge>
                    </div>
                  ))
                )}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => onPageChange('sessions')}
                  >
                    View All Sessions
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => onPageChange('booking')}
                  >
                    Book New Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <activity.icon className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Resources */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Crisis Resources</CardTitle>
            <CardDescription className="text-red-600">
              If you're experiencing a mental health emergency, help is available 24/7
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <h4 className="font-semibold text-red-700">Campus Counseling</h4>
                <p className="text-sm text-red-600">(555) 123-HELP</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-red-700">Crisis Hotline</h4>
                <p className="text-sm text-red-600">988 - Suicide & Crisis Lifeline</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-red-700">Emergency</h4>
                <p className="text-sm text-red-600">911 or Campus Security</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}