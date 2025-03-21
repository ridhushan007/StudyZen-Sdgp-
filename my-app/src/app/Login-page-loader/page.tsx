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





}
