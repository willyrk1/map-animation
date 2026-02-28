import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { getCountryByName, union } from "../utility"
import ottomanWestThraceJson from '../data/OttomanWestThrace.json'

let ottomanEuropeUnion: Array<Array<Position>>

export default function getOttomanEuropeUnion({ countries }: SteplessMapState) {
  if (ottomanEuropeUnion) return ottomanEuropeUnion
  const turkeyCoordinates = getCountryByName(countries, 'Turkey').coordinates
  return ottomanEuropeUnion = union(turkeyCoordinates, ottomanWestThraceJson)
}
