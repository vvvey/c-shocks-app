"use client"

import React, { useState, useEffect } from "react"
import MultiStepForm from "@/components/MultiStepForm"
import FlightMap from "@/components/FlightMap"
import Slideshow from "@/components/Slideshow"
import Shocks from "@/components/Shocks"
import { UserData } from "@/types/UserData"
import { AnimatePresence, motion } from "framer-motion"

type ViewState = "form" | "map" | "slideshow"

export default function Home() {
  const [view, setView] = useState<ViewState>("form")
  const [userData, setUserData] = useState<UserData | null>(null)

  // Start timer when we enter the map view
  useEffect(() => {
    if (view === "map") {
      const timer = setTimeout(() => {
        setView("slideshow")
      }, 11000) // 16s matches flight animation + delay
      return () => clearTimeout(timer)
    }
  }, [view])

  return (
    <div className="font-sans min-h-screen w-full relative">
      <AnimatePresence mode="wait">
        {view === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-screen p-8"
          >
            <main className="w-full max-w-lg">
              <MultiStepForm
                onComplete={(data) => {
                  setUserData(data)
                  setView("map")
                }}
              />
            </main>
          </motion.div>
        )}

        {view === "map" && userData && (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <FlightMap
              homeCountry={userData.homeCountry}
              visitingCountry={userData.visitingCountry}
            />
          </motion.div>
        )}

        {view === "slideshow" && userData && (
          <motion.div
            key="slideshow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {/* <Slideshow
              homeCountry={userData.homeCountry}
              visitingCountry={userData.visitingCountry}
            /> */}
            <Shocks 
            homeCountry={userData.homeCountry}
              visitingCountry={userData.visitingCountry}
               />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
