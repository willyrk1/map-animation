import React from "react";
import { CountryDetails } from "./utility";
import PositionPath from "./PositionPath.tsx";

// Renders all of a country's rings (a country may be several polygons, e.g.
// mainland + islands) as PositionPaths sharing the country's pathProps.
export default React.memo(function Country(props: Readonly<CountryDetails>) {
  const { name, coordinates, stripesColors, pathProps, ...rest } = props

  // A country with stripesColors is filled with a diagonal two-color stripe
  // pattern. The <pattern> is defined inline with a country-scoped id, and the
  // paths' fill is pointed at it (overriding whatever solid fill pathProps had).
  const patternId = `${name}Stripes`
  const effectivePathProps = stripesColors
    ? { ...pathProps, fill: `url(#${patternId})` }
    : pathProps

  return (
    <>
      {stripesColors && (
        <defs>
          <pattern id={patternId} patternUnits="userSpaceOnUse" width="0.3" height="0.3" patternTransform="rotate(45)">
            <rect width="0.15" height="0.3" fill={stripesColors[0]} />
            <rect x="0.15" width="0.15" height="0.3" fill={stripesColors[1]} />
          </pattern>
        </defs>
      )}
      {coordinates.map((countryCoordinates, index) => (
        <PositionPath key={`${name}${index}`}
          countryName={name}
          countryCoordinates={countryCoordinates}
          pathProps={effectivePathProps}
          {...rest}
        />
      ))}
    </>
  )
})
