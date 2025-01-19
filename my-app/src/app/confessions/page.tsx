'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp } from 'lucide-react'

export default function ConfessionsPage() {
  const [confessions, setConfessions] = useState([
    { id: 1, text: "I've been procrastinating on my assignments and now I'm really behind.", likes: 5, time: "2 hours ago" },
    { id: 2, text: "I'm afraid I chose the wrong major but I'm too far in to change now.", likes: 12, time: "5 hours ago" },
    { id: 3, text: "I cheated on a test and I feel terrible about it.", likes: 3, time: "1 day ago" },
  ])
  const [newConfession, setNewConfession] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newConfession.trim()) {
      setConfessions([
        {
          id: confessions.length + 1,
          text: newConfession,
          likes: 0,
          time: "Just now"
        },
        ...confessions
      ])
      setNewConfession("")
    }
  }

  const handleLike = (id: number) => {
    setConfessions(confessions.map(confession =>
      confession.id === id
        ? { ...confession, likes: confession.likes + 1 }
        : confession
    ))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Confessions</h1>

      <Card>
        <CardHeader>
          <CardTitle>Share Your Confession</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={newConfession}
              onChange={(e) => setNewConfession(e.target.value)}
              placeholder="Share your thoughts anonymously..."
              className="min-h-[100px]"
            />
            <Button type="submit">Submit Confession</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {confessions.map((confession) => (
          <Card key={confession.id}>
            <CardContent className="pt-6">
              <p className="mb-4">{confession.text}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(confession.id)}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{confession.likes}</span>
                </Button>
                <span>{confession.time}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}