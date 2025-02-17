'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown, UserCircle, UserX, MessageCircle } from 'lucide-react'
import { Switch } from "@/components/ui/switch"

interface Reply {
  id: number
  text: string
  author: string | null
  isAnonymous: boolean
  time: string
}

interface Confession {
  id: number
  text: string
  likes: number
  dislikes: number
  time: string
  isAnonymous: boolean
  author: string | null
  replies: Reply[]
}

export default function ConfessionsPage() {
  const [confessions, setConfessions] = useState<Confession[]>([
    {
      id: 1,
      text: "I've been procrastinating on my assignments and now I'm really behind.",
      likes: 5,
      dislikes: 2,
      time: "2 hours ago",
      isAnonymous: false,
      author: "Student123",
      replies: [
        {
          id: 1,
          text: "Don't worry, we've all been there. Try breaking down your tasks into smaller chunks.",
          author: "Helper1",
          isAnonymous: false,
          time: "1 hour ago"
        }
      ]
    },
    {
      id: 2,
      text: "I'm afraid I chose the wrong major but I'm too far in to change now.",
      likes: 12,
      dislikes: 1,
      time: "5 hours ago",
      isAnonymous: true,
      author: null,
      replies: []
    },
    {
      id: 3,
      text: "I cheated on a test and I feel terrible about it.",
      likes: 3,
      dislikes: 10,
      time: "1 day ago",
      isAnonymous: true,
      author: null,
      replies: []
    },
  ])

  const [newConfession, setNewConfession] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({})
  const [showReplyBox, setShowReplyBox] = useState<{ [key: number]: boolean }>({})
  const [isReplyAnonymous, setIsReplyAnonymous] = useState<{ [key: number]: boolean }>({})
  const currentUser = "Student123"
  const [charactersRemaining, setCharactersRemaining] = useState(500)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newConfession.trim()) {
      setConfessions([
        {
          id: confessions.length + 1,
          text: newConfession,
          likes: 0,
          dislikes: 0,
          time: "Just now",
          isAnonymous: isAnonymous,
          author: isAnonymous ? null : currentUser,
          replies: []
        },
        ...confessions
      ])
      setNewConfession("")
      setCharactersRemaining(500)
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= 500) {
      setNewConfession(text)
      setCharactersRemaining(500 - text.length)
    }
  }

  const handleLike = (id: number) => {
    setConfessions(confessions.map(confession =>
      confession.id === id
        ? { ...confession, likes: confession.likes + 1 }
        : confession
    ))
  }

  const handleDislike = (id: number) => {
    setConfessions(confessions.map(confession =>
      confession.id === id
        ? { ...confession, dislikes: confession.dislikes + 1 }
        : confession
    ))
  }

  const toggleReplyBox = (confessionId: number) => {
    setShowReplyBox(prev => ({
      ...prev,
      [confessionId]: !prev[confessionId]
    }))
  }

  const handleReply = (confessionId: number) => {
    if (replyText[confessionId]?.trim()) {
      setConfessions(confessions.map(confession =>
        confession.id === confessionId
          ? {
              ...confession,
              replies: [
                ...confession.replies,
                {
                  id: confession.replies.length + 1,
                  text: replyText[confessionId],
                  author: isReplyAnonymous[confessionId] ? null : currentUser,
                  isAnonymous: isReplyAnonymous[confessionId] || false,
                  time: "Just now"
                }
              ]
            }
          : confession
      ))
      setReplyText(prev => ({ ...prev, [confessionId]: "" }))
      setShowReplyBox(prev => ({ ...prev, [confessionId]: false }))
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Public Confessions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Share Your Thoughts</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Textarea
                value={newConfession}
                onChange={handleTextChange}
                placeholder="Write your confession here (500-character limit)"
                className="min-h-[100px] resize-none"
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
              <Button 
                type="submit" 
              >
                Submit Confession
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Recent Confessions</h2>
      <div className="space-y-4">
        {confessions.map((confession) => (
          <Card key={confession.id}>
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
                  {confession.time}
                </span>
              </div>
              <p className="mb-4">{confession.text}</p>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(confession.id)}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{confession.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDislike(confession.id)}
                  className="flex items-center gap-2"
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>{confession.dislikes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleReplyBox(confession.id)}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{confession.replies.length}</span>
                </Button>
              </div>

              {/* Replies Section */}
              <div className="mt-4 space-y-4">
                {confession.replies.map((reply) => (
                  <div key={reply.id} className="pl-6 border-l-2 mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      {reply.isAnonymous ? (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <UserX className="h-3 w-3" />
                          <span className="text-sm">Anonymous User</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-primary">
                          <UserCircle className="h-3 w-3" />
                          <span className="text-sm">{reply.author}</span>
                        </div>
                      )}
                      <span className="text-sm text-muted-foreground ml-auto">
                        {reply.time}
                      </span>
                    </div>
                    <p className="text-sm">{reply.text}</p>
                  </div>
                ))}

                {/* Reply Input Box */}
                {showReplyBox[confession.id] && (
                  <div className="mt-4 space-y-2">
                    <Textarea
                      value={replyText[confession.id] || ""}
                      onChange={(e) => setReplyText(prev => ({
                        ...prev,
                        [confession.id]: e.target.value
                      }))}
                      placeholder="Write your reply..."
                      className="min-h-[80px] text-sm"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={isReplyAnonymous[confession.id] || false}
                          onCheckedChange={(checked) => setIsReplyAnonymous(prev => ({
                            ...prev,
                            [confession.id]: checked
                          }))}
                          id={`reply-anonymous-${confession.id}`}
                        />
                        <label
                          htmlFor={`reply-anonymous-${confession.id}`}
                          className="text-sm font-medium leading-none"
                        >
                          Reply Anonymously
                        </label>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleReply(confession.id)}
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}