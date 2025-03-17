'use client'

import { syncUserData, getUsers } from './auth'
import { syncScoresData, getScoresData } from './scores'

// Funkcija, kas ielādē lietotāju datus no localStorage
export async function loadUserData() {
  if (typeof window === 'undefined') return
  
  try {
    const savedUsers = localStorage.getItem('flappyBirdUsers')
    if (savedUsers) {
      await syncUserData(JSON.parse(savedUsers))
    }
  } catch (error) {
    console.error("Failed to load user data:", error)
  }
}

// Funkcija, kas saglabā lietotāju datus localStorage
export async function saveUsers() {
  if (typeof window === 'undefined') return
  
  try {
    // Iegūstam jaunākos lietotāju datus no servera
    const userData = await getUsers()
    // Saglabājam tos localStorage
    localStorage.setItem('flappyBirdUsers', JSON.stringify(userData))
  } catch (error) {
    console.error("Failed to save user data:", error)
  }
}

// Funkcija, kas ielādē rezultātus no localStorage
export async function loadScoresData() {
  if (typeof window === 'undefined') return
  
  try {
    const savedScores = localStorage.getItem('flappyBirdScores')
    if (savedScores) {
      await syncScoresData(JSON.parse(savedScores))
    }
  } catch (error) {
    console.error("Failed to load scores data:", error)
  }
}

// Funkcija, kas saglabā rezultātu datus localStorage
export async function saveScoresData() {
  if (typeof window === 'undefined') return
  
  try {
    // Iegūstam jaunākos rezultātu datus no servera
    const scoresData = await getScoresData()
    // Saglabājam tos localStorage
    localStorage.setItem('flappyBirdScores', JSON.stringify(scoresData))
  } catch (error) {
    console.error("Failed to save scores data:", error)
  }
} 