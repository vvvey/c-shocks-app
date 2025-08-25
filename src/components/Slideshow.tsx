"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export type SlideshowProps = {
  homeCountry: string
  visitingCountry: string
}

const pixabay = {
  apiKey: process.env.NEXT_PUBLIC_PIXABAY_API_KEY || "",
}

// Categories you want to use
const categories = ["food", "travel", "nature", "people", "buildings"]

const Slideshow: React.FC<SlideshowProps> = ({ visitingCountry }) => {
  const [images, setImages] = useState<string[]>([])
  const [index, setIndex] = useState(0)

  // Shuffle helper (Fisher–Yates)
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Fetch and shuffle images from Pixabay
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const results: string[] = []

        // Loop through categories
        for (const category of categories) {
          const res = await fetch(
            `https://pixabay.com/api/?key=${pixabay.apiKey}&q=${encodeURIComponent(
              visitingCountry
            )}&category=${category}&image_type=photo&orientation=horizontal&per_page=40`
          )
          const data = await res.json()

          interface PixabayImage {
            largeImageURL: string
            // add other fields if needed
          }
          
          if (data.hits && Array.isArray(data.hits)) {
            results.push(...data.hits.map((hit: PixabayImage) => hit.largeImageURL))
          }
        }

        // const res = await fetch(
        //     `https://pixabay.com/api/?key=${pixabay.apiKey}&q=${encodeURIComponent(
        //       visitingCountry
        //     )}&image_type=photo&editors_choice=true&per_page=50`
        // )
        // const data = await res.json()
        // if (data.hits && Array.isArray(data.hits)) {
        //   results.push(...data.hits.map((hit: any) => hit.largeImageURL))
        // }

        setImages(shuffleArray(results))
      } catch (err) {
        console.error("Error fetching Pixabay images:", err)
      }
    }

    if (visitingCountry) fetchImages()
  }, [visitingCountry])

  const slides = [
    {
      title: `Flying to ${visitingCountry}`,
      content: `Enjoy the view as you head to ${visitingCountry}.`,
    },
    {
      title: `Arrived in ${visitingCountry}`,
      content: `Welcome to ${visitingCountry}! We hope you enjoy your stay.`,
    },
    {
      title: `Exploring ${visitingCountry}`,
      content: `Discover the culture, sights, and food of ${visitingCountry}.`,
    },
    {
      title: `Adventure in ${visitingCountry}`,
      content: `Experience the best adventures in ${visitingCountry}.`,
    },
    {
      title: `Memories in ${visitingCountry}`,
      content: `Capture unforgettable moments in ${visitingCountry}.`,
    },
  ]

  // Auto-advance every 4s
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background Image with filter */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: images.length
              ? `url(${images[index % images.length]})`
              : "linear-gradient(to bottom, #d38d00ff, #e9e91eff)",
            filter: "grayscale(100%) brightness(0.9) contrast(1.2)",
          }}
        />
      </AnimatePresence>

      {/* Yellow overlay */}
      <div className="absolute inset-0 bg-yellow-400 mix-blend-multiply opacity-80" />

      {/* Content */}
      <div className="relative z-10 text-center p-8 rounded-xl max-w-lg">
        <h2 className="text-3xl font-bold mb-4">{slides[index].title}</h2>
        <p className="text-lg">{slides[index].content}</p>
      </div>

      {/* Navigation dots */}
      <div className="relative z-10 flex mt-6 space-x-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              i === index ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Slideshow
