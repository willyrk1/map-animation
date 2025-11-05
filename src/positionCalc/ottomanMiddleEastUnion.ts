import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"
import getOttomanEuropeUnion from "./ottomanEuropeUnion"
import ottomanMiddleEastJson from '../data/OttomanMiddleEast.json'

let ottomanMiddleEastUnion: Array<Array<Position>> | undefined

export default function getOttomanMiddleEastUnion(state: SteplessMapState) {
  if (ottomanMiddleEastUnion) return ottomanMiddleEastUnion
  const { countries } = state
  const lebanonCoordinates = countries.find(({ name }) => name === 'Lebanon')?.coordinates
  const israelCoordinates = countries.find(({ name }) => name === 'Israel')?.coordinates
  const palestineCoordinates = countries.find(({ name }) => name === 'Palestine')?.coordinates
  const ottomanEuropeUnion = getOttomanEuropeUnion(state)
  if (ottomanEuropeUnion && lebanonCoordinates && israelCoordinates && palestineCoordinates) {
    return ottomanMiddleEastUnion = union(ottomanEuropeUnion, lebanonCoordinates, israelCoordinates, palestineCoordinates, ottomanMiddleEastJson)
  }
}
