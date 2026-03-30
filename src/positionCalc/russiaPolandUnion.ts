import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import getRussiaUkraineUnion from "./russiaUkraineUnion"
import { union } from "../utility"
import congressPolandJson from "../data/CongressPoland.json"

let russiaPolandUnion: Array<Array<Position>>

export default function getRussiaPolandUnion(state: SteplessMapState) {
  if (russiaPolandUnion) return russiaPolandUnion
  return russiaPolandUnion = union(getRussiaUkraineUnion(state), congressPolandJson)
}
