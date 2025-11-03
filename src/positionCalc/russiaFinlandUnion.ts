import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"

let russiaFinlandUnion: Array<Array<Position>> | undefined

export default function getRussiaFinlandUnion({ countries }: SteplessMapState) {
  if (russiaFinlandUnion) return russiaFinlandUnion
  const russiaCoordinates = countries.find(({ name }) => name === 'Russia')?.coordinates
  const finlandCoordinates = countries.find(({ name }) => name === 'Finland')?.coordinates
  if (russiaCoordinates && finlandCoordinates) {
    return russiaFinlandUnion = union(russiaCoordinates, finlandCoordinates)
  }
}
