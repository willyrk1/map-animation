import { Feature, FeatureCollection, Polygon, Position } from "geojson";
import React from "react";

export interface CountryDetails {
  name: string
  coordinates: Array<Array<Position>>
  pathProps?: React.SVGProps<SVGPathElement>
}

const RAD2DEG = 180 / Math.PI;
const PI_4 = Math.PI / 4;

export function lat2y(lat: number) {
  return Math.log(Math.tan((lat / 90 + 1) * PI_4)) * RAD2DEG;
}

export function position2CSV([long, lat]: Position) {
  return `${long + 180},${180 - lat2y(lat)}`
}

export function position2ViewBox(left: number, top: number, right: number, bottom: number) {
  const bottomY = lat2y(bottom)
  const topY = lat2y(top)
  return `${left + 180} ${180 - topY} ${right - left} ${topY - bottomY}`
}

export function viewBoxFromString(viewBoxString: string) {
  const [x, y, width, height] = viewBoxString.split(' ').map(v => +v)
  return { x, y, width, height }
}

export function isPolygonFeature(feature: Feature | undefined): feature is Feature<Polygon> {
  return feature?.geometry.type === "Polygon";
}

export function geoJson2CountryDetails(geoJson: FeatureCollection) {
  return geoJson.features.map(toCountryDetails)
}

function toCountryDetails(feature: Feature): CountryDetails {
  const p = feature.properties
  const name: string = p?.name
  const geometry = feature.geometry
  let coordinates: Array<Array<Position>> | undefined = undefined
  if (geometry.type === "Polygon") {
    coordinates = geometry.coordinates
  }
  else if (geometry.type === "MultiPolygon") {
    coordinates = geometry.coordinates.flat()
  }
  else {
    coordinates = []
  }

  return { name, coordinates }
}

export function coordsMatch(coord1: Position, coord2: Position) {
  return coord1[0] === coord2[0] && coord1[1] === coord2[1]
}

export function joinShapes(...paths: Array<Array<Position>>) {
  let [finalPath, ...otherPaths] = paths
  for (let otherPath of otherPaths)
    finalPath = _joinShapes(finalPath, otherPath)
  return finalPath
}

function _joinShapes(path1: Array<Position>, path2: Array<Position>) {
  // Geojson coordinates tend to duplicate the first and last elements which will confuse this algorithm.
  const path1Fixed = coordsMatch(path1[0], path1[path1.length - 1]) ? path1.slice(1) : path1
  const path2Fixed = coordsMatch(path2[0], path2[path2.length - 1]) ? path2.slice(1) : path2

  // Search (hard) for a first match between the paths.
  const firstMatchPath1Index = path1Fixed.findIndex(coord1 => path2Fixed.find(coord2 => coordsMatch(coord1, coord2)))
  if (firstMatchPath1Index < 0) {
    throw new Error("No touch points for joining paths.")
  }
  let firstMatchPath2Index = path2Fixed.findIndex(coord2 => coordsMatch(path1Fixed[firstMatchPath1Index], coord2))

  // If the first path1 coordinate is the match, then we don't know if it's the real start of the chain
  // or it's the middle and the real start is at the bottom wrapping up to the top. If so, leave it
  // let chain1Start = (firstMatchPath1Index > 0) ? firstMatchPath1Index : -1

  // Check it's a real chain and orient the 2nd path accordingly.
  let path2Oriented
  const nextPath1Index = (firstMatchPath1Index === path1Fixed.length - 1) ? 0 : firstMatchPath1Index + 1
  const prevPath1Index = (firstMatchPath1Index === 0) ? path1Fixed.length - 1 : firstMatchPath1Index - 1
  const nextPath2Index = (firstMatchPath2Index === path2Fixed.length - 1) ? 0 : firstMatchPath2Index + 1
  const prevPath2Index = (firstMatchPath2Index === 0) ? path2Fixed.length - 1 : firstMatchPath2Index - 1
  if (coordsMatch(path1Fixed[nextPath1Index], path2Fixed[nextPath2Index]))
    path2Oriented = path2Fixed
  else if (coordsMatch(path1Fixed[nextPath1Index], path2Fixed[prevPath2Index])) {
    path2Oriented = path2Fixed.toReversed()
    firstMatchPath2Index = path2Fixed.length - firstMatchPath2Index - 1
  }
  else {
    throw new Error("Can't join paths with one touch point.")
  }

  let
    chain1Start = firstMatchPath1Index,
    chain2Start = firstMatchPath2Index
  // If the first match was at the top, the real start could be at the bottom wrapping around to the top.
  // Let's go find it.
  if (firstMatchPath1Index === 0) {
    let startSearch1 = prevPath1Index, startSearch2 = (firstMatchPath2Index === 0) ? path2Oriented.length - 1 : firstMatchPath2Index - 1
    while (coordsMatch(path1Fixed[startSearch1], path2Oriented[startSearch2])) {
      chain1Start = startSearch1
      chain2Start = startSearch2
      startSearch1--
      startSearch2 = (startSearch2 === 0) ? path2Oriented.length - 1 : startSearch2 - 1
    }
  }

  // Chain starts are found. Now find the ends.
  let
    endSearch1 = nextPath1Index,
    endSearch2 = (firstMatchPath2Index === path2Oriented.length - 1) ? 0 : firstMatchPath2Index + 1,
    chain1End = firstMatchPath1Index,
    chain2End = firstMatchPath2Index
  while (coordsMatch(path1Fixed[endSearch1], path2Oriented[endSearch2])) {
    chain1End = endSearch1
    chain2End = endSearch2
    endSearch1 = (endSearch1 === path1Fixed.length - 1) ? 0 : endSearch1 + 1
    endSearch2 = (endSearch2 === path2Oriented.length - 1) ? 0 : endSearch2 + 1
  }

  if (chain1Start < chain1End && chain2Start < chain2End)
    return [
      ...path1Fixed.slice(0, chain1Start + 1),
      ...path2Oriented.slice(0, chain2Start).toReversed(),
      ...path2Oriented.slice(chain2End).toReversed(),
      ...path1Fixed.slice(chain1End + 1),
    ]
  if (chain1Start > chain1End && chain2Start < chain2End)
    return [
      ...path1Fixed.slice(chain1End, chain1Start + 1),
      ...path2Oriented.slice(0, chain2Start).toReversed(),
      ...path2Oriented.slice(chain2End + 1).toReversed(),
    ]
  if (chain1Start < chain1End && chain2Start > chain2End)
    return [
      ...path1Fixed.slice(0, chain1Start),
      ...path2Oriented.slice(chain2End, chain2Start + 1).toReversed(),
      ...path1Fixed.slice(chain1End + 1),
    ]
  // if (chain1Start > chain1End && chain2Start > chain2End)
  return [
    ...path1Fixed.slice(chain1End, chain1Start + 1),
    ...path2Oriented.slice(chain2End + 1, chain2Start).toReversed(),
  ]
}

export function getDistanceFromLonLatInMiles(lon1: number, lat1: number, lon2: number, lat2: number) {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

export function toMinimum(acc: number, cur: number) {
  return acc < cur ? acc : cur
}
