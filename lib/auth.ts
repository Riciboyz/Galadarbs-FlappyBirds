"use server"

import { cookies } from "next/headers"

// In a real app, you would use a database
// This is a simple in-memory store for demo purposes
interface User {
  username: string
  password: string
  coins: number
  purchasedSkins: string[]
  selectedSkin: string
}

// Inicializējam lietotāju un sesiju objektus
let users: { [key: string]: User } = {}
let sessions: { [key: string]: { username: string } } = {}

// Funkcija, kas saņem lietotāju datus no klienta
export async function syncUserData(userData: { [key: string]: User }) {
  users = { ...users, ...userData }
  return { success: true }
}

// Servera puses funkcija, kas atgriež lietotāju datus
export async function getUsers() {
  return users
}

export async function register(username: string, password: string) {
  // Check if username already exists
  if (users[username]) {
    throw new Error("Username already exists")
  }

  // Store user with default values
  users[username] = {
    username,
    password,
    coins: 0,
    purchasedSkins: ["default"],
    selectedSkin: "default",
  }

  // Create session
  const sessionId = Math.random().toString(36).substring(2, 15)
  sessions[sessionId] = { username }

  // Set cookie
  cookies().set("sessionId", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return { username }
}

export async function login(username: string, password: string) {
  // Check if user exists and password matches
  const user = users[username]
  if (!user || user.password !== password) {
    throw new Error("Invalid username or password")
  }

  // Create session
  const sessionId = Math.random().toString(36).substring(2, 15)
  sessions[sessionId] = { username }

  // Set cookie
  cookies().set("sessionId", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return { username }
}

export async function logout() {
  const sessionId = cookies().get("sessionId")?.value

  if (sessionId) {
    delete sessions[sessionId]
    cookies().delete("sessionId")
  }

  return { success: true }
}

export async function checkAuth() {
  const sessionId = cookies().get("sessionId")?.value

  if (!sessionId || !sessions[sessionId]) {
    return null
  }

  return { username: sessions[sessionId].username }
}

export async function getUserData(username: string) {
  // Pārbaudam autentifikāciju
  const user = await checkAuth()
  if (!user) {
    throw new Error("Unauthorized")
  }

  const userData = users[username]
  if (!userData) {
    throw new Error("User not found")
  }

  // Nenosūtām paroli
  const { password, ...rest } = userData
  return rest
}

export async function updateScore(username: string, score: number) {
  // Pārbaudam autentifikāciju
  const user = await checkAuth()
  if (!user || user.username !== username) {
    throw new Error("Unauthorized")
  }

  // Atjauninām lietotāja datus
  if (!users[username]) {
    throw new Error("User not found")
  }

  return { success: true }
}

export async function addCoins(username: string, amount: number) {
  // Verify user is authenticated
  const user = await checkAuth()
  if (!user || user.username !== username) {
    throw new Error("Unauthorized")
  }

  // Add coins to user
  if (!users[username]) {
    throw new Error("User not found")
  }

  users[username].coins += amount

  return { success: true, coins: users[username].coins }
}

export async function purchaseSkin(username: string, skinId: string, price: number) {
  // Verify user is authenticated
  const user = await checkAuth()
  if (!user || user.username !== username) {
    throw new Error("Unauthorized")
  }

  // Check if user has enough coins
  if (users[username].coins < price) {
    throw new Error("Not enough coins")
  }

  // Check if user already has this skin
  if (users[username].purchasedSkins.includes(skinId)) {
    throw new Error("Skin already purchased")
  }

  // Purchase skin
  users[username].coins -= price
  users[username].purchasedSkins.push(skinId)

  return {
    success: true,
    coins: users[username].coins,
    purchasedSkins: users[username].purchasedSkins,
  }
}

export async function selectSkin(username: string, skinId: string) {
  // Verify user is authenticated
  const user = await checkAuth()
  if (!user || user.username !== username) {
    throw new Error("Unauthorized")
  }

  // Check if user has this skin
  if (!users[username].purchasedSkins.includes(skinId)) {
    throw new Error("Skin not purchased")
  }

  // Select skin
  users[username].selectedSkin = skinId

  return {
    success: true,
    selectedSkin: skinId,
  }
}

// Completely simplified bird skins with very basic SVG data
export async function getAvailableSkins() {
  return [
    {
      id: "default",
      name: "Yellow Bird",
      description: "The classic yellow bird",
      price: 0,
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='200' fill='%23ffd700'/%3E%3Ccircle cx='180' cy='180' r='20' fill='%23000'/%3E%3Ccircle cx='320' cy='180' r='20' fill='%23000'/%3E%3Cpath d='M200 300 Q 256 360 312 300' stroke='%23ff6600' stroke-width='20' fill='none'/%3E%3C/svg%3E",
    },
    {
      id: "blue",
      name: "Blue Bird",
      description: "A cool blue bird",
      price: 50,
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='200' fill='%234299e5'/%3E%3Ccircle cx='180' cy='180' r='20' fill='%23000'/%3E%3Ccircle cx='320' cy='180' r='20' fill='%23000'/%3E%3Cpath d='M200 300 Q 256 360 312 300' stroke='%231065b1' stroke-width='20' fill='none'/%3E%3C/svg%3E",
    },
    {
      id: "red",
      name: "Red Bird",
      description: "A fiery red bird",
      price: 75,
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='200' fill='%23ff4141'/%3E%3Ccircle cx='180' cy='180' r='20' fill='%23000'/%3E%3Ccircle cx='320' cy='180' r='20' fill='%23000'/%3E%3Cpath d='M200 300 Q 256 360 312 300' stroke='%23c00000' stroke-width='20' fill='none'/%3E%3C/svg%3E",
    },
    {
      id: "green",
      name: "Green Bird",
      description: "A nature-loving green bird",
      price: 75,
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='200' fill='%234caf50'/%3E%3Ccircle cx='180' cy='180' r='20' fill='%23000'/%3E%3Ccircle cx='320' cy='180' r='20' fill='%23000'/%3E%3Cpath d='M200 300 Q 256 360 312 300' stroke='%232e7d32' stroke-width='20' fill='none'/%3E%3C/svg%3E",
    },
    {
      id: "purple",
      name: "Purple Bird",
      description: "A royal purple bird",
      price: 100,
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='200' fill='%239c27b0'/%3E%3Ccircle cx='180' cy='180' r='20' fill='%23000'/%3E%3Ccircle cx='320' cy='180' r='20' fill='%23000'/%3E%3Cpath d='M200 300 Q 256 360 312 300' stroke='%236a1b9a' stroke-width='20' fill='none'/%3E%3C/svg%3E",
    },
    {
      id: "golden",
      name: "Golden Bird",
      description: "A rare golden bird",
      price: 200,
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='200' fill='%23ffc107'/%3E%3Ccircle cx='180' cy='180' r='20' fill='%23000'/%3E%3Ccircle cx='320' cy='180' r='20' fill='%23000'/%3E%3Cpath d='M200 300 Q 256 360 312 300' stroke='%23ff9800' stroke-width='20' fill='none'/%3E%3C/svg%3E",
    },
  ]
}

export async function updateUserData(username: string, data: Partial<User>) {
  // Pārbaudam autentifikāciju
  const user = await checkAuth()
  if (!user || user.username !== username) {
    throw new Error("Unauthorized")
  }

  // Atjauninām lietotāja datus
  users[username] = {
    ...users[username],
    ...data,
  }

  return { success: true }
}

