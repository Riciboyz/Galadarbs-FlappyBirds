"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bird, LogIn, AlertCircle, ArrowLeft, Lock, User } from "lucide-react"
import { login } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login(username, password)
      router.push("/game")
    } catch (err) {
      setError("Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-500 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Animated clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
        <div className="cloud cloud-4"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500"></div>
          
          <CardHeader className="text-center pb-2 pt-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Bird className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600 mt-2">Sign in to your Flappy Bird account</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 text-red-800">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-12 pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg shadow-sm"
                    placeholder="Enter your username"
                    autoComplete="username"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <User className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg shadow-sm"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] rounded-lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <LogIn className="mr-2 h-5 w-5" />
                    <span>Login</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-4 pb-6">
            <div className="text-center w-full">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-green-600 hover:text-green-700 font-medium transition-colors">
                  Register
                </Link>
              </p>
            </div>

            <Link 
              href="/" 
              className="text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors group"
            >
              <div className="bg-gray-100 group-hover:bg-gray-200 p-2 rounded-full mr-2 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </div>
              <span>Back to home</span>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

