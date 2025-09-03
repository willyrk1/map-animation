import { Feature, FeatureCollection, Polygon, Position } from "geojson";
import React from "react";
import serbiaGeoJson from "./Serbia.json";

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

const vojvodinaFeatureNames = [
  "Sremski",
  "Južno-Backi",
  "Zapadno-Backi",
  "Severno-Backi",
  "Severno-Banatski",
  "Srednje-Banatski",
  "Južno-Banatski",
]

export function getVojvodinaOriginal() {
  const vojvodinaShapes = vojvodinaFeatureNames
    .map(name => (serbiaGeoJson as FeatureCollection).features.find(f => f.properties?.name === name))
    .filter(isPolygonFeature)
    .map(f => f.geometry.coordinates.flat())
  const coordinates = joinShapes(...vojvodinaShapes)
  return {
    name: "Vojvodina",
    coordinates: [coordinates]
  }
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

export function positionsMatch(coord1: Position, coord2: Position) {
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
  const path1Fixed = positionsMatch(path1[0], path1[path1.length - 1]) ? path1.slice(1) : path1
  const path2Fixed = positionsMatch(path2[0], path2[path2.length - 1]) ? path2.slice(1) : path2

  const returnCoordinates: Array<Position> = []

  // Walk path 1 until it meets path 2.
  let index1 = 0
  let index2 = path2Fixed.findIndex(pos2 => positionsMatch(pos2, path1Fixed[index1]))
  while (index1 < path1Fixed.length && index2 < 0) {
    returnCoordinates.push(path1Fixed[index1])
    index1++
    index2 = path2Fixed.findIndex(pos2 => positionsMatch(pos2, path1Fixed[index1]))
  }

  if (returnCoordinates.length) {
    // If the first segment added elements, then we'll walk both in the same direction to find
    // the end of the shared border, i.e. the second intersection.
    const firstIntersection = index2
    const direction2 = positionsMatch(safeGet(path2Fixed, index2 - 1), safeGet(path1Fixed, index1 + 1)) ? -1 : 1

    while (positionsMatch(safeGet(path1Fixed, index1), safeGet(path2Fixed, index2))) {
      index1++
      index2 += direction2
    }

    // Now we'll go back to the first intersection and walk the 2nd path in reverse to complete the 2nd circle.
    for (
      let reverseIndex2 = firstIntersection;
      !positionsMatch(safeGet(path2Fixed, reverseIndex2), safeGet(path2Fixed, index2 - direction2));
      reverseIndex2 -= direction2
    ) {
      returnCoordinates.push(safeGet(path2Fixed, reverseIndex2))
    }

    // Then walk the first path from the second intersection back to the beginning to complete the 1st circle.
    for (
      index1--;
      !positionsMatch(safeGet(path1Fixed, index1), safeGet(path1Fixed, 0));
      index1++
    ) {
      returnCoordinates.push(safeGet(path1Fixed, index1))
    }
  }
  else {
    // If the first segment is empty, then we started in the middle of the shared boundary. First determine orientation.
    const needReverse = positionsMatch(safeGet(path2Fixed, index2 - 1), path1Fixed[1]) ||
      positionsMatch(safeGet(path2Fixed, index2 + 1), path1Fixed[path1Fixed.length - 1])
    const direction2 = needReverse ? -1 : 1

    // Walk to one end of the boundary.
    const start2 = index2
    while (positionsMatch(path1Fixed[index1], safeGet(path2Fixed, index2))) {
      index1++
      index2 += direction2
    }

    // Walk to the opposite end.
    let index1Reverse = -1, index2Reverse = start2 - direction2
    while (positionsMatch(safeGet(path1Fixed, index1Reverse), safeGet(path2Fixed, index2Reverse))) {
      index1Reverse--
      index2Reverse -= direction2
    }

    // Now start building the new boundary. Start with first intersection.
    returnCoordinates.push(safeGet(path1Fixed, index1 - 1))

    // Walk to second intersection.
    while (!positionsMatch(safeGet(path1Fixed, index1), safeGet(path1Fixed, index1Reverse + 1))) {
      returnCoordinates.push(safeGet(path1Fixed, index1))
      index1++
    }

    // Now add second intersection.
    returnCoordinates.push(safeGet(path1Fixed, index1Reverse + 1))

    // Walk from second intersection back to first.
    while (!positionsMatch(safeGet(path2Fixed, index2Reverse), safeGet(path2Fixed, index2 - direction2))) {
      returnCoordinates.push(safeGet(path2Fixed, index2Reverse))
      index2Reverse -= direction2
    }
  }

  return returnCoordinates
}

export function getDistanceFromPositionInMiles([lon1, lat1]: Position, [lon2, lat2]: Position) {
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

export function safeGet<T>(ary: Array<T>, index: number) {
  return ary[((index % ary.length) + ary.length) % ary.length]
}
