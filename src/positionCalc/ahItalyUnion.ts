import { Position } from "geojson"
import getAHBalkansUnion from "./ahBalkansUnion"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"
import trentinoSouthTyrolJson from "../data/TrentinoSouthTyrol.json"

let ahItalyUnion: Array<Array<Position>>

export default function getAHItalyUnion(state: SteplessMapState) {
  if (ahItalyUnion) return ahItalyUnion
  return ahItalyUnion = union(getAHBalkansUnion(state), trentinoSouthTyrolJson)
}
