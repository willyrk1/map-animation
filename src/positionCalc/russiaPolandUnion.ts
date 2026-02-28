import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import getRussiaUkraineUnion from "./russiaUkraineUnion"
import { difference, getCountryByName, union } from "../utility"
import congressPolandJson from "../data/CongressPoland.json"

let russiaPolandUnion: Array<Array<Position>>

export default function getRussiaPolandUnion(state: SteplessMapState) {
  if (russiaPolandUnion) return russiaPolandUnion
  const { countries } = state
  const polandCoordinates = getCountryByName(countries, 'Poland').coordinates
  const russiaUkraineUnion = getRussiaUkraineUnion(state)
  const [, eastPoland] = difference(polandCoordinates, congressPolandJson)
  return russiaPolandUnion = union(russiaUkraineUnion, [eastPoland], congressPolandJson)
}
