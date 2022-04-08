import React from 'react'

export default function Spinner() {
  return (
    <div className="uk-spinner uk-icon">
      <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" ratio="1">
        <circle fill="none" stroke="#000" cx="15" cy="15" r="14">
        </circle>
      </svg>
    </div>
  )
}
