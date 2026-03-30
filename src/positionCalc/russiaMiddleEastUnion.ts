import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { getCountryByName, union } from "../utility"
import karsJson from "../data/Kars.json"
import getRussiaPolandUnion from "./russiaPolandUnion"

let russiaMiddleEastUnion: Array<Array<Position>>

export default function getRussiaMiddleEastUnion(state: SteplessMapState) {
  if (russiaMiddleEastUnion) return russiaMiddleEastUnion
  const { countries } = state
  const armeniaCoordinates = getCountryByName(countries, 'Armenia').coordinates
  const azerbaijanCoordinates = getCountryByName(countries, 'Azerbaijan').coordinates
  const georgiaCoordinates = getCountryByName(countries, 'Georgia').coordinates
  return russiaMiddleEastUnion = union(getRussiaPolandUnion(state), armeniaCoordinates, azerbaijanCoordinates, georgiaCoordinates, karsJson)
}
