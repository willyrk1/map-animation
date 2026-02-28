import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { getCountryByName, union } from "../utility"

let russiaFinlandUnion: Array<Array<Position>>

export default function getRussiaFinlandUnion({ countries }: SteplessMapState) {
  if (russiaFinlandUnion) return russiaFinlandUnion
  const russiaCoordinates = getCountryByName(countries, 'Russia').coordinates
  const finlandCoordinates = getCountryByName(countries, 'Finland').coordinates
  return russiaFinlandUnion = union(russiaCoordinates, finlandCoordinates)
}
