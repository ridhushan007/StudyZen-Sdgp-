'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaUser, FaLock, FaEnvelope, FaUniversity, FaIdCard } from 'react-icons/fa'
import axios from 'axios'

export default function Signup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: ''
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate email is university email
    if (!formData.email.endsWith('.edu')) {
      setError('Please use your university email address')
      return
    }

    setLoading(true)

     try {
      // Connect to backend API
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        studentId: formData.studentId,
        password: formData.password
      })
      
      // Redirect to login page after successful registration
      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
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




}
