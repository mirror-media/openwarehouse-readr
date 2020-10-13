import React, { useState } from 'react'
import './NewDateTime.style.css'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import './DateFormat'

function NewDateTime({ value, onChange }) {
  const [inputField, setInputField] = useState('')

  // react-datetime accept integer unix timestamp
  // transform ISO 8601 to unix timestamp
  const newValue = Date.parse(value)

  // get selected unix timestamp by moment from callback
  const changeHandler = (moment) => {
    const selectUnixTimestamp = parseInt(moment.format('x'))
    const selectISO8601 = new Date(nowUnixTimestamp).toISOString()

    setInputField(selectUnixTimestamp)
    onChange(selectISO8601)
  }

  // get current unix timestamp
  const nowHandler = (e) => {
    e.preventDefault()
    const nowUnixTimestamp = Date.now()
    const nowISO8601 = new Date(nowUnixTimestamp).toISOString()

    setInputField(nowUnixTimestamp)
    onChange(nowISO8601)
  }

  return (
    <div className="NewDateTime">
      <Datetime
        value={inputField}
        initialValue={newValue ? newValue : ''}
        onChange={(moment) => changeHandler(moment)}
        dateFormat="YYYY-MM-DD"
        timeFormat="HH:mm:ss"
      />
      <button className="nowButton" onClick={(e) => nowHandler(e)}>
        Now
      </button>
    </div>
  )
}

export default NewDateTime
