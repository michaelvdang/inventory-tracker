'use client'
import React, { useEffect } from 'react'
import GoogleButton from 'react-google-button'
import { signInWithGoogle } from '../utils/auth'
import { useUserContext } from '../MyContext'

const login = () => {
  const {user, setUser} = useUserContext();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"))
    }
  }, [])
  
  return (
    <div
      className='flex justify-center items-center h-screen bg-yellow-600'
    >
      <GoogleButton
        onClick={signInWithGoogle}
        className="w-10/12"
      />
    </div>
  )
}

export default login