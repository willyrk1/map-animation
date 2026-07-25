import React from 'react'
import { position2XY, Zoom } from './utility'
import { PulsingCircle as PulsingCircleType } from './mapReducer'

type PulsingCircleProps = PulsingCircleType & Zoom

export default React.memo(function PulsingCircle({ center, radius, zoom }: Readonly<PulsingCircleProps>) {
  const [cx, cy] = position2XY(center)
  const r = radius / zoom
  return (
    <g className="pulseHighlight">
      <circle cx={cx} cy={cy} r={r} fill="red" fillOpacity={0.15} stroke="red" strokeWidth={3 / zoom} />
      <circle cx={cx} cy={cy} r={r * 1.65} fill="none" stroke="red" strokeWidth={1.5 / zoom} strokeOpacity={0.6} />
    </g>
  )
})
