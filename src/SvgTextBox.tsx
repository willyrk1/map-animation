import React from "react";
import { position2XY } from "./utility";
import { MapText } from "./mapReducer";

export default React.memo(function SvgTextBox(props: Readonly<MapText & { zoom: number }>) {
  const { id, coordinates, text = id, svgGProps, svgRectProps, svgTextProps, includeBackground = false, zoom } = props

  const textRef = React.useRef<SVGTextElement>(null)
  const rectRef = React.useRef<SVGRectElement>(null)

  const [x, y] = position2XY(coordinates)

  React.useEffect(() => {
    if (textRef.current && rectRef.current) {
      const padding = 3.5 / zoom
      const bbox = textRef.current.getBBox();
      rectRef.current.setAttribute('x', `${bbox.x - padding}`);
      rectRef.current.setAttribute('y', `${bbox.y - padding}`);
      rectRef.current.setAttribute('width', `${bbox.width + padding * 2}`);
      rectRef.current.setAttribute('height', `${bbox.height + padding * 2}`);
    }
  }, [includeBackground, text, coordinates, zoom]);

  return (
    <g className="svgText" {...svgGProps}>
      {includeBackground && <rect ref={rectRef} {...svgRectProps} />}
      <text ref={textRef} x={x} y={y} {...svgTextProps}>
        {Array.isArray(text) ? text.map((line, index) => (
          <tspan key={line} x={x} dy={index ? "1.2em" : `${0.6 * (1 - text.length)}em`}>{line}</tspan>
        )) : text}
      </text>
    </g>
  )
})
