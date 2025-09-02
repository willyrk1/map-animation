import { FeatureCollection, Position } from "geojson";
import modernGeoJson from "./custom.hires.geo.json"
import serbiaGeoJson from "./Serbia.json"
import { coordsMatch, geoJson2CountryDetails, getDistanceFromLonLatInMiles, isPolygonFeature, joinShapes, toMinimum } from "./utility";

export function getCountriesHighRes() {
  return geoJson2CountryDetails(modernGeoJson as FeatureCollection)
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

interface IndexedCoordinate {
  coordinate: Position
  index: number
  distance: number
}

export function getVojvodina(ahBalkansCoordinates: Position[], romaniaCoordinates: Position[]) {
  const vojvodinaShapes = vojvodinaFeatureNames
    .map(name => (serbiaGeoJson as FeatureCollection).features.find(f => f.properties?.name === name))
    .filter(isPolygonFeature)
    .map(f => f.geometry.coordinates.flat())
  const vojvodinaCoordinates = joinShapes(...vojvodinaShapes)

  function isOnAHBoundary(coordinate: Position) {
    function whereCoordinatesMatch(coordinateA: Position) {
      return coordsMatch(coordinate, coordinateA)
    }
    return ahBalkansCoordinates.find(whereCoordinatesMatch)
  }

  // Districts merged, now unify the boundaries. First, find the intersection of Vojvodina, Romania and Austria-Hungary,
  // i.e. on the Romania/Austria-Hungary border and closest to Vojvodina.
  function whereOnAHBoundary({ coordinate }: IndexedCoordinate) {
    return isOnAHBoundary(coordinate)
  }

  function distanceFromVojvodina([long, lat]: Position) {
    function toDistanceFromPoint([longV, latV]: Position) {
      return getDistanceFromLonLatInMiles(long, lat, longV, latV)
    }
    return vojvodinaCoordinates.map(toDistanceFromPoint).reduce(toMinimum)
  }

  function toVojvodinaClosest(acc: IndexedCoordinate, cur: IndexedCoordinate) {
    const distance = distanceFromVojvodina(cur.coordinate)
    return (distance < acc.distance) ? { ...cur, distance } : acc
  }

  const romaniaAHoverlap = romaniaCoordinates
    .map((coordinate, index) => ({ coordinate, index, distance: 500000 }))
    .filter(whereOnAHBoundary)

  const romaniaIntersection = romaniaAHoverlap.reduce(toVojvodinaClosest)

  const coordinates = [romaniaIntersection.coordinate]

  const romaniaDirection = isOnAHBoundary(romaniaCoordinates[romaniaIntersection.index + 1])

  return {
    name: "Vojvodina",
    coordinates: [coordinates]
  }
}

