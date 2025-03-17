"use server"

import { checkAuth } from "./auth"
import { addCoins as addUserCoins } from "./auth"

// In a real app, you would use a database
// This is a simple in-memory store for demo purposes
interface Score {
  username: string
  score: number
  date: string
}

// Store scores in memory (reālā projektā šeit būtu datubāze)
let userHighScores: { [username: string]: Score } = {}

// Add some example scores for demonstration
userHighScores["Arturs"] = {
  username: "Arturs",
  score: 15,
  date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
}

userHighScores["Janis"] = {
  username: "Janis",
  score: 8,
  date: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
}

userHighScores["Liga"] = {
  username: "Liga",
  score: 12,
  date: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
}

// Funkcija, kas saņem rezultātu datus no klienta
export async function syncScoresData(scoresData: { [username: string]: Score }) {
  userHighScores = { ...userHighScores, ...scoresData }
  return { success: true }
}

// Servera puses funkcija, kas atgriež rezultātu datus
export async function getScoresData() {
  return userHighScores
}

export async function saveScore(username: string, score: number) {
  // Pārbaudam autentifikāciju
  const user = await checkAuth()
  if (!user || user.username !== username) {
    throw new Error("Unauthorized")
  }

  const isNewHighScore = !userHighScores[username] || score > userHighScores[username].score

  if (isNewHighScore) {
    userHighScores[username] = {
      username,
      score,
      date: new Date().toISOString(),
    }
  }

  // Pievienojam monētas (1 monēta par katru punktu)
  try {
    await addUserCoins(username, score)
  } catch (error) {
    console.error("Failed to add coins:", error)
  }

  return { success: true, newHighScore: isNewHighScore }
}

export async function getTopScores() {
  try {
    // Use in-memory storage instead of Firebase
    // Convert the userHighScores object to an array
    const users = Object.values(userHighScores).map(user => ({
      username: user.username,
      score: user.score,
      date: user.date
    }))
    
    // Sort by score in descending order
    return users.sort((a, b) => b.score - a.score)
  } catch (error) {
    console.error("Failed to get top scores:", error)
    return [] // Kļūdas gadījumā atgriežam tukšu masīvu
  }
}

export async function getUserHighScore(username: string) {
  // Pārbaudam autentifikāciju
  const user = await checkAuth()
  if (!user) {
    throw new Error("Unauthorized")
  }

  return userHighScores[username] || null
}

export async function addCoins(username: string, amount: number) {
  // Verify user is authenticated
  const user = await checkAuth()
  if (!user || user.username !== username) {
    throw new Error("Unauthorized")
  }

  // Add coins to user
  try {
    const result = await addUserCoins(username, amount)
    return result
  } catch (error) {
    console.error("Failed to add coins:", error)
    throw error
  }
}

