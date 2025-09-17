"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Shocks({ homeCountry, visitingCountry }) {
  const [shocks, setShocks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch shocks from API
  useEffect(() => {
    if (!homeCountry || !visitingCountry) return;

    const fetchShocks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/culture-shock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ homeCountry, visitingCountry }),
        });
        const data = await res.json();
        setShocks(data.result || []);
        setCurrentIndex(0);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch culture shocks");
      } finally {
        setLoading(false);
      }
    };

    fetchShocks();
  }, [homeCountry, visitingCountry]);

  if (loading) return <p>Loading culture shocks...</p>;
  if (error) return <p>{error}</p>;
  if (!shocks.length) return <p>No shocks found.</p>;

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % shocks.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + shocks.length) % shocks.length);

  return (
    <div style={{ position: "relative", width: "400px", margin: "auto" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          style={{
            background: "#f0f0f0",
            padding: "20px",
            borderRadius: "10px",
            minHeight: "150px",
          }}
        >
          <h3>Shock: {shocks[currentIndex].shock}</h3>
          <p><strong>Severity:</strong> {shocks[currentIndex].severity}</p>
          <p><strong>Tips:</strong> {shocks[currentIndex].tips}</p>
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
        <button onClick={prevSlide}>Previous</button>
        <button onClick={nextSlide}>Next</button>
      </div>
    </div>
  );
}
