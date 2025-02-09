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
  time: string
  isAnonymous: boolean
  author: string | null
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
      replies: []
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
  const [replyText, setReplyText] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [isReplyAnonymous, setIsReplyAnonymous] = useState(true)
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

  const handleReplySubmit = (confessionId: number) => {
    if (replyText.trim()) {
      setConfessions(confessions.map(confession => {
        if (confession.id === confessionId) {
          return {
            ...confession,
            replies: [
              ...confession.replies,
              {
                id: confession.replies.length + 1,
                text: replyText,
                time: "Just now",
                isAnonymous: isReplyAnonymous,
                author: isReplyAnonymous ? null : currentUser
              }
            ]
          }
        }
        return confession
      }))
      setReplyText("")
      setReplyingTo(null)
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
                  onClick={() => setReplyingTo(replyingTo === confession.id ? null : confession.id)}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Reply</span>
                </Button>
              </div>

              {/* Reply Form */}
              {replyingTo === confession.id && (
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
                        id={`reply-anonymous-${confession.id}`}
                      />
                      <label
                        htmlFor={`reply-anonymous-${confession.id}`}
                        className="text-sm font-medium"
                      >
                        Reply Anonymously
                      </label>
                    </div>
                    <Button
                      onClick={() => handleReplySubmit(confession.id)}
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
                    <div key={reply.id} className="bg-gray-50 p-3 rounded-md">
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
                          {reply.time}
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