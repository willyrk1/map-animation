import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import getRussiaFinlandUnion from "./russiaFinlandUnion"
import { difference, getCountryByName, union } from "../utility"
import memellandJson from '../data/Memelland.json'

let russiaBalticsUnion: Array<Array<Position>>

export default function getRussiaBalticsUnion(state: SteplessMapState) {
  if (russiaBalticsUnion) return russiaBalticsUnion
  const { countries } = state
  const estoniaCoordinates = getCountryByName(countries, 'Estonia').coordinates
  const latviaCoordinates = getCountryByName(countries, 'Latvia').coordinates
  const lithuaniaCoordinates = getCountryByName(countries, 'Lithuania').coordinates
  const russiaFinlandUnion = getRussiaFinlandUnion(state)
  return russiaBalticsUnion = union(russiaFinlandUnion, estoniaCoordinates, latviaCoordinates, difference(lithuaniaCoordinates, memellandJson))
}
