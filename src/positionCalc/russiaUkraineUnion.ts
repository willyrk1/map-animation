import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { difference, union } from "../utility"
import galiciaJson from "../data/Galicia.json"
import bukovinaJson from "../data/Bukovina.json"
import getRussiaBelarusUnion from "./russiaBelarusUnion"

let russiaUkraineUnion: Array<Array<Position>> | undefined

export default function getRussiaUkraineUnion(state: SteplessMapState) {
  if (russiaUkraineUnion) return russiaUkraineUnion
  const { countries } = state
  const ukraineCoordinates = countries.find(({ name }) => name === 'Ukraine')?.coordinates
  const moldovaCoordinates = countries.find(({ name }) => name === 'Moldova')?.coordinates
  const russiaBelarusUnion = getRussiaBelarusUnion(state)
  if (russiaBelarusUnion && ukraineCoordinates && moldovaCoordinates) {
    const eastUkraineCoordinates = difference(ukraineCoordinates, galiciaJson, bukovinaJson)
    return russiaUkraineUnion = union(russiaBelarusUnion, moldovaCoordinates, eastUkraineCoordinates)
  }
}
