'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown, UserCircle, UserX, MessageCircle } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { confessionApi } from '../api/confessions';
import { toast } from 'react-hot-toast'

interface Reply {
  _id: string
  text: string
  timestamp: string
  isAnonymous: boolean
  author: string | null
}

interface Confession {
  _id: string
  text: string
  likes: number
  dislikes: number
  timestamp: string
  isAnonymous: boolean
  author: string | null
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
  const currentUser = "Student123"
  const [charactersRemaining, setCharactersRemaining] = useState(500)

  useEffect(() => {
    loadConfessions()
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
        const savedConfession = await confessionApi.createConfession(newConfessionData)
        setConfessions([savedConfession, ...confessions])
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
        const savedReply = await confessionApi.addReply(confessionId, replyData)
        
        // Update the confession with the new reply
        setConfessions(confessions.map(confession => {
          if (confession._id === confessionId) {
            return {
              ...confession,
              replies: [...confession.replies, savedReply]
            }
          }
          return confession
        }))
        
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
      const updatedConfession = await confessionApi.likeConfession(id)
      setConfessions(confessions.map(confession =>
        confession._id === id ? updatedConfession : confession
      ))
    } catch (error) {
      toast.error('Failed to like confession')
      console.error('Error liking confession:', error)
    }
  }

  const handleDislike = async (id: string) => {
    try {
      const updatedConfession = await confessionApi.dislikeConfession(id)
      setConfessions(confessions.map(confession =>
        confession._id === id ? updatedConfession : confession
      ))
    } catch (error) {
      toast.error('Failed to dislike confession')
      console.error('Error disliking confession:', error)
    }
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
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(confession._id)}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{confession.likes}</span>
                </Button>
                <Button
                  variant="ghost"
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