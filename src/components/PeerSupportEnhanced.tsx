import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Alert, AlertDescription } from './ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'
import { 
  Users, 
  MessageCircle, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  Reply, 
  Plus, 
  Shield, 
  Clock, 
  Eye,
  Search,
  Filter,
  Flag,
  MoreHorizontal,
  Send,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
  Calendar,
  Settings,
  UserPlus
} from 'lucide-react'
import { api, DEMO_USER_ID } from '../utils/api'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface Post {
  id: string
  userId: string
  author: string
  avatar: string
  title: string
  content: string
  category: string
  timestamp: string
  likes: number
  dislikes: number
  replies: number
  views: number
  isAnonymous: boolean
  tags: string[]
  isLiked?: boolean
  isDisliked?: boolean
  status: 'active' | 'flagged' | 'moderated'
  moderationNote?: string
}

interface Comment {
  id: string
  postId: string
  userId: string
  author: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  dislikes: number
  isAnonymous: boolean
  isLiked?: boolean
  isDisliked?: boolean
  parentId?: string // For nested replies
  status: 'active' | 'flagged' | 'moderated'
}

interface SupportGroup {
  id: string
  name: string
  description: string
  members: number
  moderator: string
  isActive: boolean
  nextMeeting: string
  isJoined?: boolean
  category: string
  privacy: 'public' | 'private'
}

export function PeerSupport() {
  const [selectedTab, setSelectedTab] = useState('discussions')
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<{[key: string]: Comment[]}>({})
  const [supportGroups, setSupportGroups] = useState<SupportGroup[]>([])
  const [loading, setLoading] = useState(true)
  
  // Post creation
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostCategory, setNewPostCategory] = useState('')
  const [newPostTags, setNewPostTags] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [showNewPostForm, setShowNewPostForm] = useState(false)
  
  // Post viewing and comments
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showPostDetail, setShowPostDetail] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [commentAnonymous, setCommentAnonymous] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  
  // Filtering and search
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  
  // Moderation
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportTarget, setReportTarget] = useState<{type: 'post' | 'comment', id: string} | null>(null)

  // Support Groups
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<SupportGroup | null>(null)
  const [showGroupDetail, setShowGroupDetail] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDescription, setNewGroupDescription] = useState('')
  const [newGroupCategory, setNewGroupCategory] = useState('')
  const [newGroupPrivacy, setNewGroupPrivacy] = useState<'public' | 'private'>('public')
  const [newGroupMeetingTime, setNewGroupMeetingTime] = useState('')

  const categories = [
    { value: 'anxiety', label: 'Anxiety & Panic', color: 'bg-blue-100 text-blue-800' },
    { value: 'depression', label: 'Depression & Mood', color: 'bg-purple-100 text-purple-800' },
    { value: 'stress', label: 'Stress & Burnout', color: 'bg-orange-100 text-orange-800' },
    { value: 'relationships', label: 'Relationships', color: 'bg-pink-100 text-pink-800' },
    { value: 'academic', label: 'Academic Pressure', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'success', label: 'Success Stories', color: 'bg-green-100 text-green-800' },
    { value: 'general', label: 'General Support', color: 'bg-gray-100 text-gray-800' }
  ]

  useEffect(() => {
    fetchPosts()
    fetchSupportGroups()
  }, [])

  const fetchPosts = async () => {
    try {
      const result = await api.getPosts()
      if (result.posts) {
        setPosts(result.posts.map((post: any) => ({
          ...post,
          author: post.isAnonymous ? 'Anonymous' : (post.author || 'Student'),
          avatar: post.isAnonymous ? '?' : (post.author ? post.author.substring(0, 2).toUpperCase() : 'ST'),
          likes: post.likes || 0,
          dislikes: post.dislikes || 0,
          replies: post.replies || 0,
          views: post.views || 0,
          tags: post.tags || [],
          status: post.status || 'active'
        })))
      } else {
        generateSamplePosts()
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      generateSamplePosts()
    } finally {
      setLoading(false)
    }
  }

  const fetchSupportGroups = async () => {
    try {
      // Try to fetch from backend first
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-11376ee3/support-groups`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        setSupportGroups(result.groups || [])
      } else {
        generateSampleGroups()
      }
    } catch (error) {
      console.error('Failed to fetch support groups:', error)
      generateSampleGroups()
    }
  }

  const generateSampleGroups = () => {
    // For now, use sample data - in production this would come from backend
    const sampleGroups: SupportGroup[] = [
      {
        id: '1',
        name: 'Anxiety Support Circle',
        description: 'Safe space for discussing anxiety and panic disorders',
        members: 156,
        moderator: 'Dr. Johnson',
        isActive: true,
        nextMeeting: 'Today 7:00 PM',
        category: 'anxiety',
        privacy: 'public'
      },
      {
        id: '2',
        name: 'Academic Stress Relief',
        description: 'Strategies for managing academic pressure and deadlines',
        members: 203,
        moderator: 'Peer Counselor Lisa',
        isActive: true,
        nextMeeting: 'Tomorrow 6:00 PM',
        category: 'academic',
        privacy: 'public'
      },
      {
        id: '3',
        name: 'Depression Support Network',
        description: 'Understanding and supporting each other through depression',
        members: 98,
        moderator: 'Dr. Chen',
        isActive: true,
        nextMeeting: 'Friday 5:30 PM',
        category: 'depression',
        privacy: 'public'
      },
      {
        id: '4',
        name: 'LGBTQ+ Mental Health',
        description: 'Mental health support for LGBTQ+ students',
        members: 67,
        moderator: 'Peer Counselor Alex',
        isActive: true,
        nextMeeting: 'Wednesday 7:30 PM',
        category: 'general',
        privacy: 'private'
      }
    ]
    setSupportGroups(sampleGroups)
  }

  const generateSamplePosts = () => {
    const samplePosts: Post[] = [
      {
        id: '1',
        userId: 'user1',
        author: 'Sarah M.',
        avatar: 'SM',
        title: 'Dealing with exam anxiety',
        content: 'Hi everyone, I\'ve been struggling with severe anxiety during exams. My heart races and I can\'t think clearly. Has anyone found techniques that help? I\'ve tried breathing exercises but they don\'t seem to work when I\'m actually in the exam room.',
        category: 'anxiety',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        likes: 12,
        dislikes: 0,
        replies: 0, // Start with 0 comments
        views: 45,
        isAnonymous: false,
        tags: ['anxiety', 'exams', 'stress'],
        status: 'active'
      },
      {
        id: '2',
        userId: 'user2',
        author: 'Anonymous',
        avatar: '?',
        title: 'Feeling overwhelmed with coursework',
        content: 'I\'m in my third year and feeling completely overwhelmed. The workload seems impossible and I\'m falling behind. How do you manage everything? I feel like I\'m drowning and don\'t know where to start.',
        category: 'stress',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        likes: 18,
        dislikes: 0,
        replies: 0, // Start with 0 comments
        views: 92,
        isAnonymous: true,
        tags: ['overwhelmed', 'coursework', 'time-management'],
        status: 'active'
      },
      {
        id: '3',
        userId: 'user3',
        author: 'Mike K.',
        avatar: 'MK',
        title: 'Success story: Overcoming social anxiety',
        content: 'Six months ago, I could barely speak in class. Today I gave a presentation to 50 people! Here\'s what helped me: 1) Started small with one-on-one conversations, 2) Practiced with trusted friends, 3) Used visualization techniques, 4) Got help from counseling center. You can do this too!',
        category: 'success',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        likes: 45,
        dislikes: 0,
        replies: 0, // Start with 0 comments
        views: 156,
        isAnonymous: false,
        tags: ['success-story', 'social-anxiety', 'confidence'],
        status: 'active'
      }
    ]
    setPosts(samplePosts)
  }

  const handleCreateGroup = async () => {
    if (newGroupName.trim() && newGroupDescription.trim() && newGroupCategory) {
      try {
        const groupData = {
          name: newGroupName,
          description: newGroupDescription,
          category: newGroupCategory,
          privacy: newGroupPrivacy,
          nextMeeting: newGroupMeetingTime,
          moderator: 'Current User'
        }

        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-11376ee3/support-groups`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(groupData)
        })

        if (response.ok) {
          const result = await response.json()
          setSupportGroups(prev => [result.group, ...prev])
        } else {
          // Fallback to local state
          const newGroup: SupportGroup = {
            id: Date.now().toString(),
            name: newGroupName,
            description: newGroupDescription,
            category: newGroupCategory,
            privacy: newGroupPrivacy,
            nextMeeting: newGroupMeetingTime || 'TBD',
            moderator: 'Current User',
            members: 1,
            isActive: true,
            isJoined: true
          }
          setSupportGroups(prev => [newGroup, ...prev])
        }
        
        // Reset form
        setNewGroupName('')
        setNewGroupDescription('')
        setNewGroupCategory('')
        setNewGroupPrivacy('public')
        setNewGroupMeetingTime('')
        setShowCreateGroupForm(false)
      } catch (error) {
        console.error('Failed to create group:', error)
        // Create locally as fallback
        const newGroup: SupportGroup = {
          id: Date.now().toString(),
          name: newGroupName,
          description: newGroupDescription,
          category: newGroupCategory,
          privacy: newGroupPrivacy,
          nextMeeting: newGroupMeetingTime || 'TBD',
          moderator: 'Current User',
          members: 1,
          isActive: true,
          isJoined: true
        }
        setSupportGroups(prev => [newGroup, ...prev])
        
        // Reset form
        setNewGroupName('')
        setNewGroupDescription('')
        setNewGroupCategory('')
        setNewGroupPrivacy('public')
        setNewGroupMeetingTime('')
        setShowCreateGroupForm(false)
      }
    }
  }

  const handleJoinGroup = async (groupId: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-11376ee3/support-groups/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: DEMO_USER_ID })
      })

      if (response.ok) {
        setSupportGroups(prev => prev.map(group => 
          group.id === groupId 
            ? { ...group, isJoined: true, members: group.members + 1 }
            : group
        ))
      } else {
        // Fallback to local state
        setSupportGroups(prev => prev.map(group => 
          group.id === groupId 
            ? { ...group, isJoined: true, members: group.members + 1 }
            : group
        ))
      }
    } catch (error) {
      console.error('Failed to join group:', error)
      // Update local state as fallback
      setSupportGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, isJoined: true, members: group.members + 1 }
          : group
      ))
    }
  }

  const handleLeaveGroup = async (groupId: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-11376ee3/support-groups/${groupId}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: DEMO_USER_ID })
      })

      if (response.ok) {
        setSupportGroups(prev => prev.map(group => 
          group.id === groupId 
            ? { ...group, isJoined: false, members: Math.max(0, group.members - 1) }
            : group
        ))
      } else {
        // Fallback to local state
        setSupportGroups(prev => prev.map(group => 
          group.id === groupId 
            ? { ...group, isJoined: false, members: Math.max(0, group.members - 1) }
            : group
        ))
      }
    } catch (error) {
      console.error('Failed to leave group:', error)
      // Update local state as fallback
      setSupportGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, isJoined: false, members: Math.max(0, group.members - 1) }
          : group
      ))
    }
  }

  const handleViewGroupDetail = (group: SupportGroup) => {
    setSelectedGroup(group)
    setShowGroupDetail(true)
  }

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || categories[categories.length - 1]
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
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
            <div className="text-center py-8">
              <p className="text-gray-600">Discussion functionality available in main component</p>
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            {/* Header with Create Group Button */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Support Groups</h2>
                <p className="text-gray-600 text-sm mt-1">Join moderated groups for focused peer support</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => setShowCreateGroupForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Group
              </Button>
            </div>

            {/* Create Group Form */}
            {showCreateGroupForm && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle>Create New Support Group</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="group-name">Group Name</Label>
                      <Input
                        id="group-name"
                        placeholder="e.g., Academic Burnout Support"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="group-category">Category</Label>
                      <Select value={newGroupCategory} onValueChange={setNewGroupCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="group-description">Description</Label>
                    <Textarea
                      id="group-description"
                      placeholder="Describe the purpose and goals of this support group..."
                      value={newGroupDescription}
                      onChange={(e) => setNewGroupDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="group-privacy">Privacy Setting</Label>
                      <Select value={newGroupPrivacy} onValueChange={(value: 'public' | 'private') => setNewGroupPrivacy(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public - Anyone can join</SelectItem>
                          <SelectItem value="private">Private - Invitation only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="meeting-time">Regular Meeting Time (Optional)</Label>
                      <Input
                        id="meeting-time"
                        placeholder="e.g., Tuesdays 7:00 PM"
                        value={newGroupMeetingTime}
                        onChange={(e) => setNewGroupMeetingTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreateGroup}>
                      Create Group
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowCreateGroupForm(false)
                        setNewGroupName('')
                        setNewGroupDescription('')
                        setNewGroupCategory('')
                        setNewGroupPrivacy('public')
                        setNewGroupMeetingTime('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Support Groups List */}
            <div className="grid gap-4">
              {supportGroups.map(group => {
                const categoryInfo = getCategoryInfo(group.category)
                return (
                  <Card key={group.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium">{group.name}</h3>
                            <Badge className={categoryInfo.color}>
                              {categoryInfo.label}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 max-w-2xl">{group.description}</p>
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {group.members} member{group.members !== 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Next: {group.nextMeeting}
                            </div>
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 mr-1" />
                              {group.moderator}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-4">
                          <Badge 
                            variant={group.privacy === 'public' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {group.privacy === 'public' ? 'Public' : 'Private'}
                          </Badge>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewGroupDetail(group)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            {group.isJoined ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleLeaveGroup(group.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Leave Group
                              </Button>
                            ) : (
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleJoinGroup(group.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Join Group
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {group.isJoined && (
                        <div className="border-t pt-4 mt-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-green-600 font-medium">
                              ✓ You are a member of this group
                            </span>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Group Chat
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Calendar className="h-4 w-4 mr-1" />
                                Schedule Meeting
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {supportGroups.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Support Groups Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Be the first to create a support group for your community
                  </p>
                  <Button onClick={() => setShowCreateGroupForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Group
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="text-center py-8">
              <p className="text-gray-600">Peer resources functionality available in main component</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Group Detail Dialog */}
        {selectedGroup && (
          <Dialog open={showGroupDetail} onOpenChange={setShowGroupDetail}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedGroup.name}
                  <Badge className={getCategoryInfo(selectedGroup.category).color}>
                    {getCategoryInfo(selectedGroup.category).label}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Detailed view of the support group with member management and scheduling
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto space-y-6">
                {/* Group Overview */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h4 className="font-medium mb-2">About This Group</h4>
                    <p className="text-gray-600 text-sm mb-4">{selectedGroup.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Moderator:</span>
                        <p className="text-gray-600">{selectedGroup.moderator}</p>
                      </div>
                      <div>
                        <span className="font-medium">Privacy:</span>
                        <p className="text-gray-600 capitalize">{selectedGroup.privacy}</p>
                      </div>
                      <div>
                        <span className="font-medium">Members:</span>
                        <p className="text-gray-600">{selectedGroup.members} active members</p>
                      </div>
                      <div>
                        <span className="font-medium">Next Meeting:</span>
                        <p className="text-gray-600">{selectedGroup.nextMeeting}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedGroup.isJoined ? (
                      <div className="space-y-2">
                        <Button className="w-full" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Open Group Chat
                        </Button>
                        <Button className="w-full" variant="outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          View Schedule
                        </Button>
                        <Button className="w-full" variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Group Settings
                        </Button>
                        <Separator />
                        <Button 
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" 
                          variant="outline"
                          onClick={() => {
                            handleLeaveGroup(selectedGroup.id)
                            setShowGroupDetail(false)
                          }}
                        >
                          Leave Group
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            handleJoinGroup(selectedGroup.id)
                            setShowGroupDetail(false)
                          }}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Join This Group
                        </Button>
                        <p className="text-xs text-gray-500 text-center">
                          {selectedGroup.privacy === 'private' 
                            ? 'This is a private group. Your request will be reviewed by the moderator.'
                            : 'Join to participate in group discussions and meetings.'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Group Guidelines */}
                <div>
                  <h4 className="font-medium mb-2">Group Guidelines</h4>
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Respect all members and their experiences</li>
                        <li>• Maintain confidentiality of group discussions</li>
                        <li>• Be supportive and non-judgmental</li>
                        <li>• Stay on topic related to the group's focus area</li>
                        <li>• Report any concerning behavior to the moderator</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div>
                  <h4 className="font-medium mb-2">Recent Group Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">New member Alex joined 2 hours ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">Group meeting scheduled for tomorrow</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600">3 new discussion topics this week</span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}