import { FeatureCollection } from "geojson";
import modernGeoJson from "./data/custom.hires.geo.json"
import { geoJson2CountryDetails, union } from "./utility";
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
