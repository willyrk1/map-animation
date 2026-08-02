import React from "react";
import { position2XY, Zoom } from "./utility";
import { MapText } from "./mapReducer";

export default React.memo(function SvgTextBox(props: Readonly<MapText & Zoom>) {
  const {
      id, coordinates, text = id, heading, rotation, opacity, fontPct, color, svgGProps,
      svgRectProps, svgTextProps, includeBackground = false, zoom
  } = props

  const textRef = React.useRef<SVGTextElement>(null)
  const rectRef = React.useRef<SVGRectElement>(null)
  const shadowRectRef = React.useRef<SVGRectElement>(null)

  const [x, y] = position2XY(coordinates)
  const cornerRadius = 2.2 / zoom
  const shadowOffset = 1.1 / zoom

  React.useEffect(() => {
    if (textRef.current && rectRef.current) {
      const padding = 3.5 / zoom
      const bbox = textRef.current.getBBox();
      const rectX = bbox.x - padding;
      const rectY = bbox.y - padding;
      const rectWidth = bbox.width + padding * 2;
      const rectHeight = bbox.height + padding * 2;
      rectRef.current.setAttribute('x', `${rectX}`);
      rectRef.current.setAttribute('y', `${rectY}`);
      rectRef.current.setAttribute('width', `${rectWidth}`);
      rectRef.current.setAttribute('height', `${rectHeight}`);
      if (shadowRectRef.current) {
        shadowRectRef.current.setAttribute('x', `${rectX + shadowOffset}`);
        shadowRectRef.current.setAttribute('y', `${rectY + shadowOffset}`);
        shadowRectRef.current.setAttribute('width', `${rectWidth}`);
        shadowRectRef.current.setAttribute('height', `${rectHeight}`);
      }
    }
  }, [includeBackground, text, heading, coordinates, zoom, shadowOffset]);

  // Body text plus an optional heading line stacked above it. When a heading is
  // present we always render tspans so the two stack; a plain single-line string
  // with no heading still renders inline (unchanged from before).
  const bodyLines = Array.isArray(text) ? text : [text]
  const lines = heading ? [heading, ...bodyLines] : bodyLines

  return (
    <g
      className="svgText"
      fontSize={6 / zoom}
      transform={rotation ? `rotate(${rotation}, ${x}, ${y})` : undefined}
      opacity={opacity}
      {...svgGProps}
    >
      {includeBackground && (
        <rect ref={shadowRectRef} className="svgTextShadow" rx={cornerRadius} ry={cornerRadius} />
      )}
      {includeBackground && <rect ref={rectRef} rx={cornerRadius} ry={cornerRadius} {...svgRectProps} />}
      <text ref={textRef} x={x} y={y} fontSize={fontPct !== undefined ? `${fontPct}%` : undefined} style={color ? { fill: color } : undefined} {...svgTextProps}>
        {heading || Array.isArray(text) ? lines.map((line, index) => (
          <tspan
            key={index}
            x={x}
            dy={index ? "1.2em" : `${0.6 * (1 - lines.length)}em`}
            className={heading && index === 0 ? 'summaryHeading' : undefined}
          >{line}</tspan>
        )) : text}
      </text>
    </g>
  )
})
