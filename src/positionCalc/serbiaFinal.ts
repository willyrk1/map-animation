import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { difference, getCountryByName, union } from "../utility"
import vojvodinaJson from "../data/Vojvodina.json"
import seNMacedoniaJson from '../data/seNMacedonia.json'
import bosilegradJson from '../data/Bosilegrad.json'
import nBulgariaSerbiaJson from '../data/nBulgariaSerbia.json'
import tzaribrodJson from '../data/Tzaribrod.json'

let serbiaFinalUnion: Array<Array<Position>>

export default function getSerbiaFinalUnion(state: SteplessMapState) {
  if (serbiaFinalUnion) return serbiaFinalUnion
  const { countries } = state
  const serbiaCoordinates = getCountryByName(countries, 'Serbia').coordinates
  const kosovoCoordinates = getCountryByName(countries, 'Kosovo').coordinates
  const northMacedoniaCoordinates = getCountryByName(countries, 'North Macedonia').coordinates
  return serbiaFinalUnion = difference(union(serbiaCoordinates, kosovoCoordinates, northMacedoniaCoordinates), vojvodinaJson, seNMacedoniaJson, bosilegradJson, nBulgariaSerbiaJson, tzaribrodJson)
}
