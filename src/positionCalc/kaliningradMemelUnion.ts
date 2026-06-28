import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { getCountryByName, union } from "../utility"
import memellandJson from '../data/Memelland.json'

let kaliningradMemelUnion: Array<Array<Position>>

// Kaliningrad (Russia's exclave, taken as the last ring of Russia's own
// coordinates — see germanyFinalUnion for why) plus Memel (Lithuania). Used
// both for the actual merge (germanyFinalUnion) and to preview just this
// slice, without implying all of Russia or Lithuania is German.
export default function getKaliningradMemelUnion(state: SteplessMapState) {
  if (kaliningradMemelUnion) return kaliningradMemelUnion
  const { countries } = state
  const russiaCoordinates = getCountryByName(countries, 'Russia').coordinates
  return kaliningradMemelUnion = union(memellandJson, russiaCoordinates.slice(-2, -1))
}
