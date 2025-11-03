import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { difference, union } from "../utility"
import vojvodinaJson from "../data/Vojvodina.json"
import seNMacedoniaJson from '../data/seNMacedonia.json'
import bosilegradJson from '../data/Bosilegrad.json'
import nBulgariaSerbiaJson from '../data/nBulgariaSerbia.json'
import tzaribrodJson from '../data/Tzaribrod.json'

let serbiaFinalUnion: Array<Array<Position>> | undefined

export default function getSerbiaFinalUnion(state: SteplessMapState) {
  if (serbiaFinalUnion) return serbiaFinalUnion
  const { countries } = state
  const serbiaCoordinates = countries.find(({ name }) => name === 'Serbia')?.coordinates
  const kosovoCoordinates = countries.find(({ name }) => name === 'Kosovo')?.coordinates
  const northMacedoniaCoordinates = countries.find(({ name }) => name === 'North Macedonia')?.coordinates
  if (serbiaCoordinates && kosovoCoordinates && northMacedoniaCoordinates) {
    return serbiaFinalUnion = difference(union(serbiaCoordinates, kosovoCoordinates, northMacedoniaCoordinates), vojvodinaJson, seNMacedoniaJson, bosilegradJson, nBulgariaSerbiaJson, tzaribrodJson)
  }
}
