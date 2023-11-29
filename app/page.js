'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [selectedYear, setSelectedYear] = useState(2023)
  const [yearlyFrequency, setYearlyFrequency] = useState(1)
  const [preferredDay, setPreferredDay] = useState('')
  const [generatedSchedule, setGeneratedSchedule] = useState('')

  const prompt = `Generate a schedule of events within the calendar year ${selectedYear} (between January 1 - December 30 ${selectedYear}). These events will occur ${yearlyFrequency} times yearly, spaced as evenly as possible throughout the year. Please ensure all dates selected are on ${preferredDay} dates. Please ensure to cross check with the ${selectedYear} calendar to ensure accurate dates within the selected year. Do not suggest any dates within the following year, adjust the distances between dates to ensure they all fall within a single calendar year.`

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
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }

      const data = await response.text()

      setGeneratedSchedule(data)
    } catch (error) {
      console.error("Error fetching schedule:", error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>
        Scheduler
      </h1>

      <form
        onSubmit={generateSchedule}
        className={styles.formElement}
      >
        <div className={styles.formSection}>
          <p>What year will these events take place?</p>
          <label>
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

        <div className={styles.formSection}>
          <p>How many events per year?</p>
          <label>
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

        <div className={styles.formSection}>
          <p>What are your preferred day(s) of the week?</p>
          <label>
            <select value={preferredDay} onChange={handleDayChange}>
              <option value="">Select a day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
              <option value="Weekend Only">Weekend Only</option>
              <option value="Weekday Only">Weekday Only</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          className={styles.button}
        >
          Submit
        </button>
      </form>

      <div className={styles.responseElement}>
        {
          loading ?
            <p> loading... </p>
            :
            <div>
              <p>
                {/* {generatedSchedule} */}
                {generatedSchedule.split('\n').map((date, index) => (
                  <span key={index}>
                    {date}
                    <br />
                  </span>
                ))}
              </p>
            </div>
        }
      </div>



    </main >
  )
}


