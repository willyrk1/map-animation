import { Position } from "geojson"
import getAHCzechUnion from "./ahCzechUnion"
import getBalkanTrioUnion from "./balkanTrioUnion"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"

let ahBalkansUnion: Array<Array<Position>>

export default function getAHBalkansUnion(state: SteplessMapState) {
  if (ahBalkansUnion) return ahBalkansUnion
  return ahBalkansUnion = union(getAHCzechUnion(state), getBalkanTrioUnion(state))
}
