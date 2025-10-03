import { FeatureCollection, Position } from "geojson";
import modernGeoJson from "./data/custom.hires.geo.json"
import { difference, geoJson2CountryDetails, union } from "./utility";
import galiciaJson from "./data/Galicia.json"
import bukovinaJson from "./data/Bukovina.json"

export function getCountriesHighRes() {
  return geoJson2CountryDetails(modernGeoJson as FeatureCollection)
}

export function getGaliciaBukovina() {
  const fix = [
    [
      24.877788533000114,
      47.71874216700009
    ],
    [
      24.896598755000127,
      47.71006052700004
    ],
    [
      24.928857956000115,
      47.71393770200011
    ],
    [
      24.942380238000112,
      47.715562921000114
    ],
    [
      25.017418253000073,
      47.72458160400008
    ],
    [
      24.877788533000114,
      47.71874216700009
    ],
  ]

  return [union([galiciaJson], [bukovinaJson], [fix])[0]]
}

export function getNERomania(romaniaJson: Position[][]) {
  const fix = [
    [
      26.256215019471938,
      48.20137489491236
    ],
    [
      26.247431779855134,
      48.20543273251561
    ],
    [
      26.29615157000009,
      48.17899831200005
    ],
    [
      26.303489624000093,
      48.212045390000114
    ],
    [
      26.256215019471938,
      48.20137489491236
    ],
  ]

  const bukovinaRomania = union(romaniaJson, [bukovinaJson])
  const bukovinaNERomania = union(romaniaJson, [bukovinaJson], [fix])[0]

  return difference([bukovinaNERomania], bukovinaRomania)
}
