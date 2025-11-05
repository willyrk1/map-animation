import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"
import ottomanWestThraceJson from '../data/OttomanWestThrace.json'

let ottomanEuropeUnion: Array<Array<Position>> | undefined

export default function getOttomanEuropeUnion({ countries }: SteplessMapState) {
  if (ottomanEuropeUnion) return ottomanEuropeUnion
  const turkeyCoordinates = countries.find(({ name }) => name === 'Turkey')?.coordinates
  if (turkeyCoordinates) {
    return ottomanEuropeUnion = union(turkeyCoordinates, ottomanWestThraceJson)
  }
}
