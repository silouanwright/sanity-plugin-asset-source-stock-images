import React from 'react'

export const BaseSVG = ({children}: {children: React.ReactNode}) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    style={{transform: 'scale(0.8)', transformOrigin: 'top'}}
  >
    {children}
  </svg>
)
