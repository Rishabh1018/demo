import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

import { Play, Download, Search, Clock, BookOpen, Headphones, Video, FileText, Heart } from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  type: 'video' | 'audio' | 'article' | 'exercise'
  duration?: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  language: string
  thumbnail?: string
}

export function ResourceHub() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Managing Academic Stress',
      description: 'Learn effective strategies to handle exam pressure and academic deadlines.',
      type: 'video',
      duration: '15 min',
      category: 'stress',
      difficulty: 'beginner',
      language: 'English'
    },
    {
      id: '2',
      title: 'Mindfulness Meditation for Beginners',
      description: 'A guided meditation session to help you develop mindfulness skills.',
      type: 'audio',
      duration: '20 min',
      category: 'mindfulness',
      difficulty: 'beginner',
      language: 'English'
    },
    {
      id: '3',
      title: 'Understanding Anxiety Disorders',
      description: 'Comprehensive guide to recognizing and managing anxiety symptoms.',
      type: 'article',
      duration: '10 min read',
      category: 'anxiety',
      difficulty: 'intermediate',
      language: 'English'
    },
    {
      id: '4',
      title: 'Progressive Muscle Relaxation',
      description: 'Step-by-step exercise to release physical tension and stress.',
      type: 'exercise',
      duration: '25 min',
      category: 'relaxation',
      difficulty: 'beginner',
      language: 'English'
    },
    {
      id: '5',
      title: 'Building Self-Esteem',
      description: 'Practical techniques to improve self-confidence and self-worth.',
      type: 'video',
      duration: '18 min',
      category: 'self-esteem',
      difficulty: 'intermediate',
      language: 'English'
    },
    {
      id: '6',
      title: 'Sleep Hygiene Guide',
      description: 'Essential tips for better sleep quality and managing insomnia.',
      type: 'article',
      duration: '8 min read',
      category: 'sleep',
      difficulty: 'beginner',
      language: 'English'
    },
    {
      id: '7',
      title: 'Breathing Exercises for Anxiety',
      description: 'Quick and effective breathing techniques for managing anxiety attacks.',
      type: 'audio',
      duration: '12 min',
      category: 'anxiety',
      difficulty: 'beginner',
      language: 'English'
    },
    {
      id: '8',
      title: 'Coping with Depression',
      description: 'Strategies for managing depressive episodes and finding support.',
      type: 'video',
      duration: '22 min',
      category: 'depression',
      difficulty: 'intermediate',
      language: 'English'
    }
  ]

  const categories = [
    { id: 'all', label: 'All Resources', count: resources.length },
    { id: 'stress', label: 'Stress Management', count: resources.filter(r => r.category === 'stress').length },
    { id: 'anxiety', label: 'Anxiety Support', count: resources.filter(r => r.category === 'anxiety').length },
    { id: 'depression', label: 'Depression Help', count: resources.filter(r => r.category === 'depression').length },
    { id: 'mindfulness', label: 'Mindfulness', count: resources.filter(r => r.category === 'mindfulness').length },
    { id: 'sleep', label: 'Sleep Support', count: resources.filter(r => r.category === 'sleep').length },
    { id: 'self-esteem', label: 'Self-Esteem', count: resources.filter(r => r.category === 'self-esteem').length }
  ]

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />
      case 'audio': return <Headphones className="h-4 w-4" />
      case 'article': return <FileText className="h-4 w-4" />
      case 'exercise': return <Heart className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mental Health Resource Hub</h1>
          <p className="text-gray-600">Evidence-based resources for mental wellness and self-care</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  {category.label} ({category.count})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Featured Resources */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.slice(0, 3).map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(resource.type)}
                      <Badge variant="outline" className="capitalize">
                        {resource.type}
                      </Badge>
                    </div>
                    <Badge className={getDifficultyColor(resource.difficulty)}>
                      {resource.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{resource.duration}</span>
                    </div>
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Resources */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            All Resources ({filteredResources.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(resource.type)}
                      <span className="text-xs text-gray-500 capitalize">{resource.type}</span>
                    </div>
                    <Badge size="sm" className={getDifficultyColor(resource.difficulty)}>
                      {resource.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{resource.duration}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Access Tools */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <Headphones className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">5-Minute Calm</h3>
                <p className="text-sm opacity-90">Quick relaxation exercise</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Breathing Guide</h3>
                <p className="text-sm opacity-90">Guided breathing exercises</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Daily Journal</h3>
                <p className="text-sm opacity-90">Mood tracking & reflection</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6 text-center">
                <Download className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Offline Resources</h3>
                <p className="text-sm opacity-90">Download for offline use</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Language Support Notice */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Multilingual Support</h3>
            <p className="text-blue-800">
              Resources are available in multiple regional languages. Use the language filter to find content in your preferred language.
              We're continuously adding new resources in Hindi, Tamil, Telugu, Bengali, and other regional languages.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}