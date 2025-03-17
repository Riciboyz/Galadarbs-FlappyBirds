"use client"

import { useEffect } from "react"
import { loadUserData, saveUsers, loadScoresData, saveScoresData } from "@/lib/client-storage"

export default function UserDataLoader() {
  useEffect(() => {
    // Ielādējam lietotāju un rezultātu datus no localStorage, kad lapa tiek ielādēta
    const loadData = async () => {
      try {
        await loadUserData()
        await loadScoresData()
      } catch (error) {
        console.error("Failed to load data:", error)
      }
    }
    
    loadData()
    
    // Saglabājam lietotāju un rezultātu datus localStorage, kad lietotājs aizver lapu
    const handleBeforeUnload = async () => {
      try {
        await saveUsers()
        await saveScoresData()
      } catch (error) {
        console.error("Failed to save data:", error)
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  // Šis komponents neko nerenderē, tas tikai ielādē datus
  return null
} 