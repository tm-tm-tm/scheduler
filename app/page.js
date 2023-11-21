'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [selectedYear, setSelectedYear] = useState(2023)
  const [yearlyFrequency, setYearlyFrequency] = useState(1)
  const [preferredDay, setPreferredDay] = useState('')
  const [generatedSchedule, setGeneratedSchedule] = useState('')

  const prompt = `Generate a schedule of events within the calendar year ${selectedYear} (between January 1 - December 30 ${selectedYear}). These events will occur ${yearlyFrequency} times yearly, spaced as evenly as possible throughout the year. Please ensure all dates selected are on ${preferredDay} dates. Please ensure to cross check with the ${selectedYear} calendar to ensure accurate dates within the selected year.`

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value)
  }

  const handleDayChange = (event) => {
    setPreferredDay(event.target.value);
  }

  const handleEventNumberChange = (event) => {
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
          <p>How many events per year?</p>
          <label>
            Select Frequency:
            <input
              type="number"
              value={yearlyFrequency}
              onChange={handleEventNumberChange}
              placeholder="Enter a frequency per year"
              min="1"
              max="20"
            />
          </label>
        </div>

        <div>
          <p>What day of the week?</p>
          <label>
            Select a Day:
            <select value={preferredDay} onChange={handleDayChange}>
              <option value="">Select a day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </label>
        </div>

        <br />

        <button type="submit">
          Submit
        </button>
      </form>

      {
        loading ?
          <p> loading... </p> :
          <div>
            <p>
              {generatedSchedule}
            </p>
          </div>
      }

    </main >
  )
}
