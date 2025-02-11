"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SendHorizontal, Smile, Paperclip, Play, Square, X } from "lucide-react"
import { io, Socket } from "socket.io-client"

interface Message {
  id: string
  text: string
  sender: string
  time: string
  avatar: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isChatStarted, setIsChatStarted] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [chatId, setChatId] = useState<string>("")
  const [isSearching, setIsSearching] = useState(false)
  const [isPartnerTyping, setIsPartnerTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (isChatStarted && !socket) {
      const newSocket = io('http://localhost:3001', {
        transports: ['websocket'],
      })

      newSocket.on('connect', () => {
        console.log('Connected to chat server')
      })

      newSocket.on('waiting-for-match', () => {
        setMessages([{
          id: `system-${Date.now()}`,
          text: "Looking for someone to chat with...",
          sender: "System",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          avatar: "/placeholder.svg?height=40&width=40",
        }])
        setIsSearching(true)
      })

      newSocket.on('chat-matched', ({ chatId }) => {
        setChatId(chatId)
        setIsSearching(false)
        setMessages([{
          id: `system-${Date.now()}`,
          text: "Connected! You can now start chatting.",
          sender: "System",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          avatar: "/placeholder.svg?height=40&width=40",
        }])
      })

      newSocket.on('message', (message: Message) => {
        const modifiedMessage = {
          ...message,
          sender: message.sender === "Me" ? "Partner" : message.sender
        }
        setMessages(prev => [...prev, modifiedMessage])
      })

      newSocket.on('user-typing', () => {
        setIsPartnerTyping(true)
      })

      newSocket.on('user-stop-typing', () => {
        setIsPartnerTyping(false)
      })

      newSocket.on('partner-disconnected', () => {
        setMessages(prev => [...prev, {
          id: `system-${Date.now()}`,
          text: "Your chat partner has disconnected.",
          sender: "System",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          avatar: "/placeholder.svg?height=40&width=40",
        }])
        setIsChatStarted(false)
        setChatId("")
      })

      setSocket(newSocket)
      newSocket.emit('looking-for-chat')
    }

    return () => {
      if (socket) {
        socket.emit('stop-looking')
        socket.disconnect()
      }
    }
  }, [isChatStarted])

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    
    if (socket && chatId) {
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Emit typing event
      socket.emit('typing', { chatId })

      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop-typing', { chatId })
      }, 1000)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && isChatStarted && socket) {
      const messageData = {
        id: `${socket.id}-${Date.now()}`,
        text: newMessage,
        chatId: chatId,
        sender: "Me",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        avatar: "/placeholder.svg?height=40&width=40",
      }

      socket.emit('send-message', messageData)
      setMessages(prev => [...prev, messageData])
      setNewMessage("")
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      socket.emit('stop-typing', { chatId })
    }
  }

  const handleStart = () => {
    setIsChatStarted(true)
  }

  const handleStop = () => {
    setIsConfirmModalOpen(true)
  }

  const confirmStop = () => {
    if (socket) {
      socket.disconnect()
      setSocket(null)
      setIsChatStarted(false)
      setMessages([])
      setChatId("")
      setIsConfirmModalOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border shadow-lg rounded-xl">
          <CardHeader className="border-b bg-white/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 border-2 border-primary/10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>ST</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">Study Buddy</CardTitle>
                  <p className={`text-sm ${isChatStarted ? 'text-green-500' : 'text-gray-500'}`}>
                    {isChatStarted ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              {!isChatStarted ? (
                <Button 
                  onClick={handleStart} 
                  className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full px-6"
                >
                  <Play className="h-5 w-5 mr-2" />
                  {isSearching ? "Searching..." : "Start Chat"}
                </Button>
              ) : (
                <Button 
                  onClick={handleStop} 
                  variant="destructive" 
                  className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 rounded-full px-6"
                >
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
                      className={`flex items-start gap-3 ${
                        message.sender === "Me" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <Avatar className="flex-shrink-0 border-2 border-primary/10">
                        <AvatarImage src={message.avatar} />
                        <AvatarFallback>{message.sender[0]}</AvatarFallback>
                      </Avatar>
                      <div className={`group flex flex-col max-w-[80%]`}>
                        <div
                          className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                            message.sender === "Me" 
                              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white" 
                              : "bg-white border"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {message.time}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isPartnerTyping && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>Partner is typing...</span>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t bg-white/50 backdrop-blur-sm">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="flex-shrink-0 hover:bg-gray-100 transition-colors duration-200" 
                    disabled={!isChatStarted}
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={handleMessageChange}
                    placeholder={isChatStarted ? "Type your message..." : "Start the chat to begin messaging"}
                    className="flex-1 bg-white/50 border rounded-full px-4 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 transition-all duration-200"
                    disabled={!isChatStarted}
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="flex-shrink-0 hover:bg-gray-100 transition-colors duration-200" 
                    disabled={!isChatStarted}
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="rounded-full flex-shrink-0 bg-blue-500 hover:bg-blue-600 transition-colors duration-200" 
                    disabled={!isChatStarted}
                  >
                    <SendHorizontal className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-96 shadow-2xl animate-in zoom-in-90 duration-200">
            <CardHeader className="border-b bg-white/50">
              <CardTitle className="flex items-center">
                <Square className="h-5 w-5 mr-2 text-red-500" />
                Confirm Stop Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600">
                Are you sure you want to stop the chat? This action will end the current chat session and clear all
                messages.
              </p>
            </CardContent>
            <div className="flex justify-end space-x-2 p-6 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setIsConfirmModalOpen(false)}
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmStop}
                className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600"
              >
                Confirm
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

