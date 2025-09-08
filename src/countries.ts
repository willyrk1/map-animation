import {FeatureCollection, Position} from "geojson";
import modernGeoJson from "./custom.hires.geo.json"
import serbiaGeoJson from "./Serbia.json"
import {
  geoJson2CountryDetails,
  getDistanceFromPositionInMiles,
  isPolygonFeature,
  joinShapes,
  positionsMatch,
  safeGet,
} from "./utility";

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

interface IndexedDistance {
  index: number
  distance: number
}

export function getVojvodina(ahBalkansCoordinates: Position[], romaniaCoordinates: Position[], serbiaCoordinates: Position[]) {
  const vojvodinaShapes = vojvodinaFeatureNames
    .map(name => (serbiaGeoJson as FeatureCollection).features.find(f => f.properties?.name === name))
    .filter(isPolygonFeature)
    .map(f => f.geometry.coordinates.flat())
  const vojvodinaCoordinates = joinShapes(...vojvodinaShapes)

  function closestVojvodinaPoint(position: Position) {
    function toDistanceFromPoint(positionV: Position, index: number) {
      return {index, distance: getDistanceFromPositionInMiles(position, positionV)}
    }

    function toMinimum(acc: IndexedDistance, cur: IndexedDistance) {
      return acc.distance < cur.distance ? acc : cur
    }

    return vojvodinaCoordinates.map(toDistanceFromPoint).reduce(toMinimum)
  }

  const returnVojvodina: Array<Position> = []

  // Districts merged, now unify the boundaries. First, find the intersection of Serbia, Romania and Austria-Hungary.
  function isOnSerbiaBoundary(position: Position) {
    return serbiaCoordinates.find(sPos => positionsMatch(sPos, position))
  }

  function isOnRomaniaBoundary(position: Position) {
    return romaniaCoordinates.find(rPos => positionsMatch(rPos, position))
  }

  const ahRomSerbIntersection = ahBalkansCoordinates.findIndex((ahPosition: Position) =>
      isOnRomaniaBoundary(ahPosition) && isOnSerbiaBoundary(ahPosition)
  )

  // Walk along Austria-Hungary/Serbia boundary until we get to end of Vojvodina
  const ahDirection = isOnSerbiaBoundary(safeGet(ahBalkansCoordinates, ahRomSerbIntersection + 1)) ? 1 : -1

  for (let ahIndex = ahRomSerbIntersection;
       closestVojvodinaPoint(safeGet(ahBalkansCoordinates, ahIndex)).distance < 1;
       ahIndex += ahDirection) {
    returnVojvodina.push(safeGet(ahBalkansCoordinates, ahIndex))
  }

  // Now walk along the Romania/Serbia boundary until we get to end of Vojvodina (add to the array backwards).
  const romaniaIntersection = romaniaCoordinates.findIndex(rPos => positionsMatch(rPos, ahBalkansCoordinates[ahRomSerbIntersection]))
  const rDirection = isOnSerbiaBoundary(safeGet(romaniaCoordinates, romaniaIntersection + 1)) ? 1 : -1

  for (let rIndex = romaniaIntersection + rDirection;
       closestVojvodinaPoint(safeGet(romaniaCoordinates, rIndex)).distance < 1;
       rIndex += rDirection) {
    returnVojvodina.unshift(safeGet(romaniaCoordinates, rIndex))
  }

  // Now walk along the Vojvodina boundary from Austria-Hungary to Romania.
  const ahVojvodinaIntersection = returnVojvodina[returnVojvodina.length - 1]
  const romaniaVojvodinaIntersection = returnVojvodina[0]
  const startPoint = closestVojvodinaPoint(ahVojvodinaIntersection)
  const vojvodinaAHIntersection = startPoint.index

  // This is a bit of a guess, but determine direction by seeing if we get closer to the Romania intersection.
  const vDirection = getDistanceFromPositionInMiles(safeGet(vojvodinaCoordinates, vojvodinaAHIntersection + 1), romaniaVojvodinaIntersection)
      < getDistanceFromPositionInMiles(vojvodinaCoordinates[vojvodinaAHIntersection], romaniaVojvodinaIntersection) ? 1 : -1

  for (let vIndex = vojvodinaAHIntersection;
       getDistanceFromPositionInMiles(safeGet(vojvodinaCoordinates, vIndex), romaniaVojvodinaIntersection) > 1;
       vIndex += vDirection) {
    returnVojvodina.push(safeGet(vojvodinaCoordinates, vIndex))
  }

  return {
    name: "Vojvodina",
    coordinates: [returnVojvodina]
  }
}
