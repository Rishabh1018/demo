import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Slider } from './ui/slider'
import { Textarea } from './ui/textarea'
import { Alert, AlertDescription } from './ui/alert'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'
import { 
  Heart, 
  Brain, 
  Moon, 
  Activity, 
  Users, 
  Smile, 
  Frown, 
  Meh,
  TrendingUp,
  Calendar,
  Target,
  Award,
  BookOpen,
  MessageCircle,
  CheckCircle2
} from 'lucide-react'
import { api, DEMO_USER_ID } from '../utils/api'

interface WellnessData {
  date: string
  overall: number
  mood: number
  stress: number
  sleep: number
  social: number
  academic: number
}

interface Assessment {
  id: string
  date: string
  mood: number
  stressLevel: number
  sleepQuality: number
  socialConnection: number
  academicStress: number
  notes: string
  score: number
}

export function WellnessJourney() {
  const [currentScore, setCurrentScore] = useState(75)
  const [wellnessData, setWellnessData] = useState<WellnessData[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [showAssessment, setShowAssessment] = useState(false)

  // Assessment form state
  const [mood, setMood] = useState([7])
  const [stressLevel, setStressLevel] = useState([5])
  const [sleepQuality, setSleepQuality] = useState([7])
  const [socialConnection, setSocialConnection] = useState([6])
  const [academicStress, setAcademicStress] = useState([5])
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchWellnessData()
  }, [])

  const fetchWellnessData = async () => {
    try {
      const result = await api.getWellnessData(DEMO_USER_ID)
      
      if (result && typeof result === 'object') {
        if (typeof result.wellnessScore === 'number' && result.wellnessScore >= 0 && result.wellnessScore <= 100) {
          setCurrentScore(result.wellnessScore)
        }
        
        if (Array.isArray(result.assessments) && result.assessments.length > 0) {
          setAssessments(result.assessments)
          generateWellnessChart(result.assessments)
        } else {
          // No assessments found, use sample data
          generateSampleData()
        }
      } else {
        // Invalid response format
        generateSampleData()
      }
    } catch (error) {
      console.error('Failed to fetch wellness data:', error)
      // Generate sample data for demo
      generateSampleData()
    } finally {
      setLoading(false)
    }
  }

  const generateSampleData = () => {
    const sampleData: WellnessData[] = []
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      sampleData.push({
        date: date.toISOString().split('T')[0],
        overall: Math.floor(Math.random() * 30) + 60,
        mood: Math.floor(Math.random() * 4) + 6,
        stress: Math.floor(Math.random() * 6) + 3,
        sleep: Math.floor(Math.random() * 4) + 6,
        social: Math.floor(Math.random() * 5) + 5,
        academic: Math.floor(Math.random() * 6) + 4
      })
    }
    
    setWellnessData(sampleData)
  }

  const generateWellnessChart = (assessmentData: Assessment[]) => {
    try {
      const chartData = assessmentData
        .filter(assessment => assessment && assessment.date) // Filter out invalid assessments
        .map(assessment => {
          // Safe date parsing
          let dateStr: string
          try {
            const parsedDate = new Date(assessment.date || assessment.timestamp || new Date())
            if (isNaN(parsedDate.getTime())) {
              // If date is invalid, use current date
              dateStr = new Date().toISOString().split('T')[0]
            } else {
              dateStr = parsedDate.toISOString().split('T')[0]
            }
          } catch (err) {
            console.warn('Invalid date format:', assessment.date)
            dateStr = new Date().toISOString().split('T')[0]
          }

          return {
            date: dateStr,
            overall: Math.min(Math.max(assessment.score || 0, 0), 100) / 10, // Normalize to 0-10 scale
            mood: Math.min(Math.max(assessment.mood || 7, 1), 10),
            stress: Math.min(Math.max(10 - (assessment.stressLevel || 5), 1), 10), // Invert stress
            sleep: Math.min(Math.max(assessment.sleepQuality || 7, 1), 10),
            social: Math.min(Math.max(assessment.socialConnection || 6, 1), 10),
            academic: Math.min(Math.max(10 - (assessment.academicStress || 5), 1), 10) // Invert academic stress
          }
        })
      
      if (chartData.length === 0) {
        // If no valid data, generate sample data
        generateSampleData()
      } else {
        setWellnessData(chartData)
      }
    } catch (error) {
      console.error('Error generating wellness chart:', error)
      // Fallback to sample data
      generateSampleData()
    }
  }

  const submitAssessment = async () => {
    try {
      const assessment = {
        mood: mood[0],
        stressLevel: stressLevel[0],
        sleepQuality: sleepQuality[0],
        socialConnection: socialConnection[0],
        academicStress: academicStress[0],
        notes,
        score: Math.round((mood[0] + (10 - stressLevel[0]) + sleepQuality[0] + socialConnection[0] + (10 - academicStress[0])) / 5 * 10)
      }

      await api.saveWellnessAssessment(DEMO_USER_ID, assessment)
      
      // Reset form
      setMood([7])
      setStressLevel([5])
      setSleepQuality([7])
      setSocialConnection([6])
      setAcademicStress([5])
      setNotes('')
      setShowAssessment(false)
      
      // Refresh data
      fetchWellnessData()
    } catch (error) {
      console.error('Failed to save assessment:', error)
    }
  }

  const getMoodIcon = (score: number) => {
    if (score >= 8) return <Smile className="h-5 w-5 text-green-500" />
    if (score >= 6) return <Meh className="h-5 w-5 text-yellow-500" />
    return <Frown className="h-5 w-5 text-red-500" />
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const wellnessCategories = [
    { 
      name: 'Mood', 
      value: wellnessData[wellnessData.length - 1]?.mood || 7, 
      icon: Heart, 
      color: '#ef4444',
      description: 'How you\'ve been feeling emotionally'
    },
    { 
      name: 'Stress', 
      value: wellnessData[wellnessData.length - 1]?.stress || 7, 
      icon: Brain, 
      color: '#f97316',
      description: 'Your stress management and coping'
    },
    { 
      name: 'Sleep', 
      value: wellnessData[wellnessData.length - 1]?.sleep || 7, 
      icon: Moon, 
      color: '#8b5cf6',
      description: 'Quality and consistency of rest'
    },
    { 
      name: 'Social', 
      value: wellnessData[wellnessData.length - 1]?.social || 6, 
      icon: Users, 
      color: '#06b6d4',
      description: 'Connection with friends and community'
    },
    { 
      name: 'Academic', 
      value: wellnessData[wellnessData.length - 1]?.academic || 6, 
      icon: BookOpen, 
      color: '#10b981',
      description: 'Balance with studies and workload'
    }
  ]

  const achievements = [
    { id: 1, title: '7-Day Streak', description: 'Completed daily check-ins', earned: true, icon: Target },
    { id: 2, title: 'Wellness Warrior', description: 'Maintained 80+ score for a week', earned: true, icon: Award },
    { id: 3, title: 'Self-Care Champion', description: 'Used 10 different resources', earned: false, icon: Heart },
    { id: 4, title: 'Community Helper', description: 'Participated in peer support', earned: true, icon: Users }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Your Wellness Journey</h1>
          <p className="text-gray-600">Track your mental health progress and celebrate your growth</p>
        </div>

        {/* Current Wellness Score */}
        <Card className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <Heart className="h-12 w-12 mx-auto" />
              <div>
                <h2 className="text-3xl font-bold">{currentScore}/100</h2>
                <p className="text-xl opacity-90">Overall Wellness Score</p>
              </div>
              <div className="max-w-md mx-auto">
                <Progress value={currentScore} className="bg-white/20 h-3" />
              </div>
              <p className="text-sm opacity-80">
                {currentScore >= 80 ? "You're thriving! Keep up the great work!" :
                 currentScore >= 60 ? "Good progress! Consider exploring more wellness resources." :
                 "We're here to support you. Let's work together on your wellness."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="assessment">Daily Check-in</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Wellness Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {wellnessCategories.map((category) => (
                <Card key={category.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 rounded-full" style={{ backgroundColor: `${category.color}20` }}>
                        <category.icon className="h-5 w-5" style={{ color: category.color }} />
                      </div>
                      <h3 className="font-medium">{category.name}</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{category.value}/10</span>
                        {getMoodIcon(category.value)}
                      </div>
                      <Progress value={category.value * 10} className="h-2" />
                      <p className="text-xs text-gray-500">{category.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent Wellness Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-green-800">Daily check-in completed</p>
                      <p className="text-sm text-green-600">Today at 9:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-blue-800">Used AI support chat</p>
                      <p className="text-sm text-blue-600">Yesterday at 3:15 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-purple-800">Completed mindfulness exercise</p>
                      <p className="text-sm text-purple-600">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>30-Day Wellness Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={wellnessData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="overall" stroke="#3b82f6" name="Overall" strokeWidth={3} />
                      <Line type="monotone" dataKey="mood" stroke="#ef4444" name="Mood" strokeWidth={2} />
                      <Line type="monotone" dataKey="stress" stroke="#f97316" name="Stress Management" strokeWidth={2} />
                      <Line type="monotone" dataKey="sleep" stroke="#8b5cf6" name="Sleep" strokeWidth={2} />
                      <Line type="monotone" dataKey="social" stroke="#06b6d4" name="Social" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-6">
            {!showAssessment ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Daily Wellness Check-in</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-600">Take a moment to reflect on your day and track your wellness.</p>
                  <Button onClick={() => setShowAssessment(true)} size="lg">
                    Start Today's Check-in
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Daily Wellness Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">How was your mood today? (1-10)</label>
                      <Slider value={mood} onValueChange={setMood} max={10} min={1} step={1} />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Very Low</span>
                        <span>Excellent</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Stress Level (1-10)</label>
                      <Slider value={stressLevel} onValueChange={setStressLevel} max={10} min={1} step={1} />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>No Stress</span>
                        <span>Very Stressed</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Sleep Quality (1-10)</label>
                      <Slider value={sleepQuality} onValueChange={setSleepQuality} max={10} min={1} step={1} />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Very Poor</span>
                        <span>Excellent</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Social Connection (1-10)</label>
                      <Slider value={socialConnection} onValueChange={setSocialConnection} max={10} min={1} step={1} />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Very Isolated</span>
                        <span>Very Connected</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Academic Stress (1-10)</label>
                      <Slider value={academicStress} onValueChange={setAcademicStress} max={10} min={1} step={1} />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>No Stress</span>
                        <span>Very Stressed</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Optional Notes</label>
                      <Textarea 
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="How are you feeling? Any thoughts about your day..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={submitAssessment} className="flex-1">
                      Submit Check-in
                    </Button>
                    <Button variant="outline" onClick={() => setShowAssessment(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={achievement.earned ? 'border-green-200 bg-green-50' : 'border-gray-200'}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${achievement.earned ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <achievement.icon className={`h-6 w-6 ${achievement.earned ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${achievement.earned ? 'text-green-800' : 'text-gray-600'}`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm ${achievement.earned ? 'text-green-600' : 'text-gray-500'}`}>
                          {achievement.description}
                        </p>
                        {achievement.earned && (
                          <Badge className="mt-2 bg-green-100 text-green-800">Earned</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}