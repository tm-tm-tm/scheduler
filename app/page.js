'use client'

import OpenAI from 'openai';
import { OpenAIStream } from 'ai';
import { useState, Suspense } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [updatedPrompt, setUpdatedPrompt] = useState('')
  const [selectedYear, setSelectedYear] = useState(2023)
  const [yearlyFrequency, setYearlyFrequency] = useState(1)
  const [monthlyFrequency, setMonthlyFrequency] = useState(0)
  const [includePublicHolidays, setIncludePublicHolidays] = useState(false)
  const [generatedSchedule, setGeneratedSchedule] = useState('')

  const prompt = `Generate a schedule of events. These events will be within the year ${selectedYear} and occur ${yearlyFrequency} times yearly, spaced evenly throughout the year.`

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value)
  }

  const handleNumberChange = (event) => {
    const newNumber = Math.max(1, Math.min(20, event.target.value));
    setYearlyFrequency(newNumber);
  }

  const generateSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.text();

      setGeneratedSchedule(data);
    } catch (error) {
      console.error("Error fetching schedule:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <h1>
        Scheduler
      </h1>

      <form onSubmit={generateSchedule}>
        <div>
          <p>What year will these events take place?</p>
          <label>
            Select a Year:
            <input
              type="number"
              value={selectedYear}
              onChange={handleYearChange}
              placeholder="Enter a year"
              min="2023"
              max="2030"
            />
          </label>
        </div>

        <div>
          <p>How many events do you want per year?</p>
          <label>
            Select Frequency:
            <input
              type="number"
              value={yearlyFrequency}
              onChange={handleNumberChange}
              placeholder="Enter a frequency per year"
              min="1"
              max="20"
            />
          </label>
        </div>

        <br />

        <button type="submit">
          Submit
        </button>
      </form>

      {generatedSchedule && (
        <div>
          <p>
            {generatedSchedule}
          </p>
        </div>
      )}

    </main>
  )
}
