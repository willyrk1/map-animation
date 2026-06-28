import React from "react";
import { Position } from "geojson";
import { position2CSV } from "./utility";
import { MapHighlight } from "./mapReducer";

interface CountryHighlightProps {
  highlight: MapHighlight
  coordinates: Array<Array<Position>>
  zoom: number
}

// Outlines a shape (a country's current borders, or an arbitrary custom area
// — see MapHighlight) with a soft gold "spotlight" glow, to draw the
// reader's eye to whatever is about to change in the next step. Drawn as two
// stacked strokes sharing one fade-controlled opacity: a wide, faint halo
// underneath and a crisp line on top.
export default React.memo(function CountryHighlight(props: Readonly<CountryHighlightProps>) {
  const { highlight, coordinates, zoom } = props
  const { opacity, ...restPathProps } = highlight.svgPathProps ?? {}

  return (
    <>
      {coordinates.map((ring, index) => {
        const d = `M ${ring.map(position2CSV).join(' ')} Z`
        return (
          <g key={index} opacity={opacity}>
            <path d={d} fill="none" stroke="#f2c14e" strokeWidth={6 / zoom} strokeLinejoin="round" opacity={0.35} />
            <path d={d} fill="none" stroke="#f2c14e" strokeWidth={1.6 / zoom} strokeLinejoin="round" {...restPathProps} />
          </g>
        )
      })}
    </>
  )
})
