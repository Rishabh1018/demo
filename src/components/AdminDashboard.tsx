import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Alert, AlertDescription } from './ui/alert'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Download, 
  Eye,
  Heart,
  Clock,
  FileText
} from 'lucide-react'
import { api } from '../utils/api'

export function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await api.getAnalytics()
        setAnalytics(result.analytics)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  // Mock data for analytics (fallback if backend fails)
  const monthlyUsage = [
    { month: 'Jan', aiChat: 450, bookings: 120, resources: 890, community: 340 },
    { month: 'Feb', aiChat: 520, bookings: 145, resources: 950, community: 380 },
    { month: 'Mar', aiChat: 680, bookings: 180, resources: 1100, community: 420 },
    { month: 'Apr', aiChat: 750, bookings: 200, resources: 1250, community: 480 },
    { month: 'May', aiChat: 620, bookings: 165, resources: 1150, community: 450 },
    { month: 'Jun', aiChat: 580, bookings: 155, resources: 1080, community: 400 }
  ]

  const wellnessDistribution = [
    { name: 'Low Risk', value: 65, color: '#10B981' },
    { name: 'Moderate Risk', value: 25, color: '#F59E0B' },
    { name: 'High Risk', value: 10, color: '#EF4444' }
  ]

  const topConcerns = [
    { concern: 'Academic Stress', count: 245, trend: '+12%' },
    { concern: 'Anxiety', count: 189, trend: '+8%' },
    { concern: 'Depression', count: 156, trend: '-3%' },
    { concern: 'Sleep Issues', count: 134, trend: '+15%' },
    { concern: 'Social Isolation', count: 98, trend: '+20%' }
  ]

  const recentAlerts = [
    { id: 1, type: 'crisis', message: 'High-risk keywords detected in AI chat', timestamp: '2 hours ago', status: 'addressed' },
    { id: 2, type: 'usage', message: 'Unusual spike in crisis support requests', timestamp: '4 hours ago', status: 'monitoring' },
    { id: 3, type: 'system', message: 'Counselor availability low for next week', timestamp: '6 hours ago', status: 'pending' }
  ]

  const counselorStats = [
    { name: 'Dr. Sarah Johnson', sessions: 28, rating: 4.9, utilization: 95 },
    { name: 'Dr. Michael Chen', sessions: 32, rating: 4.8, utilization: 88 },
    { name: 'Dr. Emily Rodriguez', sessions: 24, rating: 4.9, utilization: 92 },
    { name: 'Dr. David Kim', sessions: 26, rating: 4.7, utilization: 85 }
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'crisis': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'usage': return <TrendingUp className="h-4 w-4 text-orange-500" />
      case 'system': return <Clock className="h-4 w-4 text-blue-500" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'addressed': return 'bg-green-100 text-green-800'
      case 'monitoring': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Nirvaan - Mental Health System Analytics & Management</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generate Summary
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Active Users</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics?.totalUsers || 0}</p>
                    <p className="text-sm text-green-600">Real-time data</p>
                  </div>
                  <Users className="h-12 w-12 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">AI Chat Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics?.totalChatSessions || 0}</p>
                    <p className="text-sm text-blue-600">Total sessions</p>
                  </div>
                  <MessageCircle className="h-12 w-12 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Counseling Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics?.totalBookings || 0}</p>
                    <p className="text-sm text-green-600">Total bookings</p>
                  </div>
                  <Calendar className="h-12 w-12 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Crisis Alerts</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics?.crisisAlerts || 0}</p>
                    <p className="text-sm text-red-600">Pending attention</p>
                  </div>
                  <AlertTriangle className="h-12 w-12 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
            <TabsTrigger value="wellbeing">Wellbeing Trends</TabsTrigger>
            <TabsTrigger value="counselors">Counselor Stats</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Platform Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyUsage}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="aiChat" fill="#3B82F6" name="AI Chat" />
                      <Bar dataKey="bookings" fill="#10B981" name="Bookings" />
                      <Bar dataKey="community" fill="#8B5CF6" name="Community" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={wellnessDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                      >
                        {wellnessDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center space-x-4 mt-4">
                    {wellnessDistribution.map((item) => (
                      <div key={item.name} className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Mental Health Concerns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topConcerns.map((concern, index) => (
                    <div key={concern.concern} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <span className="font-medium">{concern.concern}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{concern.count} reports</span>
                        <Badge variant={concern.trend.startsWith('+') ? "destructive" : "secondary"}>
                          {concern.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="aiChat" stroke="#3B82F6" name="AI Chat" strokeWidth={2} />
                    <Line type="monotone" dataKey="bookings" stroke="#10B981" name="Bookings" strokeWidth={2} />
                    <Line type="monotone" dataKey="resources" stroke="#F59E0B" name="Resources" strokeWidth={2} />
                    <Line type="monotone" dataKey="community" stroke="#8B5CF6" name="Community" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wellbeing" className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
              <Heart className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Wellbeing metrics are derived from anonymous assessment tools and usage patterns. 
                Individual student data remains confidential and is not accessible through this dashboard.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700">Improved Wellbeing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">78%</p>
                    <p className="text-sm text-gray-600">Students showing improvement</p>
                    <Progress value={78} className="mt-4" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-yellow-700">Stable Condition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-600">15%</p>
                    <p className="text-sm text-gray-600">Maintaining current level</p>
                    <Progress value={15} className="mt-4" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-700">Needs Attention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600">7%</p>
                    <p className="text-sm text-gray-600">Requiring intervention</p>
                    <Progress value={7} className="mt-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="counselors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Counselor Performance & Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {counselorStats.map((counselor) => (
                    <div key={counselor.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{counselor.name}</h3>
                        <Badge className="bg-blue-100 text-blue-800">★ {counselor.rating}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Sessions this month:</span>
                          <span className="ml-2 font-medium">{counselor.sessions}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Utilization:</span>
                          <span className="ml-2 font-medium">{counselor.utilization}%</span>
                        </div>
                      </div>
                      <Progress value={counselor.utilization} className="mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent System Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getAlertIcon(alert.type)}
                          <div>
                            <p className="font-medium">{alert.message}</p>
                            <p className="text-sm text-gray-500">{alert.timestamp}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-red-800">Crisis Alerts</h3>
                  <p className="text-2xl font-bold text-red-600">3</p>
                  <p className="text-sm text-red-700">Requiring immediate attention</p>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-6 text-center">
                  <Eye className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-yellow-800">Monitoring</h3>
                  <p className="text-2xl font-bold text-yellow-600">7</p>
                  <p className="text-sm text-yellow-700">Under observation</p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-green-800">Resolved</h3>
                  <p className="text-2xl font-bold text-green-600">15</p>
                  <p className="text-sm text-green-700">Successfully addressed</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}