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
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

// Helper function for consistent date formatting
const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0] + ' ' + 
         date.toISOString().split('T')[1].substring(0, 8);
};

export default function ConfessionsPage() {
  const [confessions, setConfessions] = useState<Confession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newConfession, setNewConfession] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [replyText, setReplyText] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [showRepliesFor, setShowRepliesFor] = useState<string | null>(null)
  const [isReplyAnonymous, setIsReplyAnonymous] = useState(true)
  const socketRef = useRef<Socket | null>(null)
  const currentUser = "Student123"
  const [charactersRemaining, setCharactersRemaining] = useState(500)
  const [userId, setUserId] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [moderationError, setModerationError] = useState<string | null>(null);
  const [moderationReason, setModerationReason] = useState<string | null>(null);
  const [replyModerationError, setReplyModerationError] = useState<string | null>(null);
  const [replyModerationReason, setReplyModerationReason] = useState<string | null>(null);


  
  // useEffect for set client-side state
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  useEffect(() => {
    if (!isClient) return;
    
    // Get user ID safely
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      setUserId(storedUserId)
    } else {
      // more stable ID generation method
      const newUserId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5)
      localStorage.setItem('userId', newUserId)
      setUserId(newUserId)
    }
    
    // Connect to socket server
    const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const socket = io(socketUrl);
    socketRef.current = socket
    
    // Socket event listeners
    socket.on('connect', () => {
      console.log('Connected to WebSocket server')
    })
    
    socket.on('newConfession', (confession: Confession) => {
      setConfessions(prevConfessions => [confession, ...prevConfessions]) // Add new confession to the top
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
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [isClient])
  
  const loadConfessions = async () => {
    try {
      setIsLoading(true)
      const data = await confessionApi.getAllConfessions()
      console.log("API response:", data);
      setConfessions(data || []);
    } catch (error) {
      toast.error('Failed to load confessions')
      console.error('Error loading confessions:', error)
      setConfessions([]);
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModerationError(null);
    setModerationReason(null);
    
    if (newConfession.trim()) {
      try {
        const newConfessionData = {
          text: newConfession,
          isAnonymous,
          author: isAnonymous ? null : currentUser
        };
        const response = await confessionApi.createConfession(newConfessionData);
        
        // Emit the new confession to WebSocket for others to see
        socketRef.current?.emit('newConfession', response.data);
        
        setNewConfession("");
        setCharactersRemaining(500);
        toast.success('Confession posted successfully!');
      } catch (error: any) {
        if (error.response && error.response.data) {
          // Handle moderation errors
          setModerationError(error.response.data.message || 'Failed to post confession');
          setModerationReason(error.response.data.reason || null);
          toast.error('Content moderation issue');
        } else {
          toast.error('Failed to post confession');
          console.error('Error posting confession:', error);
        }
      }
    }
  };
  
  const handleReplySubmit = async (confessionId: string) => {
    if (!replyText.trim()) return;
  
    setReplyModerationError(null);
    setReplyModerationReason(null);
  
    try {
      const replyData = {
        text: replyText,
        isAnonymous: isReplyAnonymous,
        author: isReplyAnonymous ? null : currentUser,
      };
  
      const response = await confessionApi.addReply(confessionId, replyData);
  
      if (response.status === 200) {
        // Emit the new reply for real-time updates
        socketRef.current?.emit('newReply', { confessionId, reply: response.data });
        setReplyText("");
        toast.success("Reply posted successfully!");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        // Handle moderation errors for replies
        const errorMessage = error.response.data.message || "Failed to post reply";
        const errorReason = error.response.data.reason || "Inappropriate content";
  
        toast.error(errorMessage);
        setReplyModerationError(errorMessage);
        setReplyModerationReason(errorReason);
      } else {
        toast.error("Failed to post reply");
        console.error("Error posting reply:", error);
      }
    }
  };
  
  
  
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
      socketRef.current?.emit('confessionUpdated', { confessionId: id, type: 'like' }) // Emit updated state for all clients
      // Update the local state of the confession
      setConfessions(prevConfessions => prevConfessions.map(confession => 
        confession._id === id ? { ...confession, likes: confession.likes + 1 } : confession
      ));
    } catch (error) {
      toast.error('Failed to like confession');
      console.error('Error liking confession:', error);
    }
  }
  
  const handleDislike = async (id: string) => {
    try {
      await confessionApi.dislikeConfession(id)
      socketRef.current?.emit('confessionUpdated', { confessionId: id, type: 'dislike' }) // Emit updated state for all clients
      // Update the local state of the confession
      setConfessions(prevConfessions => prevConfessions.map(confession => 
        confession._id === id ? { ...confession, dislikes: confession.dislikes + 1 } : confession
      ));
    } catch (error) {
      toast.error('Failed to dislike confession');
      console.error('Error disliking confession:', error);
    }
  }
  
  const isLikedByUser = (confession: Confession) => {
    return confession.likedBy.includes(userId)
  }
  
  const isDislikedByUser = (confession: Confession) => {
    return confession.dislikedBy.includes(userId)
  }
  
  const toggleReplySection = (confessionId: string) => {
    if (replyingTo === confessionId) {
      setReplyingTo(null)
    } else {
      setReplyingTo(confessionId)
    }
    
    setShowRepliesFor(showRepliesFor === confessionId ? null : confessionId)
  }
  
  // During SSR or loading, show a simple loading message
  if (!isClient || isLoading) {
    return <div className="bg-blue-50 min-h-screen font-mono">
      <div className="max-w-4xl mx-auto relative z-10 py-8 px-4">
        <div className="text-blue-900">Loading confessions...</div>
      </div>
    </div>
  }
  
  return (
    <div className="bg-blue-50 min-h-screen font-mono">
      <div className="max-w-4xl mx-auto relative z-10 py-8 px-4">
        <Card className="mb-8 border-blue-200 shadow-md">
          <CardHeader className="border-b border-blue-100">
            <CardTitle className="text-blue-900">Public Confessions</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4 relative">
                <Textarea
                  placeholder="Share your thoughts anonymously..."
                  value={newConfession}
                  onChange={handleTextChange}
                  className="min-h-[120px] border-blue-200 focus:border-blue-400 focus:ring-blue-300"
                />
                <div className="absolute bottom-2 right-2 text-sm text-blue-400">
                  {charactersRemaining} characters remaining
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                    id="anonymous-mode"
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <label
                    htmlFor="anonymous-mode"
                    className="text-sm font-medium text-blue-800 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Submit Anonymously
                  </label>
                </div>
                <Button type="submit" className="bg-blue-700 hover:bg-blue-800">
                  Submit Confession
                </Button>
              </div>
            </form>
            
            {moderationError && (
              <Alert variant="destructive" className="mt-4 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Reply Rejected</AlertTitle>
                <AlertDescription>
                  {moderationError}
                  {moderationReason && (
                    <div className="mt-2 text-sm opacity-80">
                      Reason: {moderationReason}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

          </CardContent>
        </Card>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-900">Recent Confessions</h2>
        
        <div className="space-y-4">
          {confessions && confessions.length > 0 ? confessions.map((confession) => (
            <Card key={confession._id} className="border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  {confession.isAnonymous ? (
                    <div className="flex items-center gap-1 text-blue-600">
                      <UserX className="h-4 w-4" />
                      <span className="text-sm">Anonymous User</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-blue-800">
                      <UserCircle className="h-4 w-4" />
                      <span className="text-sm">{confession.author}</span>
                    </div>
                  )}
                  <span className="text-sm text-blue-400 ml-auto">
                    {formatDate(confession.timestamp)}
                  </span>
                </div>
                
                <p className="mb-4 text-blue-900">{confession.text}</p>
                
                <div className="flex items-center gap-4">
                  <Button
                    variant={isLikedByUser(confession) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleLike(confession._id)}
                    className={`flex items-center gap-2 ${isLikedByUser(confession) ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'text-blue-800 hover:text-blue-900 hover:bg-blue-100'}`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{confession.likes}</span>
                  </Button>
                  
                  <Button
                    variant={isDislikedByUser(confession) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleDislike(confession._id)}
                    className={`flex items-center gap-2 ${isDislikedByUser(confession) ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'text-blue-800 hover:text-blue-900 hover:bg-blue-100'}`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>{confession.dislikes}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleReplySection(confession._id)}
                    className="flex items-center gap-2 text-blue-800 hover:text-blue-900 hover:bg-blue-100"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Reply{confession.replies && confession.replies.length > 0 ? ` (${confession.replies.length})` : ""}</span>
                  </Button>
                </div>
                
                {/* Reply Form */}
                {replyingTo === confession._id && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-200">
                    <div className="mb-4">
                    <Textarea
                      placeholder="Add a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[100px] border-blue-200 focus:border-blue-400 focus:ring-blue-300"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={isReplyAnonymous}
                          onCheckedChange={setIsReplyAnonymous}
                          id="reply-anonymous"
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <label
                          htmlFor="reply-anonymous"
                          className="text-sm font-medium text-blue-800 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Submit Anonymously
                        </label>
                      </div>
                      <Button onClick={() => handleReplySubmit(confession._id)} className="bg-blue-700 hover:bg-blue-800">
                        Submit Reply
                      </Button>
                    </div>
                    
                    {replyModerationError && (
                      <Alert variant="destructive" className="mt-4 bg-red-50 border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Reply Rejected</AlertTitle>
                        <AlertDescription>
                          {replyModerationError}
                          {replyModerationReason && (
                            <div className="mt-2 text-sm opacity-80">
                              Reason: {replyModerationReason}
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                      )}

                    </div>
                  </div>
                )}
                
                {/* Replies List */}
                {showRepliesFor === confession._id && confession.replies && confession.replies.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-200 space-y-3">
                    <h4 className="font-medium text-sm mb-2 text-blue-800">Replies ({confession.replies.length})</h4>
                    {confession.replies.map((reply) => (
                      <div key={reply._id} className="bg-blue-50 p-3 rounded-md border border-blue-100">
                        <div className="flex items-center gap-2 mb-1">
                          {reply.isAnonymous ? (
                            <div className="flex items-center gap-1 text-blue-600">
                              <UserX className="h-4 w-4" />
                              <span className="text-sm">Anonymous User</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-blue-800">
                              <UserCircle className="h-4 w-4" />
                              <span className="text-sm">{reply.author}</span>
                            </div>
                          )}
                          <span className="text-sm text-blue-400 ml-auto">
                            {formatDate(reply.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-blue-900">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )) : (
            <div className="text-center p-6 bg-white rounded-lg shadow border border-blue-100 text-blue-800">
              No confessions yet. Be the first to share!
            </div>
          )}
          <h2></h2>
        </div>
      </div>
    </div>
  )
}