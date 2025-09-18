import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Alert, AlertDescription } from './ui/alert'
import { Users, MessageCircle, Heart, ThumbsUp, Reply, Plus, Shield, Clock, Eye } from 'lucide-react'

interface Post {
  id: string
  author: string
  avatar: string
  title: string
  content: string
  category: string
  timestamp: string
  likes: number
  replies: number
  isAnonymous: boolean
  tags: string[]
}

interface Reply {
  id: string
  postId: string
  author: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  isAnonymous: boolean
}

export function PeerSupport() {
  const [selectedTab, setSelectedTab] = useState('discussions')
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [showNewPostForm, setShowNewPostForm] = useState(false)

  const posts: Post[] = [
    {
      id: '1',
      author: 'Sarah M.',
      avatar: 'SM',
      title: 'Dealing with exam anxiety',
      content: 'Hi everyone, I\'ve been struggling with severe anxiety during exams. My heart races and I can\'t think clearly. Has anyone found techniques that help?',
      category: 'anxiety',
      timestamp: '2 hours ago',
      likes: 12,
      replies: 8,
      isAnonymous: false,
      tags: ['anxiety', 'exams', 'stress']
    },
    {
      id: '2',
      author: 'Anonymous',
      avatar: '?',
      title: 'Feeling overwhelmed with coursework',
      content: 'I\'m in my third year and feeling completely overwhelmed. The workload seems impossible and I\'m falling behind. How do you manage everything?',
      category: 'stress',
      timestamp: '4 hours ago',
      likes: 18,
      replies: 15,
      isAnonymous: true,
      tags: ['overwhelmed', 'coursework', 'time-management']
    },
    {
      id: '3',
      author: 'Mike K.',
      avatar: 'MK',
      title: 'Success story: Overcoming social anxiety',
      content: 'Six months ago, I could barely speak in class. Today I gave a presentation to 50 people! Here\'s what helped me...',
      category: 'success',
      timestamp: '1 day ago',
      likes: 45,
      replies: 23,
      isAnonymous: false,
      tags: ['success-story', 'social-anxiety', 'confidence']
    },
    {
      id: '4',
      author: 'Anonymous',
      avatar: '?',
      title: 'Finding motivation when depressed',
      content: 'I\'ve been struggling with depression and it\'s hard to find motivation for anything. Small wins feel impossible. Any advice?',
      category: 'depression',
      timestamp: '2 days ago',
      likes: 28,
      replies: 19,
      isAnonymous: true,
      tags: ['depression', 'motivation', 'support']
    }
  ]

  const supportGroups = [
    {
      id: '1',
      name: 'Anxiety Support Circle',
      description: 'Safe space for discussing anxiety and panic disorders',
      members: 156,
      moderator: 'Dr. Johnson',
      isActive: true,
      nextMeeting: 'Today 7:00 PM'
    },
    {
      id: '2',
      name: 'Academic Stress Relief',
      description: 'Strategies for managing academic pressure and deadlines',
      members: 203,
      moderator: 'Peer Counselor Lisa',
      isActive: true,
      nextMeeting: 'Tomorrow 6:00 PM'
    },
    {
      id: '3',
      name: 'Depression Support Network',
      description: 'Understanding and supporting each other through depression',
      members: 98,
      moderator: 'Dr. Chen',
      isActive: true,
      nextMeeting: 'Friday 5:30 PM'
    },
    {
      id: '4',
      name: 'LGBTQ+ Mental Health',
      description: 'Mental health support for LGBTQ+ students',
      members: 67,
      moderator: 'Peer Counselor Alex',
      isActive: true,
      nextMeeting: 'Wednesday 7:30 PM'
    }
  ]

  const handleSubmitPost = () => {
    if (newPostTitle.trim() && newPostContent.trim()) {
      // In a real app, this would submit to backend
      setNewPostTitle('')
      setNewPostContent('')
      setShowNewPostForm(false)
      setIsAnonymous(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'anxiety': return 'bg-blue-100 text-blue-800'
      case 'stress': return 'bg-orange-100 text-orange-800'
      case 'depression': return 'bg-purple-100 text-purple-800'
      case 'success': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Peer Support Community</h1>
          <p className="text-gray-600">Connect with fellow students in a safe, moderated environment</p>
        </div>

        {/* Community Guidelines */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Community Guidelines:</strong> This is a safe space for peer support. All posts are moderated by trained volunteers. 
            Be respectful, maintain confidentiality, and report any concerning content. Crisis situations require immediate professional help.
          </AlertDescription>
        </Alert>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="groups">Support Groups</TabsTrigger>
            <TabsTrigger value="resources">Peer Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="discussions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Community Discussions</h2>
              <Button onClick={() => setShowNewPostForm(!showNewPostForm)}>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>

            {/* New Post Form */}
            {showNewPostForm && (
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle>Share with the Community</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Post title..."
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Share your thoughts, experiences, or questions..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={4}
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Post anonymously</span>
                    </label>
                    <div className="space-x-2">
                      <Button variant="outline" onClick={() => setShowNewPostForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSubmitPost}>
                        Post
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Discussion Posts */}
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={post.isAnonymous ? 'bg-gray-200' : 'bg-blue-100'}>
                          {post.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">{post.author}</span>
                          <Badge className={getCategoryColor(post.category)}>
                            {post.category}
                          </Badge>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {post.timestamp}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-4">{post.content}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="text-gray-500">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500">
                            <Reply className="h-4 w-4 mr-1" />
                            {post.replies} replies
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500">
                            <Eye className="h-4 w-4 mr-1" />
                            View Discussion
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <h2 className="text-xl font-semibold">Support Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{group.name}</span>
                      {group.isActive && (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{group.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Members:</span>
                        <span className="font-medium">{group.members}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Moderator:</span>
                        <span className="font-medium">{group.moderator}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Next Meeting:</span>
                        <span className="font-medium text-blue-600">{group.nextMeeting}</span>
                      </div>
                    </div>
                    <Button className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Join Group
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <h2 className="text-xl font-semibold">Peer-Created Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Heart className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Coping Strategies Shared</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Peer-contributed coping techniques that have worked for students
                    </p>
                    <Button size="sm">Explore</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Buddy System</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Connect with a peer buddy for mutual support and accountability
                    </p>
                    <Button size="sm">Find Buddy</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Study Groups</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Join study groups focused on maintaining mental wellness
                    </p>
                    <Button size="sm">Join Group</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}