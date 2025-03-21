'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaUser, FaSignOutAlt, FaBook, FaCalendarAlt, FaClipboardList } from 'react-icons/fa'

export default function Dashboard() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
  
    useEffect(() => {
      // Check if user is logged in
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      // Get user data from token
    try {
        // In a real app, you would fetch user data from the server here
        // For now, we'll just simulate it
        setUser({
          fullName: 'John Doe',
          email: 'john.doe@university.edu',
          studentId: 'S12345678'
        })
      } catch (error) {
        console.error('Error fetching user data:', error)
        localStorage.removeItem('token')
        router.push('/login')
      } finally {
        setLoading(false)
      }
    },





}
