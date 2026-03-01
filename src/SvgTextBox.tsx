import React from "react";
import { position2XY } from "./utility";
import { MapText } from "./mapReducer";

export interface SvgTextBoxProps {
  mapText: MapText
}

const SvgTextBox = React.memo(function SvgTextBox(props: Readonly<SvgTextBoxProps>) {
  const { mapText: {coordinates, text, svgTextProps} } = props
  const [x, y] = position2XY(coordinates)

  return Array.isArray(text) ? (
    <text x={x} y={y} textAnchor='middle' dominantBaseline='middle'>
      <tspan x={x} dy="-0.6em">LINE 1</tspan>
      <tspan x={x} dy="1.2em">LINE 2</tspan>
    </text>
  ) : (
    <text x={x} y={y} textAnchor='middle' dominantBaseline='middle' {...svgTextProps}>{text}</text>
  )

})

export default SvgTextBox
