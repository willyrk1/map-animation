import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { difference, getCountryByName, union } from "../utility"
import galiciaJson from "../data/Galicia.json"
import bukovinaJson from "../data/Bukovina.json"
import getRussiaBelarusUnion from "./russiaBelarusUnion"

let russiaUkraineUnion: Array<Array<Position>>

export default function getRussiaUkraineUnion(state: SteplessMapState) {
  if (russiaUkraineUnion) return russiaUkraineUnion
  const { countries } = state
  const ukraineCoordinates = getCountryByName(countries, 'Ukraine').coordinates
  const moldovaCoordinates = getCountryByName(countries, 'Moldova').coordinates
  const russiaBelarusUnion = getRussiaBelarusUnion(state)
  const eastUkraineCoordinates = difference(ukraineCoordinates, galiciaJson, bukovinaJson)
  return russiaUkraineUnion = union(russiaBelarusUnion, moldovaCoordinates, eastUkraineCoordinates)
}
