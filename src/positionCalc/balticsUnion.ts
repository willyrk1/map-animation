import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { getCountryByName, union } from "../utility"

let balticsUnion: Array<Array<Position>>

// Just Estonia + Latvia + Lithuania, unioned together — unlike
// russiaBalticsUnion (which also includes Russia's existing territory, since
// that's what the actual merge produces), this is for previewing the
// upcoming change without implying Russia itself is also "about to change."
export default function getBalticsUnion(state: SteplessMapState) {
  if (balticsUnion) return balticsUnion
  const { countries } = state
  const estoniaCoordinates = getCountryByName(countries, 'Estonia').coordinates
  const latviaCoordinates = getCountryByName(countries, 'Latvia').coordinates
  const lithuaniaCoordinates = getCountryByName(countries, 'Lithuania').coordinates
  return balticsUnion = union(estoniaCoordinates, latviaCoordinates, lithuaniaCoordinates)
}
