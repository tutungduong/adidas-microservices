"use client"

import { useState, useEffect } from "react"
import javaService from "@/api/services/javaService"
import { Nullable } from "@/types/common"
import { ProductFilters, ProductsResponse, Product } from "@/types/product"

// 👇 Fallback types (KHÔNG dùng Product / Variant / Size thật ở đây)
interface FallbackSize {
  name: string
  stock: number
  isAvailable: boolean
}

interface FallbackVariant {
  id: string | number
  color: string
  price: number
  original_price: number
  sizes: FallbackSize[]
  image_url?: string
  available?: boolean
}

interface FallbackProduct {
  id: number | string
  name: string
  title: string
  jan_code: string
  description: string
  description_h5: string
  specifications: string
  care: string
  gender: string
  franchise: string
  producttype: string
  brand: string
  category: string
  sport: string
  currencyId: string
  currencyFormat: string
  isFreeShipping: boolean
  price: number
  original_price: number
  installments: number
  created_at: string
  updated_at: string
  image: string
  image_url: string
  availableSizes: string[]
  collection: string
  badge: string
  model_number: string
  reviews_count: number
  average_rating: number
  slug: string
  variants: FallbackVariant[]
}

export function useProducts(initialFilters: ProductFilters = {}) {
  const [data, setData] = useState<ProductsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Nullable<string>>(null)
  const [filters, setFilters] = useState<ProductFilters>(initialFilters)

  const fetchProducts = async (newFilters: ProductFilters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const mergedFilters = { ...filters, ...newFilters }
      const response = await javaService.test()

      setData(response)
      setFilters(mergedFilters)
    } catch (err) {
      console.error("Failed to fetch products:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch products")

      const mergedFilters = { ...filters, ...newFilters }

      // 👇 ép kiểu rõ ràng fallback về Product[]
      setData({
        products: generateFallbackProducts(filters.slug || "", 20) as unknown as Product[],
        meta: {
          current_page: 1,
          total_pages: 3,
          total_count: 60,
          per_page: 20,
          filters_applied: mergedFilters,
          category_info: getFallbackCategoryInfo(filters.slug || ""),
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    fetchProducts(updatedFilters)
  }

  const loadMore = () => {
    if (data && data.meta.current_page < data.meta.total_pages) {
      fetchProducts({ ...filters, page: data.meta.current_page + 1 })
    }
  }

  useEffect(() => {
    fetchProducts(initialFilters)
  }, [])

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    loadMore,
    refetch: () => fetchProducts(filters),
  }
}

// ✅ Fallback mock data
function generateFallbackProducts(slug: string, count: number): FallbackProduct[] {
  const products: FallbackProduct[] = []

  for (let i = 1; i <= count; i++) {
    const name = `Product ${i}`
    const price = Math.floor(Math.random() * 150) + 50

    products.push({
      id: i,
      name,
      title: name,
      jan_code: `JAN${i.toString().padStart(6, "0")}`,
      description: `High-quality ${name.toLowerCase()} for your active lifestyle.`,
      description_h5: "Comfortable and durable.",
      specifications: "Made of synthetic material. Imported.",
      care: "Hand wash cold. Do not bleach.",
      gender: "Unisex",
      franchise: "Main",
      producttype: "Tops",
      brand: "adidas",
      category: "Clothing",
      sport: "Lifestyle",
      currencyId: "USD",
      currencyFormat: "$",
      isFreeShipping: true,
      price,
      original_price: price + 20,
      installments: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image: "/placeholder.svg",
      image_url: "/placeholder.svg",
      availableSizes: ["S", "M", "L"],
      collection: "2025 Spring",
      badge: "New",
      model_number: `MOD${i}`,
      reviews_count: Math.floor(Math.random() * 100),
      average_rating: parseFloat((Math.random() * 5).toFixed(1)),
      slug: `${slug}-${i}`,
      variants: [
        {
          id: `${i * 10}`,
          color: ["Black", "White", "Blue", "Red"][i % 4],
          price,
          original_price: price + 20,
          sizes: [
            { name: "S", stock: 10, isAvailable: true },
            { name: "M", stock: 5, isAvailable: true },
            { name: "L", stock: 0, isAvailable: false },
          ],
          image_url: "/placeholder.svg",
          available: true,
        },
      ],
    })
  }

  return products
}

// 📂 Fallback category info
function getFallbackCategoryInfo(slug: string) {
  const categoryMap: Record<string, any> = {
    "men-soccer-shoes": {
      title: "MEN'S SOCCER SHOES",
      breadcrumb: "Men / Soccer / Shoes",
      description:
        "Find your perfect pair of men's soccer shoes. From firm ground to artificial turf, we have the right cleats for every playing surface.",
    },
    "men-tops": {
      title: "MEN'S TOPS",
      breadcrumb: "Men / Clothing / Tops",
      description:
        "Discover our collection of men's tops. From t-shirts to tank tops, find the perfect fit for your active lifestyle.",
    },
  }

  return (
    categoryMap[slug] || {
      title: slug.toUpperCase().replace(/-/g, " "),
      breadcrumb: slug
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" / "),
      description: `Discover our collection of ${slug.replace(/-/g, " ")}.`,
    }
  )
}
