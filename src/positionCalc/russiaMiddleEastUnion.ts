import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"
import karsJson from "../data/Kars.json"
import getRussiaPolandUnion from "./russiaPolandUnion"

let russiaMiddleEastUnion: Array<Array<Position>> | undefined

export default function getRussiaMiddleEastUnion(state: SteplessMapState) {
  if (russiaMiddleEastUnion) return russiaMiddleEastUnion
  const { countries } = state
  const armeniaCoordinates = countries.find(({ name }) => name === 'Armenia')?.coordinates
  const azerbaijanCoordinates = countries.find(({ name }) => name === 'Azerbaijan')?.coordinates
  const georgiaCoordinates = countries.find(({ name }) => name === 'Georgia')?.coordinates
  const russiaPolandUnion = getRussiaPolandUnion(state)
  if (russiaPolandUnion && armeniaCoordinates && azerbaijanCoordinates && georgiaCoordinates) {
    return russiaMiddleEastUnion = union(russiaPolandUnion, armeniaCoordinates, azerbaijanCoordinates, georgiaCoordinates, karsJson)
  }
}
