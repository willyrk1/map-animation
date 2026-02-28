import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { getCountryByName, union } from "../utility"
import getOttomanEuropeUnion from "./ottomanEuropeUnion"
import ottomanMiddleEastJson from '../data/OttomanMiddleEast.json'

let ottomanMiddleEastUnion: Array<Array<Position>>

export default function getOttomanMiddleEastUnion(state: SteplessMapState) {
  if (ottomanMiddleEastUnion) return ottomanMiddleEastUnion
  const { countries } = state
  const lebanonCoordinates = getCountryByName(countries, 'Lebanon').coordinates
  const israelCoordinates = getCountryByName(countries, 'Israel').coordinates
  const palestineCoordinates = getCountryByName(countries, 'Palestine').coordinates
  const ottomanEuropeUnion = getOttomanEuropeUnion(state)
  return ottomanMiddleEastUnion = union(ottomanEuropeUnion, lebanonCoordinates, israelCoordinates, palestineCoordinates, ottomanMiddleEastJson)
}
