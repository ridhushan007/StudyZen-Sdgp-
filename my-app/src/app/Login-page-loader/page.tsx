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
    }, [router])

    const handleLogout = () => {
      localStorage.removeItem('token')
      router.push('/login')
    }
  
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }
  
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-primary-600 text-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">University Student Portal</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-400 flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
                <span className="ml-2 hidden md:inline">{user?.fullName}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-primary-700 transition duration-200"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome, {user?.fullName}!</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Student ID</p>
                <p className="font-medium">{user?.studentId}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Program</p>
                <p className="font-medium">Computer Science</p>
              </div>
            </div>
          </div>
  
          
        </main>
      </div>
  
        
    )
  }





}
