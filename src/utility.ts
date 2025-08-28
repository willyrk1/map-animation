import modernCountriesHighRes from "./custom.hires.geo.json"
import {Feature, FeatureCollection, Position} from "geojson";

export interface PathTransformer {
  transformFn?: (input: React.SVGProps<SVGPathElement>) => React.SVGProps<SVGPathElement>
}

export type LongLat = [number, number]

export interface CountryDetails {
  name: string
  coordinates: Array<Array<LongLat>>
}

const RAD2DEG = 180 / Math.PI;
const PI_4 = Math.PI / 4;

export function lat2y(lat: number) {
    return Math.log(Math.tan((lat / 90 + 1) * PI_4 )) * RAD2DEG;
}

export function longLat2CSV([long, lat]: LongLat) {
  return `${long + 180},${180 - lat2y(lat)}`
}

export function latLong2ViewBox(left: number, top: number, right: number, bottom: number) {
  const bottomY = lat2y(bottom)
  const topY = lat2y(top)
  return `${left + 180} ${180 - topY} ${right - left} ${topY - bottomY}`
}

// export function getCountriesEvery5mi() {
//   return modernCountriesEvery5mi as unknown as Record<string, CountryDetails>
// }

export function getCountriesHighRes() {
  return geoJson2CountryDetails(modernCountriesHighRes as FeatureCollection)
}

function geoJson2CountryDetails(geoJson: FeatureCollection) {
  return geoJson.features.reduce(toCountryDetails, {})
}

function toCountryDetails(countryDetailsMap: Record<string, CountryDetails>, feature: Feature){
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
  if (coordinates)
    countryDetailsMap[name] = { name, coordinates }

  return countryDetailsMap
}
