"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getUserData, purchaseSkin, selectSkin, getAvailableSkins } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Check, Coins } from "lucide-react"

interface ShopProps {
  username: string
  onSkinChange: () => void
}

interface Skin {
  id: string
  name: string
  description: string
  price: number
  image: string
}

export default function Shop({ username, onSkinChange }: ShopProps) {
  const [skins, setSkins] = useState<Skin[]>([])
  const [userCoins, setUserCoins] = useState(0)
  const [purchasedSkins, setPurchasedSkins] = useState<string[]>([])
  const [selectedSkin, setSelectedSkin] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadShopData()
  }, [username])

  const loadShopData = async () => {
    try {
      const userData = await getUserData(username)
      setUserCoins(userData.coins)
      setPurchasedSkins(userData.purchasedSkins)
      setSelectedSkin(userData.selectedSkin)

      const skinsData = await getAvailableSkins()
      setSkins(skinsData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load shop data",
        variant: "destructive"
      })
    }
  }

  const handlePurchase = async (skinId: string, price: number) => {
    try {
      setLoading(true)
      const result = await purchaseSkin(username, skinId)
      setUserCoins(result.coins)
      setPurchasedSkins(result.purchasedSkins)
      
      toast({
        title: "Success!",
        description: "Skin purchased successfully!",
      })
      
      await handleSelect(skinId)
    } catch (error: any) {
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase skin",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = async (skinId: string) => {
    try {
      setLoading(true)
      const result = await selectSkin(username, skinId)
      setSelectedSkin(result.selectedSkin)
      onSkinChange()
      
      toast({
        title: "Success!",
        description: "Skin selected successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select skin",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bird Shop</h2>
        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full border border-amber-200">
          <Coins className="h-5 w-5 text-amber-500" />
          <span className="font-bold text-amber-700">{userCoins} coins</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {skins.map((skin: any) => (
          <Card key={skin.id} className="overflow-hidden">
            <div className="p-6">
              <div className="aspect-square mb-4 bg-gray-50 rounded-lg p-4">
                <img
                  src={skin.image}
                  alt={skin.name}
                  className="w-full h-full object-contain"
                />
                {selectedSkin === skin.id && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Selected
                  </div>
                )}
              </div>
              
              <h3 className="font-bold text-lg mb-1">{skin.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{skin.description}</p>
              
              {!purchasedSkins.includes(skin.id) ? (
                <Button
                  onClick={() => handlePurchase(skin.id, skin.price)}
                  disabled={loading || userCoins < skin.price}
                  className="w-full"
                  variant={userCoins >= skin.price ? "default" : "outline"}
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      <Coins className="h-4 w-4 mr-2" />
                      {userCoins >= skin.price 
                        ? `Buy for ${skin.price} coins` 
                        : `Need ${skin.price - userCoins} more coins`}
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => handleSelect(skin.id)}
                  disabled={loading}
                  variant={selectedSkin === skin.id ? "secondary" : "outline"}
                  className="w-full"
                >
                  {loading ? (
                    "Processing..."
                  ) : selectedSkin === skin.id ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Selected
                    </>
                  ) : (
                    'Select'
                  )}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

