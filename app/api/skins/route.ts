import { NextResponse } from "next/server"

export async function GET() {
  const skins = [
    {
      id: "default",
      name: "Yellow Bird",
      description: "The classic yellow bird",
      price: 0,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='200' fill='%23ffd700'/%3E%3Ccircle cx='180' cy='180' r='20' fill='%23000'/%3E%3Ccircle cx='320' cy='180' r='20' fill='%23000'/%3E%3Cpath d='M200 300 Q 256 360 312 300' stroke='%23ff6600' stroke-width='20' fill='none'/%3E%3C/svg%3E",
    },
    {
      id: "blue",
      name: "Blue Bird",
      description: "A cool blue bird",
      price: 10,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='200' fill='%234299e5'/%3E%3Ccircle cx='180' cy='180' r='20' fill='%23000'/%3E%3Ccircle cx='320' cy='180' r='20' fill='%23000'/%3E%3Cpath d='M200 300 Q 256 360 312 300' stroke='%231065b1' stroke-width='20' fill='none'/%3E%3C/svg%3E",
    },
    {
      id: "red",
      name: "Red Bird",
      description: "A fiery red bird",
      price: 15,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='200' fill='%23ff4141'/%3E%3Ccircle cx='180' cy='180' r='20' fill='%23000'/%3E%3Ccircle cx='320' cy='180' r='20' fill='%23000'/%3E%3Cpath d='M200 300 Q 256 360 312 300' stroke='%23c00000' stroke-width='20' fill='none'/%3E%3C/svg%3E",
    }
  ]

  return NextResponse.json(skins)
}

