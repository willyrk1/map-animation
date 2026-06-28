import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { getCountryByName, union } from "../utility"
import karsJson from "../data/Kars.json"

let caucasusUnion: Array<Array<Position>>

// Just Armenia + Azerbaijan + Georgia + Kars, unioned together — unlike
// russiaMiddleEastUnion, this deliberately excludes Russia's own existing
// territory, for previewing the upcoming merge without implying Russia
// itself is also "about to change."
export default function getCaucasusUnion(state: SteplessMapState) {
  if (caucasusUnion) return caucasusUnion
  const { countries } = state
  const armeniaCoordinates = getCountryByName(countries, 'Armenia').coordinates
  const azerbaijanCoordinates = getCountryByName(countries, 'Azerbaijan').coordinates
  const georgiaCoordinates = getCountryByName(countries, 'Georgia').coordinates
  return caucasusUnion = union(armeniaCoordinates, azerbaijanCoordinates, georgiaCoordinates, karsJson)
}
