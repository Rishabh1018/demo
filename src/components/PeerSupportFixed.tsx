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
  Trash2
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

  const handleSubmitPost = async () => {
    if (newPostTitle.trim() && newPostContent.trim() && newPostCategory) {
      try {
        const postData = {
          userId: DEMO_USER_ID,
          author: isAnonymous ? 'Anonymous' : 'Current User',
          title: newPostTitle,
          content: newPostContent,
          category: newPostCategory,
          tags: newPostTags.split(',').map(tag => tag.trim()).filter(tag => tag),
          isAnonymous
        }

        await api.createPost(postData)
        
        // Reset form
        setNewPostTitle('')
        setNewPostContent('')
        setNewPostCategory('')
        setNewPostTags('')
        setIsAnonymous(false)
        setShowNewPostForm(false)
        
        // Refresh posts
        fetchPosts()
      } catch (error) {
        console.error('Failed to create post:', error)
        // For demo, still add locally
        const newPost: Post = {
          id: Date.now().toString(),
          userId: DEMO_USER_ID,
          author: isAnonymous ? 'Anonymous' : 'Current User',
          avatar: isAnonymous ? '?' : 'CU',
          title: newPostTitle,
          content: newPostContent,
          category: newPostCategory,
          timestamp: new Date().toISOString(),
          likes: 0,
          dislikes: 0,
          replies: 0, // Start with 0 comments
          views: 0,
          isAnonymous,
          tags: newPostTags.split(',').map(tag => tag.trim()).filter(tag => tag),
          status: 'active'
        }
        setPosts(prev => [newPost, ...prev])
        
        // Reset form
        setNewPostTitle('')
        setNewPostContent('')
        setNewPostCategory('')
        setNewPostTags('')
        setIsAnonymous(false)
        setShowNewPostForm(false)
      }
    }
  }

  const handleVotePost = async (postId: string, type: 'like' | 'dislike') => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        if (type === 'like') {
          if (post.isLiked) {
            return { ...post, likes: post.likes - 1, isLiked: false }
          } else {
            return { 
              ...post, 
              likes: post.likes + 1, 
              dislikes: post.isDisliked ? post.dislikes - 1 : post.dislikes,
              isLiked: true, 
              isDisliked: false 
            }
          }
        } else {
          if (post.isDisliked) {
            return { ...post, dislikes: post.dislikes - 1, isDisliked: false }
          } else {
            return { 
              ...post, 
              dislikes: post.dislikes + 1, 
              likes: post.isLiked ? post.likes - 1 : post.likes,
              isDisliked: true, 
              isLiked: false 
            }
          }
        }
      }
      return post
    }))
  }

  const handleViewPost = async (post: Post) => {
    // Increment view count
    setPosts(prev => prev.map(p => 
      p.id === post.id ? { ...p, views: p.views + 1 } : p
    ))
    
    setSelectedPost(post)
    setShowPostDetail(true)
    
    // Load comments for this post from backend
    await loadComments(post.id)
  }

  const loadComments = async (postId: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-11376ee3/posts/${postId}/comments`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        const formattedComments = result.comments.map((comment: any) => ({
          ...comment,
          author: comment.isAnonymous ? 'Anonymous' : (comment.author || 'Student'),
          avatar: comment.isAnonymous ? '?' : (comment.author ? comment.author.substring(0, 2).toUpperCase() : 'ST')
        }))
        
        setComments(prev => ({ ...prev, [postId]: formattedComments }))
        
        // Update the post's reply count to match actual comments
        setPosts(prev => prev.map(post => 
          post.id === postId ? { ...post, replies: formattedComments.length } : post
        ))
      } else {
        // Fallback to sample comments for demo
        loadSampleComments(postId)
      }
    } catch (error) {
      console.error('Failed to load comments:', error)
      // Fallback to sample comments for demo
      loadSampleComments(postId)
    }
  }

  const loadSampleComments = (postId: string) => {
    // If comments are already loaded, don't load again
    if (comments[postId]) {
      return
    }
    
    // For demo purposes, only load sample comments for the first post
    if (postId === '1') {
      const sampleComments: Comment[] = [
        {
          id: '1',
          postId,
          userId: 'user4',
          author: 'Alex T.',
          avatar: 'AT',
          content: 'I completely understand what you\'re going through. What helped me was practicing progressive muscle relaxation and using positive self-talk during exams. Have you tried writing down your anxious thoughts before the exam?',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          likes: 3,
          dislikes: 0,
          isAnonymous: false,
          status: 'active'
        },
        {
          id: '2',
          postId,
          userId: 'user5',
          author: 'Anonymous',
          avatar: '?',
          content: 'Thank you for sharing this. It means a lot to know I\'m not alone. I struggle with the same thing.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          likes: 5,
          dislikes: 0,
          isAnonymous: true,
          status: 'active'
        },
        {
          id: '3',
          postId,
          userId: 'user6',
          author: 'Maria L.',
          avatar: 'ML',
          content: 'I found that doing a 5-minute meditation before exams really helps calm my nerves. There are some great apps for guided meditation. Also, try arriving at the exam location early to get familiar with the environment.',
          timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          likes: 8,
          dislikes: 0,
          isAnonymous: false,
          status: 'active'
        },
        {
          id: '4',
          postId,
          userId: 'user7',
          author: 'Anonymous',
          avatar: '?',
          content: 'What really worked for me was creating a pre-exam routine. I do the same things every time: review key points for 15 minutes, do some stretches, and remind myself that I\'ve prepared well.',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          likes: 12,
          dislikes: 0,
          isAnonymous: true,
          status: 'active'
        },
        {
          id: '5',
          postId,
          userId: 'user8',
          author: 'Jamie K.',
          avatar: 'JK',
          content: 'Have you considered talking to someone at the counseling center? They have specific strategies for test anxiety. Also, make sure you\'re getting enough sleep before exams - being tired makes anxiety so much worse.',
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          likes: 6,
          dislikes: 0,
          isAnonymous: false,
          status: 'active'
        },
        {
          id: '6',
          postId,
          userId: 'user9',
          author: 'Anonymous',
          avatar: '?',
          content: 'I used to have panic attacks during exams. What helped me was learning to focus on my breathing and reminding myself that the physical symptoms are temporary. You\'re not alone in this!',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          likes: 15,
          dislikes: 0,
          isAnonymous: true,
          status: 'active'
        },
        {
          id: '7',
          postId,
          userId: 'user10',
          author: 'Chris R.',
          avatar: 'CR',
          content: 'The counseling center also offers exam anxiety workshops. I attended one last semester and it was incredibly helpful. They teach you specific techniques and you can practice them in a safe environment.',
          timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
          likes: 9,
          dislikes: 0,
          isAnonymous: false,
          status: 'active'
        },
        {
          id: '8',
          postId,
          userId: 'user11',
          author: 'Anonymous',
          avatar: '?',
          content: 'I started using noise-cancelling headphones during study sessions and it made such a difference. Sometimes the environment during exams is overwhelming, so I ask for accommodations now.',
          timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
          likes: 4,
          dislikes: 0,
          isAnonymous: true,
          status: 'active'
        }
      ]
      
      setComments(prev => ({ ...prev, [postId]: sampleComments }))
      
      // Update the post's reply count to match actual comments
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, replies: sampleComments.length } : post
      ))
    } else {
      // For other posts, start with empty comments
      setComments(prev => ({ ...prev, [postId]: [] }))
    }
  }

  const handleSubmitComment = async () => {
    if (newComment.trim() && selectedPost) {
      const commentData = {
        userId: DEMO_USER_ID,
        author: commentAnonymous ? 'Anonymous' : 'Current User',
        content: newComment,
        isAnonymous: commentAnonymous,
        parentId: replyingTo
      }

      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-11376ee3/posts/${selectedPost.id}/comments`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(commentData)
        })
        
        if (response.ok) {
          const result = await response.json()
          const newCommentFormatted = {
            ...result.comment,
            author: result.comment.isAnonymous ? 'Anonymous' : (result.comment.author || 'Current User'),
            avatar: result.comment.isAnonymous ? '?' : 'CU'
          }
          
          // Add to local state
          setComments(prev => ({
            ...prev,
            [selectedPost.id]: [...(prev[selectedPost.id] || []), newCommentFormatted]
          }))
          
          // Update reply count
          setPosts(prev => prev.map(post => 
            post.id === selectedPost.id ? { ...post, replies: post.replies + 1 } : post
          ))
          
          // Refresh comments from backend to ensure consistency
          loadComments(selectedPost.id)
        } else {
          throw new Error('Failed to submit comment')
        }
      } catch (error) {
        console.error('Failed to submit comment:', error)
        
        // Fallback to local state for demo
        const comment: Comment = {
          id: Date.now().toString(),
          postId: selectedPost.id,
          userId: DEMO_USER_ID,
          author: commentAnonymous ? 'Anonymous' : 'Current User',
          avatar: commentAnonymous ? '?' : 'CU',
          content: newComment,
          timestamp: new Date().toISOString(),
          likes: 0,
          dislikes: 0,
          isAnonymous: commentAnonymous,
          parentId: replyingTo,
          status: 'active'
        }
        
        setComments(prev => ({
          ...prev,
          [selectedPost.id]: [...(prev[selectedPost.id] || []), comment]
        }))
        
        // Update reply count
        setPosts(prev => prev.map(post => 
          post.id === selectedPost.id ? { ...post, replies: post.replies + 1 } : post
        ))
      }
      
      setNewComment('')
      setCommentAnonymous(false)
      setReplyingTo(null)
    }
  }

  const handleVoteComment = (commentId: string, type: 'like' | 'dislike') => {
    if (!selectedPost) return
    
    setComments(prev => ({
      ...prev,
      [selectedPost.id]: prev[selectedPost.id]?.map(comment => {
        if (comment.id === commentId) {
          if (type === 'like') {
            if (comment.isLiked) {
              return { ...comment, likes: comment.likes - 1, isLiked: false }
            } else {
              return { 
                ...comment, 
                likes: comment.likes + 1, 
                dislikes: comment.isDisliked ? comment.dislikes - 1 : comment.dislikes,
                isLiked: true, 
                isDisliked: false 
              }
            }
          } else {
            if (comment.isDisliked) {
              return { ...comment, dislikes: comment.dislikes - 1, isDisliked: false }
            } else {
              return { 
                ...comment, 
                dislikes: comment.dislikes + 1, 
                likes: comment.isLiked ? comment.likes - 1 : comment.likes,
                isDisliked: true, 
                isLiked: false 
              }
            }
          }
        }
        return comment
      }) || []
    }))
  }

  const handleReportContent = async () => {
    if (reportTarget && reportReason.trim()) {
      console.log('Reporting:', reportTarget, 'Reason:', reportReason)
      
      // In production, send to moderation queue
      setReportDialogOpen(false)
      setReportReason('')
      setReportTarget(null)
      
      // Show success message (you could use a toast here)
      alert('Content reported successfully. Our moderation team will review it.')
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const isActive = post.status === 'active'
    
    return matchesSearch && matchesCategory && isActive
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.likes + b.replies) - (a.likes + a.replies)
      case 'discussed':
        return b.replies - a.replies
      case 'recent':
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }
  })

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

  // Get actual comment count for display
  const getCommentCount = (postId: string) => {
    return comments[postId]?.length || 0
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
            {/* Search and Filter Bar */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search discussions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="discussed">Most Discussed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Community Discussions ({filteredPosts.length})</h2>
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
                  <div>
                    <Label htmlFor="post-title">Title</Label>
                    <Input
                      id="post-title"
                      placeholder="What's on your mind?"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="post-content">Content</Label>
                    <Textarea
                      id="post-content"
                      placeholder="Share your thoughts, experiences, or questions..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="post-category">Category</Label>
                      <Select value={newPostCategory} onValueChange={setNewPostCategory}>
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
                    <div>
                      <Label htmlFor="post-tags">Tags (comma-separated)</Label>
                      <Input
                        id="post-tags"
                        placeholder="anxiety, stress, help"
                        value={newPostTags}
                        onChange={(e) => setNewPostTags(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous-post"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="anonymous-post" className="text-sm">Post anonymously</Label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowNewPostForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitPost}>
                      Post to Community
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">Loading discussions...</div>
              ) : filteredPosts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No discussions found. Be the first to start a conversation!</p>
                  </CardContent>
                </Card>
              ) : (
                filteredPosts.map(post => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewPost(post)}>
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
                            <span className="text-sm text-gray-500">
                              {formatTimeAgo(post.timestamp)}
                            </span>
                            <Badge className={getCategoryInfo(post.category).color}>
                              {getCategoryInfo(post.category).label}
                            </Badge>
                          </div>
                          <h3 className="font-semibold mb-2">{post.title}</h3>
                          <p className="text-gray-700 mb-3 line-clamp-2">{post.content}</p>
                          
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {post.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {post.likes}
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {getCommentCount(post.id)} replies
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {post.views}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Support Groups</h2>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Request New Group
              </Button>
            </div>

            <div className="grid gap-4">
              {supportGroups.map(group => (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold mb-1">{group.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{group.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {group.members} members
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {group.nextMeeting}
                          </div>
                          <Badge variant={group.privacy === 'public' ? 'default' : 'secondary'}>
                            {group.privacy}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-2">Moderator: {group.moderator}</p>
                        <Button size="sm" variant={group.isJoined ? 'outline' : 'default'}>
                          {group.isJoined ? 'Joined' : 'Join Group'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <h2 className="text-xl font-semibold">Peer Resources</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-600" />
                    Crisis Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-medium text-red-800 mb-1">Emergency: 911</h4>
                      <p className="text-sm text-red-700">For immediate life-threatening situations</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-1">Crisis Text Line: Text HOME to 741741</h4>
                      <p className="text-sm text-blue-700">24/7 crisis support via text message</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-1">Campus Counseling: (555) 123-4567</h4>
                      <p className="text-sm text-green-700">Available 24/7 for students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-pink-600" />
                    Self-Care Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Guided Meditation (5 min)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Heart className="h-4 w-4 mr-2" />
                      Breathing Exercises
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mood Check-in
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Peer Support Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Community Guidelines & Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">How to Get Help</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Use specific tags to find relevant discussions</li>
                      <li>• Join support groups that match your interests</li>
                      <li>• Ask questions - everyone is here to help</li>
                      <li>• Share your experiences to help others</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Community Standards</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Be respectful and kind to all members</li>
                      <li>• Maintain confidentiality and privacy</li>
                      <li>• Report concerning or inappropriate content</li>
                      <li>• Seek professional help for crisis situations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Post Detail Dialog with Enhanced Scrolling */}
        {selectedPost && (
          <Dialog open={showPostDetail} onOpenChange={setShowPostDetail}>
            <DialogContent className="max-w-5xl h-[95vh] flex flex-col p-0">
              <DialogHeader className="flex-shrink-0 p-6 pb-0">
                <DialogTitle>Discussion Details</DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Compact Post Details Section */}
                <div className="flex-shrink-0 px-6 py-3 border-b border-gray-100">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={selectedPost.isAnonymous ? 'bg-gray-200' : 'bg-blue-100'}>
                        {selectedPost.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{selectedPost.author}</span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(selectedPost.timestamp)}
                        </span>
                        <Badge className={`${getCategoryInfo(selectedPost.category).color} text-xs px-2 py-0.5`}>
                          {getCategoryInfo(selectedPost.category).label}
                        </Badge>
                      </div>
                      <h2 className="text-lg font-semibold mb-2 line-clamp-2">{selectedPost.title}</h2>
                      <p className="text-gray-700 text-sm mb-2 line-clamp-3">{selectedPost.content}</p>
                      
                      {selectedPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {selectedPost.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5">
                              #{tag}
                            </Badge>
                          ))}
                          {selectedPost.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                              +{selectedPost.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`text-gray-500 h-7 px-2 ${selectedPost.isLiked ? 'text-green-600' : ''}`}
                          onClick={() => handleVotePost(selectedPost.id, 'like')}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {selectedPost.likes}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`text-gray-500 h-7 px-2 ${selectedPost.isDisliked ? 'text-red-600' : ''}`}
                          onClick={() => handleVotePost(selectedPost.id, 'dislike')}
                        >
                          <ThumbsDown className="h-3 w-3 mr-1" />
                          {selectedPost.dislikes}
                        </Button>
                        <div className="flex items-center text-xs text-gray-500">
                          <Eye className="h-3 w-3 mr-1" />
                          {selectedPost.views}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Comments Section */}
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Comments Header */}
                  <div className="flex-shrink-0 px-6 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        Comments ({comments[selectedPost.id]?.length || 0})
                      </h3>
                      {comments[selectedPost.id]?.length > 3 && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          Scroll to see all comments
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Scrollable Comments */}
                  <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto comments-scroll px-6">
                      <div className="space-y-4 py-4">
                        {comments[selectedPost.id]?.length === 0 ? (
                          <div className="text-center py-12">
                            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">
                              No comments yet. Be the first to share your thoughts!
                            </p>
                          </div>
                        ) : (
                          comments[selectedPost.id]?.map(comment => (
                            <div key={comment.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className={comment.isAnonymous ? 'bg-gray-200' : 'bg-blue-100'}>
                                  {comment.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-sm">{comment.author}</span>
                                  <span className="text-xs text-gray-500">
                                    {formatTimeAgo(comment.timestamp)}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className={`text-gray-400 h-6 px-2 text-xs ${comment.isLiked ? 'text-green-600' : ''}`}
                                    onClick={() => handleVoteComment(comment.id, 'like')}
                                  >
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    {comment.likes}
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className={`text-gray-400 h-6 px-2 text-xs ${comment.isDisliked ? 'text-red-600' : ''}`}
                                    onClick={() => handleVoteComment(comment.id, 'dislike')}
                                  >
                                    <ThumbsDown className="h-3 w-3 mr-1" />
                                    {comment.dislikes}
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-gray-400 h-6 px-2 text-xs"
                                    onClick={() => setReplyingTo(comment.id)}
                                  >
                                    <Reply className="h-3 w-3 mr-1" />
                                    Reply
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-gray-400 h-6 px-2 text-xs"
                                    onClick={() => {
                                      setReportTarget({type: 'comment', id: comment.id})
                                      setReportDialogOpen(true)
                                    }}
                                  >
                                    <Flag className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment Input - Fixed at Bottom */}
                <div className="flex-shrink-0 border-t border-gray-200 p-6">
                  {replyingTo && (
                    <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
                      <span className="text-sm text-blue-700">
                        Replying to {comments[selectedPost.id]?.find(c => c.id === replyingTo)?.author}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setReplyingTo(null)}
                        className="ml-2 h-6 px-2 text-blue-600"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Share your thoughts or support..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="comment-anonymous"
                          checked={commentAnonymous}
                          onChange={(e) => setCommentAnonymous(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="comment-anonymous" className="text-sm">Comment anonymously</Label>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setNewComment('')
                            setCommentAnonymous(false)
                            setReplyingTo(null)
                          }}
                        >
                          Clear
                        </Button>
                        <Button size="sm" onClick={handleSubmitComment}>
                          <Send className="h-4 w-4 mr-2" />
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Report Dialog */}
        <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report Content</DialogTitle>
              <DialogDescription>
                Help us maintain a safe community by reporting inappropriate content.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="report-reason">Reason for reporting</Label>
                <Select value={reportReason} onValueChange={setReportReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inappropriate">Inappropriate content</SelectItem>
                    <SelectItem value="spam">Spam</SelectItem>
                    <SelectItem value="harassment">Harassment</SelectItem>
                    <SelectItem value="misinformation">Misinformation</SelectItem>
                    <SelectItem value="crisis">Crisis situation - needs immediate attention</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleReportContent}>
                  Submit Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}