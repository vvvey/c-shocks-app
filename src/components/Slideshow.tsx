"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SlideshowProps {
  homeCountry: string
  visitingCountry: string
}

const Slideshow: React.FC<SlideshowProps> = ({ homeCountry, visitingCountry }) => {
  const slides = [
    {
      title: `Welcome from ${homeCountry}`,
      content: `Your journey starts here in ${homeCountry}.`,
    },
    {
      title: `Flying to ${visitingCountry}`,
      content: `Enjoy the view as you head to ${visitingCountry}.`,
    },
    {
      title: `Arrived in ${visitingCountry}`,
      content: `Welcome to ${visitingCountry}! We hope you enjoy your stay.`,
    },
  ]

  const [index, setIndex] = useState(0)

  // Auto-advance every 4s
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="text-center p-8"
        >
          <h2 className="text-3xl font-bold mb-4">{slides[index].title}</h2>
          <p className="text-lg">{slides[index].content}</p>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex mt-6 space-x-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Slideshow
