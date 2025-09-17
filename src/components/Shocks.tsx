"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShocksProps {
  homeCountry: string;
  visitingCountry: string;
}

interface Shock {
  shock: string;
  severity: string;
  tips: string;
}


export default function Shocks({ homeCountry, visitingCountry }: ShocksProps) {
  const [shocks, setShocks] = useState<Shock[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchShocks() {
      setLoading(true);
      try {
        const res = await fetch("/api/culture-shock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ homeCountry, visitingCountry }),
        });

        const data = await res.json();
        setShocks(data);
      } catch (e) {
        console.error("Failed to fetch shocks:", e);
      } finally {
        setLoading(false);
      }
    }

    if (homeCountry && visitingCountry) {
      fetchShocks();
    }
  }, [homeCountry, visitingCountry]);

  return (
    <div className="w-full flex flex-col items-center">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <AnimatePresence mode="wait">
          {shocks.length > 0 && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="p-4 border rounded-md shadow-md w-full max-w-md bg-white"
            >
              <h2 className="text-lg font-bold mb-2">
                Shock {currentIndex + 1}
              </h2>
              <p className="mb-2">{shocks[currentIndex].shock}</p>
              <p className="mb-2">
                <strong>Severity:</strong> {shocks[currentIndex].severity}
              </p>
              <p>
                <strong>Tips:</strong> {shocks[currentIndex].tips}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Navigation */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() =>
            setCurrentIndex((i) => (i > 0 ? i - 1 : shocks.length - 1))
          }
          disabled={shocks.length === 0}
        >
          Prev
        </button>
        <button
          onClick={() =>
            setCurrentIndex((i) => (i + 1) % shocks.length)
          }
          disabled={shocks.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}