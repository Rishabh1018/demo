import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Bot, User, Send, AlertTriangle, Heart, Phone } from 'lucide-react'
import { api, DEMO_USER_ID } from '../utils/api'
import { BreathingExercise } from './BreathingExercise'

interface Message {
  id: number
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  severity?: 'low' | 'medium' | 'high'
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm Sukoon, your AI mental health support assistant. I'm here to listen and provide coping strategies. How are you feeling today?",
      timestamp: new Date(),
      severity: 'low'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showBreathingExercise, setShowBreathingExercise] = useState(false)
  const [breathingTechnique, setBreathingTechnique] = useState<'4-7-8' | 'box' | 'triangle' | 'simple'>('4-7-8')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const copingStrategies = [
    "Try the 4-7-8 breathing technique: Inhale for 4 counts, hold for 7, exhale for 8",
    "Practice grounding: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste",
    "Take a 5-minute mindful walk, focusing on your steps and surroundings",
    "Write down three things you're grateful for today",
    "Try progressive muscle relaxation: tense and release each muscle group"
  ]

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'can\'t go on']
  const stressKeywords = ['stressed', 'anxious', 'overwhelmed', 'panic', 'worried']
  const depressionKeywords = ['sad', 'depressed', 'hopeless', 'empty', 'worthless']

  const generateResponse = (userMessage: string): { content: string; severity: 'low' | 'medium' | 'high' } => {
    const message = userMessage.toLowerCase()
    
    // Crisis detection
    if (crisisKeywords.some(keyword => message.includes(keyword))) {
      return {
        content: "I'm very concerned about what you've shared. Your safety is the most important thing right now. Please reach out to a crisis counselor immediately:\n\n• Campus Counseling Center: (555) 123-HELP\n• Crisis Text Line: Text HOME to 741741\n• National Suicide Prevention Lifeline: 988\n\nYou don't have to go through this alone. There are people who want to help you right now.",
        severity: 'high'
      }
    }
    
    // Stress/anxiety response
    if (stressKeywords.some(keyword => message.includes(keyword))) {
      const strategy = copingStrategies[Math.floor(Math.random() * copingStrategies.length)]
      return {
        content: `I hear that you're feeling stressed or anxious. That's completely understandable, especially during college. Here's a technique that might help:\n\n${strategy}\n\nWould you like me to guide you through a breathing exercise? I can start one for you right now, or we can talk about what's causing these feelings.`,
        severity: 'medium'
      }
    }
    
    // Depression response
    if (depressionKeywords.some(keyword => message.includes(keyword))) {
      return {
        content: "I'm sorry you're feeling this way. Depression can make everything feel more difficult, and it's brave of you to reach out. Remember that these feelings are temporary, even when they don't feel that way.\n\nSome things that might help:\n• Reaching out to a friend or family member\n• Engaging in a small activity you used to enjoy\n• Getting some sunlight or fresh air\n• Talking to a counselor\n\nWould you like to book a session with one of our campus counselors?",
        severity: 'medium'
      }
    }
    
    // General supportive responses
    const responses = [
      "Thank you for sharing that with me. It takes courage to talk about how you're feeling. Can you tell me more about what's been on your mind?",
      "I appreciate you trusting me with this. Everyone's experience is valid, and I'm here to support you. What would be most helpful for you right now?",
      "It sounds like you're going through a challenging time. That's completely normal, and you're not alone in feeling this way. How can I best support you today?"
    ]
    
    return {
      content: responses[Math.floor(Math.random() * responses.length)],
      severity: 'low'
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    const currentInput = inputMessage.trim()
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Check for breathing exercise requests
    const breathingKeywords = ['breathing', 'breath', 'breathe', 'calm down', 'relax', 'anxiety exercise']
    const isBreathingRequest = breathingKeywords.some(keyword => 
      currentInput.toLowerCase().includes(keyword)
    )

    // Simulate AI response delay
    setTimeout(async () => {
      let { content, severity } = generateResponse(currentInput)
      
      // Add breathing exercise suggestion for relevant requests
      if (isBreathingRequest || severity === 'medium') {
        content += "\n\n🫁 Would you like to try a guided breathing exercise? I can start a calming breathing session for you right now. Just click the 'Breathing Exercise' button below or ask me to 'start breathing exercise'."
      }

      const botMessage: Message = {
        id: messages.length + 2,
        type: 'bot',
        content,
        timestamp: new Date(),
        severity
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)

      // Auto-start breathing exercise if specifically requested
      if (currentInput.toLowerCase().includes('start breathing') || 
          currentInput.toLowerCase().includes('breathing exercise')) {
        setTimeout(() => {
          setBreathingTechnique('4-7-8')
          setShowBreathingExercise(true)
        }, 1000)
      }

      // Save chat session to backend
      try {
        await api.saveChatSession(DEMO_USER_ID, currentInput, severity)
      } catch (error) {
        console.error('Failed to save chat session:', error)
      }
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const startBreathingExercise = (technique: '4-7-8' | 'box' | 'triangle' | 'simple' = '4-7-8') => {
    setBreathingTechnique(technique)
    setShowBreathingExercise(true)
    
    // Add a message to the chat
    const botMessage: Message = {
      id: messages.length + 1,
      type: 'bot',
      content: `Starting a ${technique === '4-7-8' ? '4-7-8' : technique === 'box' ? 'Box Breathing' : technique === 'triangle' ? 'Triangle Breathing' : 'Simple Deep Breathing'} exercise for you. Take your time and focus on your breath. This will help you feel more calm and centered.`,
      timestamp: new Date(),
      severity: 'low'
    }
    setMessages(prev => [...prev, botMessage])
  }

  const handleBreathingExerciseClose = () => {
    setShowBreathingExercise(false)
    
    // Add completion message
    const botMessage: Message = {
      id: messages.length + 1,
      type: 'bot',
      content: "How do you feel after that breathing exercise? Remember, you can practice these techniques anytime you need to find your center. Is there anything else I can help you with today?",
      timestamp: new Date(),
      severity: 'low'
    }
    setMessages(prev => [...prev, botMessage])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      {/* Breathing Exercise Modal */}
      {showBreathingExercise && (
        <BreathingExercise 
          technique={breathingTechnique}
          onClose={handleBreathingExerciseClose}
        />
      )}
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Sukoon - AI Mental Health Support</h1>
          <p className="text-sm md:text-base text-gray-600">24/7 confidential support and coping strategies - Set your mind free</p>
        </div>

        <Card className="h-[calc(100vh-280px)] md:h-[600px] flex flex-col">
          <CardHeader className="border-b p-3 md:p-6">
            <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
              <Bot className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
              <span>Sukoon</span>
              <Badge variant="outline" className="ml-auto text-xs">Online</Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 min-h-0 scroll-smooth chat-messages">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 md:space-x-3 max-w-[85%] md:max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`p-1.5 md:p-2 rounded-full flex-shrink-0 ${message.type === 'user' ? 'bg-blue-500' : 'bg-gray-200'}`}>
                      {message.type === 'user' ? (
                        <User className="h-3 w-3 md:h-4 md:w-4 text-white" />
                      ) : (
                        <Bot className="h-3 w-3 md:h-4 md:w-4 text-gray-600" />
                      )}
                    </div>
                    <div className={`p-2 md:p-3 rounded-lg text-sm md:text-base ${
                      message.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : message.severity === 'high'
                        ? 'bg-red-100 border border-red-200'
                        : message.severity === 'medium'
                        ? 'bg-yellow-100 border border-yellow-200'
                        : 'bg-gray-100'
                    }`}>
                      <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 md:mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <div className="p-1.5 md:p-2 rounded-full bg-gray-200 flex-shrink-0">
                      <Bot className="h-3 w-3 md:h-4 md:w-4 text-gray-600" />
                    </div>
                    <div className="p-2 md:p-3 rounded-lg bg-gray-100">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>

            {/* Crisis Alert */}


            {/* Input */}
            <div className="border-t p-3 md:p-4">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here... Everything you share is confidential."
                  className="flex-1 text-sm md:text-base"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!inputMessage.trim()}
                  size="sm"
                  className="px-3 py-2"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Help */}
        <div className="mt-4 md:mt-6 space-y-4">
          {/* Main Help Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => startBreathingExercise('4-7-8')}
            >
              <CardContent className="p-3 md:p-4 text-center">
                <Heart className="h-6 w-6 md:h-8 md:w-8 text-red-500 mx-auto mb-2" />
                <h3 className="text-sm md:text-base font-semibold">Breathing Exercise</h3>
                <p className="text-xs md:text-sm text-gray-600 mb-2">Guided breathing for anxiety</p>
                <Badge variant="secondary" className="text-xs">Click to start</Badge>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                window.open('tel:8448-8448-45', '_self')
              }}
            >
              <CardContent className="p-3 md:p-4 text-center">
                <Phone className="h-6 w-6 md:h-8 md:w-8 text-green-500 mx-auto mb-2" />
                <h3 className="text-sm md:text-base font-semibold">Crisis Hotline</h3>
                <p className="text-xs md:text-sm text-gray-600 mb-2">24/7 professional support</p>
                <Badge variant="secondary" className="text-xs">Call 8448-8448-45</Badge>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
              <CardContent className="p-3 md:p-4 text-center">
                <Bot className="h-6 w-6 md:h-8 md:w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="text-sm md:text-base font-semibold">Self-Help Tools</h3>
                <p className="text-xs md:text-sm text-gray-600 mb-2">Coping strategies & exercises</p>
                <Badge variant="secondary" className="text-xs">Coming soon</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Quick Breathing Options */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 px-1">Quick Breathing Exercises:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => startBreathingExercise('4-7-8')}
                className="text-xs h-8"
              >
                4-7-8 Breathing
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => startBreathingExercise('box')}
                className="text-xs h-8"
              >
                Box Breathing
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => startBreathingExercise('triangle')}
                className="text-xs h-8"
              >
                Triangle Breathing
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => startBreathingExercise('simple')}
                className="text-xs h-8"
              >
                Simple Breathing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}