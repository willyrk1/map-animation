import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import getRussiaUkraineUnion from "./russiaUkraineUnion"
import { difference, union } from "../utility"
import congressPolandJson from "../data/CongressPoland.json"

let russiaPolandUnion: Array<Array<Position>> | undefined

export default function getRussiaPolandUnion(state: SteplessMapState) {
  if (russiaPolandUnion) return russiaPolandUnion
  const { countries } = state
  const polandCoordinates = countries.find(({ name }) => name === 'Poland')?.coordinates
  const russiaUkraineUnion = getRussiaUkraineUnion(state)
  if (russiaUkraineUnion && polandCoordinates) {
    const [, eastPoland] = difference(polandCoordinates, congressPolandJson)
    return russiaPolandUnion = union(russiaUkraineUnion, [eastPoland], congressPolandJson)
  }
}
