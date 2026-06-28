import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { getCountryByName, union } from "../utility"
import ottomanMiddleEastJson from '../data/OttomanMiddleEast.json'

let levantUnion: Array<Array<Position>>

export default function getLevantUnion(state: SteplessMapState) {
  if (levantUnion) return levantUnion
  const { countries } = state
  const lebanonCoordinates = getCountryByName(countries, 'Lebanon').coordinates
  const israelCoordinates = getCountryByName(countries, 'Israel').coordinates
  const palestineCoordinates = getCountryByName(countries, 'Palestine').coordinates
  return levantUnion = union(lebanonCoordinates, israelCoordinates, palestineCoordinates, ottomanMiddleEastJson)
}
