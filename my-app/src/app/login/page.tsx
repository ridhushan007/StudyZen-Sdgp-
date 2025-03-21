'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaUser, FaLock, FaUniversity, FaEnvelope } from 'react-icons/fa'
import axios from 'axios'

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Connect to backend API
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      })
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token)
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-blue-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-2">
            <FaUniversity className="text-primary-600 text-3xl" />
            <FaUser className="text-primary-600 text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-primary-600">StudyZen</h1>
          <p className="text-gray-600 mt-1">Your Personal Progress Companion</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">User Login</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          
<form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-primary-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-primary-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>




}