'use client'
import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown, UserCircle, UserX, MessageCircle } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { confessionApi } from '../api/confessions'
import { toast } from 'react-hot-toast'
import { io, Socket } from 'socket.io-client'


interface Reply {
  _id: string
  text: string
  timestamp: string
  isAnonymous: boolean
  author: string | null
  userId: string
}

interface Confession {
  _id: string
  text: string
  likes: number
  dislikes: number
  timestamp: string
  isAnonymous: boolean
  author: string | null
  userId: string
  likedBy: string[]
  dislikedBy: string[]
  replies: Reply[]
}

export default function ConfessionsPage() {
  const [confessions, setConfessions] = useState<Confession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newConfession, setNewConfession] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [replyText, setReplyText] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [isReplyAnonymous, setIsReplyAnonymous] = useState(true)
  const socketRef = useRef<Socket | null>(null)
  const currentUser = "Student123"
  const [charactersRemaining, setCharactersRemaining] = useState(500)
  const [userId, setUserId] = useState<string>("")
  
  useEffect(() => {
    // Get or generate user ID
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      setUserId(storedUserId)
    } else {
      const newUserId = 'user_' + Math.random().toString(36).substring(2, 15)
      localStorage.setItem('userId', newUserId)
      setUserId(newUserId)
    }
    
    // Connect to socket server
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
    socketRef.current = socket
    
    // Socket event listeners
    socket.on('connect', () => {
      console.log('Connected to WebSocket server')
    })
    
    socket.on('newConfession', (confession: Confession) => {
      setConfessions(prevConfessions => [confession, ...prevConfessions])
    })
    
    socket.on('confessionUpdated', (updatedConfession: Confession) => {
      setConfessions(prevConfessions => 
        prevConfessions.map(confession => 
          confession._id === updatedConfession._id ? updatedConfession : confession
        )
      )
    })
    
    socket.on('newReply', ({ confessionId, reply }: { confessionId: string, reply: Reply }) => {
      setConfessions(prevConfessions => 
        prevConfessions.map(confession => {
          if (confession._id === confessionId) {
            return {
              ...confession,
              replies: [...confession.replies, reply]
            }
          }
          return confession
        })
      )
    })
    
    // Load initial confessions
    loadConfessions()
    
    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])
  
  const loadConfessions = async () => {
    try {
      setIsLoading(true)
      const data = await confessionApi.getAllConfessions()
      setConfessions(data)
    } catch (error) {
      toast.error('Failed to load confessions')
      console.error('Error loading confessions:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newConfession.trim()) {
      try {
        const newConfessionData = {
          text: newConfession,
          isAnonymous,
          author: isAnonymous ? null : currentUser
        }
        await confessionApi.createConfession(newConfessionData)
        // The new confession will be added via the WebSocket
        setNewConfession("")
        setCharactersRemaining(500)
        toast.success('Confession posted successfully!')
      } catch (error) {
        toast.error('Failed to post confession')
        console.error('Error posting confession:', error)
      }
    }
  }
  
  const handleReplySubmit = async (confessionId: string) => {
    if (replyText.trim()) {
      try {
        const replyData = {
          text: replyText,
          isAnonymous: isReplyAnonymous,
          author: isReplyAnonymous ? null : currentUser
        }
        await confessionApi.addReply(confessionId, replyData)
        // The new reply will be added via the WebSocket
        setReplyText("")
        setReplyingTo(null)
        toast.success('Reply posted successfully!')
      } catch (error) {
        toast.error('Failed to post reply')
        console.error('Error posting reply:', error)
      }
    }
  }
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= 500) {
      setNewConfession(text)
      setCharactersRemaining(500 - text.length)
    }
  }
  
  const handleLike = async (id: string) => {
    try {
      await confessionApi.likeConfession(id)
      // The updated confession will be received via WebSocket
    } catch (error) {
      toast.error('Failed to like confession')
      console.error('Error liking confession:', error)
    }
  }
  
  const handleDislike = async (id: string) => {
    try {
      await confessionApi.dislikeConfession(id)
      // The updated confession will be received via WebSocket
    } catch (error) {
      toast.error('Failed to dislike confession')
      console.error('Error disliking confession:', error)
    }
  }
  
  const isLikedByUser = (confession: Confession) => {
    return confession.likedBy.includes(userId)
  }
  
  const isDislikedByUser = (confession: Confession) => {
    return confession.dislikedBy.includes(userId)
  }
  
  if (isLoading) {
    return <div className="text-center p-6">Loading confessions...</div>
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Public Confessions</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 relative">
              <Textarea
                placeholder="Share your confession..."
                value={newConfession}
                onChange={handleTextChange}
                className="min-h-[100px]"
              />
              <div className="absolute bottom-2 right-2 text-sm text-muted-foreground">
                {charactersRemaining} characters remaining
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                  id="anonymous-mode"
                />
                <label
                  htmlFor="anonymous-mode"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Submit Anonymously
                </label>
              </div>
              <Button type="submit">
                Submit Confession
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Recent Confessions</h2>
      <div className="space-y-4">
        {confessions.map((confession) => (
          <Card key={confession._id}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                {confession.isAnonymous ? (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <UserX className="h-4 w-4" />
                    <span className="text-sm">Anonymous User</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-primary">
                    <UserCircle className="h-4 w-4" />
                    <span className="text-sm">{confession.author}</span>
                  </div>
                )}
                <span className="text-sm text-muted-foreground ml-auto">
                  {new Date(confession.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="mb-4">{confession.text}</p>
              <div className="flex items-center gap-4">
                <Button
                  variant={isLikedByUser(confession) ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleLike(confession._id)}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{confession.likes}</span>
                </Button>
                <Button
                  variant={isDislikedByUser(confession) ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleDislike(confession._id)}
                  className="flex items-center gap-2"
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>{confession.dislikes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(replyingTo === confession._id ? null : confession._id)}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Reply</span>
                </Button>
              </div>
              {/* Reply Form */}
              {replyingTo === confession._id && (
                <div className="mt-4 pl-4 border-l-2">
                  <div className="mb-4">
                    <Textarea
                      placeholder="Write your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={isReplyAnonymous}
                        onCheckedChange={setIsReplyAnonymous}
                        id={`reply-anonymous-${confession._id}`}
                      />
                      <label
                        htmlFor={`reply-anonymous-${confession._id}`}
                        className="text-sm font-medium"
                      >
                        Reply Anonymously
                      </label>
                    </div>
                    <Button
                      onClick={() => handleReplySubmit(confession._id)}
                      size="sm"
                    >
                      Submit Reply
                    </Button>
                  </div>
                </div>
              )}
              {/* Replies List */}
              {confession.replies.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 space-y-3">
                  {confession.replies.map((reply) => (
                    <div key={reply._id} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-1">
                        {reply.isAnonymous ? (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <UserX className="h-4 w-4" />
                            <span className="text-sm">Anonymous User</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-primary">
                            <UserCircle className="h-4 w-4" />
                            <span className="text-sm">{reply.author}</span>
                          </div>
                        )}
                        <span className="text-sm text-muted-foreground ml-auto">
                          {new Date(reply.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}