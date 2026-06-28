import { FeatureCollection } from "geojson";
import modernGeoJson from "./data/custom.midres.geo.json"
import { geoJson2CountryDetails } from "./utility";
import { MapHighlight, MapText } from "./mapReducer";

export function getCountriesHighRes() {
  return geoJson2CountryDetails(modernGeoJson as FeatureCollection)
}

export function baseText(id: string, long: number, lat: number, mapText?: Omit<MapText, 'id' | 'coordinates'>): MapText {
  return { id, coordinates: [long, lat], text: id, ...mapText }
}

export function summaryText(id: string, long: number, lat: number, text: Required<MapText>['text'], mapText?: Omit<MapText, 'id' | 'coordinates' | 'text'>): MapText {
  const { svgTextProps, ...rest } = mapText ?? {}
  return {
    includeBackground: true,
    ...baseText(id, long, lat, { text, svgTextProps: { className: 'summary', ...svgTextProps }, ...rest })
  }
}

// Builds a MapHighlight that outlines an existing country's current shape
// (looked up by name from state.countries at render time). Used to draw the
// reader's eye to whichever country is about to change in the next step.
export function countryHighlight(countryName: string, svgPathProps?: MapHighlight['svgPathProps']): MapHighlight {
  return { id: countryName, svgPathProps }
}

// Builds a MapHighlight that outlines an arbitrary custom shape instead of a
// single existing country — e.g. a precomputed union of several countries'
// borders, to preview an upcoming merge whose combined outline doesn't match
// any one country's current shape (such as the *Union variables already
// computed in WW1.tsx for the matching countryFadeIn call).
export function areaHighlight(id: string, coordinates: Required<MapHighlight>['coordinates'], svgPathProps?: MapHighlight['svgPathProps']): MapHighlight {
  return { id, coordinates, svgPathProps }
}

export function getInitialMapText(): Array<MapText> {
  const initialTextCollection: Array<MapText> = [
    {
      id: 'Russia',
      coordinates: [40.64032191671039, 57.24804212417763],
      svgTextProps: { fontSize: "200%" },
    },
  ]

  return [
    summaryText('StartSummary', 49, 62,
      ['World War I began with', 'a map significantly different', 'from the map of today.'],
      { includeBackground: true },
    ),
    ...initialTextCollection.map(({ id, coordinates: [long, lat], ...maptext }: MapText) => baseText(id, long, lat, maptext))
  ]
}

// A muted, vintage-atlas palette: desaturated earth tones instead of bright
// neon fills, to match the parchment/serif styling elsewhere. Countries that
// share an identity across multiple keys (e.g. every 'AustriaHungary*' stage,
// every 'Russia*' stage) keep a single consistent hue, same as before.
export const modernColorMap: Record<string, string> = {
  'Bosnia and Herz.': '#c9a227',
  'Croatia': '#5b7c4f',
  'Serbia': '#4f8a85',
  'SerbiaFinal': '#4f8a85',
  'Kosovo': '#5b7c4f',
  'Montenegro': '#9c4444',
  'Albania': '#8d7090',
  'North Macedonia': '#c9a227',
  'Greece': '#9c4444',
  'Bulgaria': '#86ab6c',
  'BulgariaFinal': '#86ab6c',
  'Romania': '#d8b65c',
  'NewRomania': '#d8b65c',
  'RomaniaFinal': '#d8b65c',
  'Turkey': '#8d7090',
  'OttomanEurope': '#8d7090',
  'OttomanMiddleEast': '#8d7090',
  'Armenia': '#9c4444',
  'Azerbaijan': '#6b4e8a',
  'Moldova': '#7a4a3a',
  'Ukraine': '#8d7090',
  'Hungary': '#c98080',
  'Slovenia': '#5a6a96',
  'Austria': '#7d4f99',
  'AustriaHungary': '#7d4f99',
  'AustriaHungaryCZ': '#7d4f99',
  'AustriaHungaryBalkans': '#7d4f99',
  'AustriaHungaryItaly': '#7d4f99',
  'AustriaHungarySerbia': '#7d4f99',
  'AustriaHungaryRomania': '#7d4f99',
  'AustriaHungaryFinal': '#7d4f99',
  'Italy': '#b3556f',
  'Slovakia': '#9bbf73',
  'Czechia': '#9c4444',
  'Poland': '#c9a227',
  'Russia': '#5b7c4f',
  'RussiaFinland': '#5b7c4f',
  'RussiaBaltics': '#5b7c4f',
  'RussiaBelarus': '#5b7c4f',
  'RussiaUkraine': '#5b7c4f',
  'RussiaPoland': '#5b7c4f',
  'RussiaMiddleEast': '#5b7c4f',
  'Georgia': '#c9a227',
  'Belarus': '#9c4444',
  'Lithuania': '#c98fa0',
  'Latvia': '#6f4a87',
  'Estonia': '#a8623f',
  'Germany': '#3a4f7a',
  'GermanyFranceDenmark': '#3a4f7a',
  'GermanyPoland': '#3a4f7a',
  'GermanyFinal': '#3a4f7a',
  'Switzerland': '#d9c87a',
  'France': '#4f7a4f',
  'Luxembourg': '#c98fa0',
  'Belgium': '#5a9aa3',
  'Netherlands': '#c9a35e',
  'Spain': '#3a4570',
  'Portugal': '#b3503f',
  'Cyprus': '#8a7240',
  'N. Cyprus': '#5b7c4f',
  'Denmark': '#6f4a6e',
  'United Kingdom': '#c2604a',
  'San Marino': '#5a93b0',
  'Ireland': '#5f9468',
  'Liechtenstein': '#5a93b0',
  'Andorra': '#9c5e8f',
  'Norway': '#a8493f',
  'Sweden': '#d9c466',
  'Finland': '#8d7090',
  'Israel': '#6f7aa8',
  'Jordan': '#b97058',
  'Lebanon': '#7fae7c',
  'Syria': '#cdbd7e',
  'Palestine': '#5c74a3',
  'Iraq': '#4f8f5c',
  'Saudi Arabia': '#bf8a4a',
  'Yemen': '#8a5a8c',
  'Kuwait': '#7d5485',
}
