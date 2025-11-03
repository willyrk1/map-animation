import { Position } from "geojson"
import { union } from "../utility"
import { SteplessMapState } from "../mapReducer"
import bulgarianMacedoniaJson from '../data/BulgarianMacedonia.json'
import seNMacedoniaJson from '../data/seNMacedonia.json'
import bulgarianThraceJson from '../data/BulgarianThrace.json'
import bosilegradJson from '../data/Bosilegrad.json'
import nBulgariaSerbiaJson from '../data/nBulgariaSerbia.json'
import tzaribrodJson from '../data/Tzaribrod.json'

let bulgariaUnion: Array<Array<Position>> | undefined

export default function getBulgariaUnion({ countries }: SteplessMapState) {
  if (bulgariaUnion) return bulgariaUnion
  const bulgariaCoordinates = countries.find(({ name }) => name === 'Bulgaria')?.coordinates
  if (bulgariaCoordinates) {
    return bulgariaUnion = union(bulgariaCoordinates, bulgarianMacedoniaJson, seNMacedoniaJson, bulgarianThraceJson, bosilegradJson, tzaribrodJson, nBulgariaSerbiaJson)
  }
}
