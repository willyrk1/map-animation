import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import getRussiaFinlandUnion from "./russiaFinlandUnion"
import { difference, union } from "../utility"
import memellandJson from '../data/Memelland.json'

let russiaBalticsUnion: Array<Array<Position>> | undefined

export default function getRussiaBalticsUnion(state: SteplessMapState) {
  if (russiaBalticsUnion) return russiaBalticsUnion
  const { countries } = state
  const russiaCoordinates = countries.find(({ name }) => name === 'Russia')?.coordinates
  const estoniaCoordinates = countries.find(({ name }) => name === 'Estonia')?.coordinates
  const latviaCoordinates = countries.find(({ name }) => name === 'Latvia')?.coordinates
  const lithuaniaCoordinates = countries.find(({ name }) => name === 'Lithuania')?.coordinates
  const russiaFinlandUnion = getRussiaFinlandUnion(state)
  if (russiaFinlandUnion && russiaCoordinates && estoniaCoordinates && latviaCoordinates && lithuaniaCoordinates) {
    return russiaBalticsUnion = union(russiaFinlandUnion, estoniaCoordinates, latviaCoordinates, difference(lithuaniaCoordinates, memellandJson))
  }
}
