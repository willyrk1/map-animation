import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"
import getOttomanEuropeUnion from "./ottomanEuropeUnion"
import getLevantUnion from "./levantUnion"

let ottomanMiddleEastUnion: Array<Array<Position>>

export default function getOttomanMiddleEastUnion(state: SteplessMapState) {
  if (ottomanMiddleEastUnion) return ottomanMiddleEastUnion
  return ottomanMiddleEastUnion = union(getOttomanEuropeUnion(state), getLevantUnion(state))
}
