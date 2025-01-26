"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SendHorizontal, Smile, Paperclip, Play, Square, X } from "lucide-react"

export default function ChatPage() {
  const [messages, setMessages] = useState<
    Array<{
      id: number
      text: string
      sender: string
      time: string
      avatar: string
    }>
  >([])
  const [newMessage, setNewMessage] = useState("")
  const [isChatStarted, setIsChatStarted] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [scrollRef])

  const handleStart = () => {
    setIsChatStarted(true)
    setMessages([
      {
        id: 1,
        text: "Chat started. How can I help you today?",
        sender: "System",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ])
  }

  const handleStop = () => {
    setIsConfirmModalOpen(true)
  }

  const confirmStop = () => {
    setIsChatStarted(false)
    setMessages([])
    setIsConfirmModalOpen(false)
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && isChatStarted) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: newMessage,
          sender: "Me",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ])
      setNewMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white border shadow-lg">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>ST</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Study Buddy</CardTitle>
                  <p className="text-sm text-muted-foreground">{isChatStarted ? "Online" : "Offline"}</p>
                </div>
              </div>
              {!isChatStarted ? (
                <Button onClick={handleStart} className="bg-green-500 hover:bg-green-600 transition-colors">
                  <Play className="h-5 w-5 mr-2" />
                  Start Chat
                </Button>
              ) : (
                <Button onClick={handleStop} variant="destructive" className="transition-colors">
                  <Square className="h-5 w-5 mr-2" />
                  Stop Chat
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[600px] flex flex-col">
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-2 ${message.sender === "Me" ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="flex-shrink-0">
                        <AvatarImage src={message.avatar} />
                        <AvatarFallback>{message.sender[0]}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`group flex flex-col max-w-[80%] animate-in slide-in-from-${
                          message.sender === "Me" ? "right" : "left"
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            message.sender === "Me" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {message.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t bg-white/50">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="icon" className="flex-shrink-0" disabled={!isChatStarted}>
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={isChatStarted ? "Type your message..." : "Start the chat to begin messaging"}
                    className="flex-1 bg-white/50 border-0 focus-visible:ring-1 focus-visible:ring-offset-0"
                    disabled={!isChatStarted}
                  />
                  <Button type="button" variant="ghost" size="icon" className="flex-shrink-0" disabled={!isChatStarted}>
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button type="submit" size="icon" className="rounded-full flex-shrink-0" disabled={!isChatStarted}>
                    <SendHorizontal className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Confirm Stop Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Are you sure you want to stop the chat? This action will end the current chat session and clear all
                messages.
              </p>
            </CardContent>
            <div className="flex justify-end space-x-2 p-6">
              <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmStop}>
                Confirm
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

