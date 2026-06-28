import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import getAustriaHungaryUnion from "./austriaHungaryUnion"
import getCzechSlovakiaUnion from "./czechSlovakiaUnion"
import { union } from "../utility"

let ahCzechUnion: Array<Array<Position>>

export default function getAHCzechUnion(state: SteplessMapState) {
  if (ahCzechUnion) return ahCzechUnion
  return ahCzechUnion = union(getAustriaHungaryUnion(state), getCzechSlovakiaUnion(state))
}
