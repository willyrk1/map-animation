import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"
import getRussiaPolandUnion from "./russiaPolandUnion"
import getCaucasusUnion from "./caucasusUnion"

let russiaMiddleEastUnion: Array<Array<Position>>

export default function getRussiaMiddleEastUnion(state: SteplessMapState) {
  if (russiaMiddleEastUnion) return russiaMiddleEastUnion
  return russiaMiddleEastUnion = union(getRussiaPolandUnion(state), getCaucasusUnion(state))
}
