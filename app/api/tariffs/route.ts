import { NextResponse } from "next/server"

// Mock tariff data
const mockTariffs = [
  {
    id: 1,
    name: "start",
    price: 250000,
    duration: 120,
    dailyProfit: 100,
    description: "Basic tariff for beginners",
    features: ["Natural ingredients", "Clinically tested", "Fast results"],
    images: [
      "https://picsum.photos/id/1/400/300",
      "https://picsum.photos/id/2/400/300",
      "https://picsum.photos/id/3/400/300",
    ],
  },
  {
    id: 2,
    name: "silver",
    price: 350000,
    duration: 150,
    dailyProfit: 150,
    description: "Medium tariff for regular users",
    features: ["Anti-aging", "Moisturizing", "UV protection"],
    images: [
      "https://picsum.photos/id/4/400/300",
      "https://picsum.photos/id/5/400/300",
      "https://picsum.photos/id/6/400/300",
    ],
  },
  {
    id: 3,
    name: "gold",
    price: 450000,
    duration: 180,
    dailyProfit: 200,
    description: "Premium tariff for professionals",
    features: ["Full body treatment", "Deep moisturizing", "Skin tightening"],
    images: [
      "https://picsum.photos/id/7/400/300",
      "https://picsum.photos/id/8/400/300",
      "https://picsum.photos/id/9/400/300",
    ],
  },
]

export async function GET(request: Request) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Get currency from query params
  const { searchParams } = new URL(request.url)
  const currency = searchParams.get("currency") || "USD"

  // Currency conversion rates (simplified for demo)
  const currencyRates: Record<string, number> = {
    USD: 1,
    RUB: 80,
    UZS: 12000,
    KZT: 450,
    KGS: 90,
    TJS: 12,
    CNY: 7,
  }

  // Convert prices based on currency
  const rate = currencyRates[currency] || 1
  const convertedTariffs = mockTariffs.map((tariff) => ({
    ...tariff,
    price: tariff.price * rate,
    dailyProfit: tariff.dailyProfit * rate,
  }))

  return NextResponse.json(convertedTariffs)
}
