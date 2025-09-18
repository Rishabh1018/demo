import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Alert, AlertDescription } from './ui/alert'
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  MessageSquare, 
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Filter,
  Download
} from 'lucide-react'
import { api, DEMO_USER_ID } from '../utils/api'

interface BookedSession {
  id: string
  counselorId: string
  counselorName: string
  date: string
  time: string
  sessionType: string
  sessionTypeLabel: string
  concerns?: string
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending'
  location?: string
  notes?: string
  createdAt: string
}

interface SessionStats {
  total: number
  upcoming: number
  completed: number
  cancelled: number
}

export function MySessions({ onPageChange }: { onPageChange?: (page: string) => void }) {
  const [sessions, setSessions] = useState<BookedSession[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all')

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const result = await api.getUserBookings(DEMO_USER_ID)
      if (result.bookings && Array.isArray(result.bookings)) {
        setSessions(result.bookings)
      } else {
        // Generate sample data for demo
        generateSampleSessions()
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
      // Generate sample data for demo
      generateSampleSessions()
    } finally {
      setLoading(false)
    }
  }

  const generateSampleSessions = () => {
    const sampleSessions: BookedSession[] = [
      {
        id: 'session_1',
        counselorId: '1',
        counselorName: 'Dr. Sarah Johnson',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        time: '2:00 PM',
        sessionType: 'individual',
        sessionTypeLabel: 'Individual Therapy (50 min)',
        concerns: 'Academic stress and anxiety management',
        status: 'confirmed',
        location: 'Campus Counseling Center - Room 201',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'session_2',
        counselorId: '2',
        counselorName: 'Dr. Michael Chen',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        time: '10:00 AM',
        sessionType: 'group',
        sessionTypeLabel: 'Group Therapy (90 min)',
        concerns: 'Social anxiety support group',
        status: 'confirmed',
        location: 'Campus Counseling Center - Group Room B',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'session_3',
        counselorId: '1',
        counselorName: 'Dr. Sarah Johnson',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        time: '3:00 PM',
        sessionType: 'individual',
        sessionTypeLabel: 'Individual Therapy (50 min)',
        concerns: 'Initial consultation and assessment',
        status: 'completed',
        location: 'Campus Counseling Center - Room 201',
        notes: 'Great first session. Discussed coping strategies and set goals for future sessions.',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'session_4',
        counselorId: '3',
        counselorName: 'Dr. Emily Rodriguez',
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks ago
        time: '1:00 PM',
        sessionType: 'crisis',
        sessionTypeLabel: 'Crisis Intervention (30 min)',
        concerns: 'Urgent support needed',
        status: 'completed',
        location: 'Campus Counseling Center - Crisis Room',
        notes: 'Crisis successfully managed. Follow-up scheduled.',
        createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'session_5',
        counselorId: '2',
        counselorName: 'Dr. Michael Chen',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
        time: '11:00 AM',
        sessionType: 'individual',
        sessionTypeLabel: 'Individual Therapy (50 min)',
        concerns: 'Follow-up on relationship concerns',
        status: 'pending',
        location: 'Campus Counseling Center - Room 203',
        createdAt: new Date().toISOString()
      }
    ]
    
    setSessions(sampleSessions)
  }

  const getSessionStats = (): SessionStats => {
    const now = new Date()
    const stats = {
      total: sessions.length,
      upcoming: 0,
      completed: 0,
      cancelled: 0
    }

    sessions.forEach(session => {
      const sessionDate = new Date(session.date)
      
      if (session.status === 'completed') {
        stats.completed++
      } else if (session.status === 'cancelled') {
        stats.cancelled++
      } else if (sessionDate > now && (session.status === 'confirmed' || session.status === 'pending')) {
        stats.upcoming++
      }
    })

    return stats
  }

  const filteredSessions = sessions.filter(session => {
    const now = new Date()
    const sessionDate = new Date(session.date)
    
    switch (filter) {
      case 'upcoming':
        return sessionDate > now && (session.status === 'confirmed' || session.status === 'pending')
      case 'completed':
        return session.status === 'completed'
      case 'cancelled':
        return session.status === 'cancelled'
      default:
        return true
    }
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isUpcoming = (date: string) => {
    return new Date(date) > new Date()
  }

  const stats = getSessionStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Counseling Sessions</h1>
            <p className="text-gray-600">Manage and track your mental health appointments</p>
          </div>
          <Button onClick={() => onPageChange?.('booking')} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Book New Session</span>
          </Button>
        </div>

        {/* Session Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
                  <p className="text-sm text-gray-600">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
                  <p className="text-sm text-gray-600">Cancelled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Sessions</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <TabsContent value={filter} className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading your sessions...</p>
              </div>
            ) : filteredSessions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {filter === 'all' ? 'No sessions found' : `No ${filter} sessions`}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {filter === 'upcoming' 
                      ? "You don't have any upcoming sessions scheduled."
                      : filter === 'completed'
                      ? "You haven't completed any sessions yet."
                      : filter === 'cancelled'
                      ? "You don't have any cancelled sessions."
                      : "You haven't booked any counseling sessions yet."
                    }
                  </p>
                  <Button onClick={() => onPageChange?.('booking')}>
                    Book Your First Session
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <Card key={session.id} className={`${isUpcoming(session.date) ? 'border-blue-200 bg-blue-50' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white rounded-full">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{session.counselorName}</h3>
                            <p className="text-sm text-gray-600">{session.sessionTypeLabel}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(session.status)}
                          <Badge className={getStatusColor(session.status)}>
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(session.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{session.time}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{session.location || 'Campus Counseling Center'}</span>
                        </div>
                      </div>

                      {session.concerns && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Session Focus:</p>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{session.concerns}</p>
                        </div>
                      )}

                      {session.notes && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Session Notes:</p>
                          <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">{session.notes}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t">
                        <p className="text-xs text-gray-500">
                          Booked on {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                        
                        <div className="flex space-x-2">
                          {isUpcoming(session.date) && session.status === 'confirmed' && (
                            <>
                              <Button variant="outline" size="sm">
                                <Phone className="h-4 w-4 mr-1" />
                                Call
                              </Button>
                              <Button variant="outline" size="sm">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Message
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                Reschedule
                              </Button>
                            </>
                          )}
                          
                          {session.status === 'completed' && (
                            <Button variant="outline" size="sm">
                              View Summary
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Important Information */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Need to cancel or reschedule?</strong> Please contact us at least 24 hours in advance. 
            For crisis situations, call our 24/7 crisis hotline at <strong>(555) 123-HELP</strong> or campus security at <strong>911</strong>.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}