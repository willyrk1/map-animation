import React from 'react'
import { lat2y, Zoom } from './utility'

const [northLat, southLat] = [85, -60]
const WORLDHEIGHT = lat2y(northLat) - lat2y(southLat)

// SvgContainer reads its animatableProps as [centerLong, centerLat, zoom] and
// turns them into the <svg> viewBox.
export interface SvgContainerProps extends Zoom {
  centerLong: number
  centerLat: number
}

export default function SvgContainer(props: React.PropsWithChildren<SvgContainerProps>) {
  const { centerLong, centerLat, zoom, children } = props

  const viewBox = React.useMemo(() => {
    const height = WORLDHEIGHT / zoom
    const [x, y] = [centerLong + 180, 180 - lat2y(centerLat)]
    return `${x - 1} ${y - height / 2} 2 ${height}`
  }, [centerLong, centerLat, zoom])

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox}>
      {children}
    </svg>
  )
}
