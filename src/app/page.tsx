"use client"

import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import ReactCountryFlag from "react-country-flag"

import countries from "@/data/countries.json"


export default function Home() {
  const [step, setStep] = useState(1)
  const [filtered, setFiltered] = useState<typeof countries>([])
  const [fromCountry, setFromCountry] = useState("")
  const [toCountry, setToCountry] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: "from" | "to") => {
    const value = e.target.value
    if (type === "from") setFromCountry(value)
    else setToCountry(value)

    setFiltered(
      value
        ? countries.filter((c) => c.name.toLowerCase().startsWith(value.toLowerCase()))
        : []
    )
  }

  const handleSelect = (country: typeof countries[number]) => {
    if (step === 1) {
      setToCountry("")
      setFromCountry(country.name)
      setFiltered([])
      setTimeout(() => setStep(2), 400)
      
    } else {
      setToCountry(country.name)
      setFiltered([])
      window.location.href = `/map?from=${countries.find(c => c.name === fromCountry)?.['alpha-3']}&to=${country['alpha-3']}`
    }
  }

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05,
        when: "beforeChildren",
      },
    },
  }

  // const itemVariants = {
  //   hidden: { opacity: 0, x: -20 },
  //   visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  // }

  return (

    <div className="font-sans flex items-center justify-center min-h-screen p-8">
      
      <main className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="flex flex-col gap-6"
            >
              
             <Label htmlFor="country" className="text-4xl">
  <span className="font-poppins">Where are you from?</span>
</Label>
              <div className="relative w-full border rounded-xl shadow-sm">
                <input
                  id="country"
                  value={fromCountry}
                  onChange={(e) => handleChange(e, "from")}
                  placeholder="Type a country..."
                  className="w-full py-5 px-6 text-2xl"
                />
                <AnimatePresence>
                  {filtered.length > 0 && (
                    <motion.ul
                      className="absolute z-10 w-full rounded-b-md border bg-white shadow-lg"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {filtered.map((country) => (
                        <motion.li
                          key={country['alpha-2']}
                          className="cursor-pointer flex items-center gap-3 px-4 py-4 text-2xl hover:bg-yellow-300"
                          onClick={() => handleSelect(country)}
                          // variants={itemVariants}
                        >
                          <ReactCountryFlag
                            countryCode={country['alpha-2'] || ""}
                            svg
                            style={{ width: "1.5em", height: "1.5em" }}
                          />
                          {country.name.toUpperCase()}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="flex flex-col gap-6"
            >
              <Label htmlFor="visit" className="text-4xl">
                Where do you want to visit?
              </Label>
              <div className="relative w-full border rounded-xl shadow-sm">
                <input
                  id="visit"
                  value={toCountry}
                  onChange={(e) => handleChange(e, "to")}
                  placeholder="Type a country..."
                  className="w-full py-5 px-6 text-2xl bg-yellow-200"
                />
                <AnimatePresence>
                  {filtered.length > 0 && (
                    <motion.ul
                      className="absolute z-10 w-full rounded-b-md border bg-white shadow-lg"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {filtered
                        .filter((country) => country.name !== fromCountry)
                        .map((country) => (
                          <motion.li
                            key={country['alpha-2']}
                            className="cursor-pointer flex items-center gap-3 px-4 py-4 text-2xl hover:bg-yellow-300"
                            onClick={() => handleSelect(country)}
                            // variants={itemVariants}
                          >
                            <ReactCountryFlag
                              countryCode={country['alpha-2'] || ""}
                              svg
                              style={{ width: "1.5em", height: "1.5em" }}
                            />
                            {country.name.toUpperCase()}
                          </motion.li>
                        ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
                
              </div>
              <Button className="w-30" variant="outline" onClick={() => setStep(1)}>
                    Back
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
