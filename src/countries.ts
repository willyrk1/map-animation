import { FeatureCollection } from "geojson";
import modernGeoJson from "./data/custom.midres.geo.json"
import { geoJson2CountryDetails } from "./utility";
import { MapText } from "./mapReducer";

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

export const modernColorMap: Record<string, string> = {
  'Bosnia and Herz.': '#e6e000',
  'Croatia': 'green',
  'Serbia': '#00e6d2',
  'SerbiaFinal': '#00e6d2',
  'Kosovo': 'green',
  'Montenegro': '#cc0012',
  'Albania': '#A77FB1',
  'North Macedonia': '#e6e000',
  'Greece': '#cc0012',
  'Bulgaria': '#80ff8c',
  'BulgariaFinal': '#80ff8c',
  'Romania': '#ffe600',
  'NewRomania': '#ffe600',
  'RomaniaFinal': '#ffe600',
  'Turkey': '#A77FB1',
  'OttomanEurope': '#A77FB1',
  'OttomanMiddleEast': '#A77FB1',
  'Armenia': '#cc0012',
  'Azerbaijan': '#a600b3',
  'Moldova': '#991300',
  'Ukraine': '#A77FB1',
  'Hungary': '#ff808b',
  'Slovenia': '#4d54ff',
  'Austria': '#e200ff',
  'AustriaHungary': '#e200ff',
  'AustriaHungaryCZ': '#e200ff',
  'AustriaHungaryBalkans': '#e200ff',
  'AustriaHungaryItaly': '#e200ff',
  'AustriaHungarySerbia': '#e200ff',
  'AustriaHungaryRomania': '#e200ff',
  'AustriaHungaryFinal': '#e200ff',
  'Italy': '#ff3377',
  'Slovakia': '#8bff66',
  'Czechia': '#cc0012',
  'Poland': '#e6e000',
  'Russia': 'green',
  'RussiaFinland': 'green',
  'RussiaBaltics': 'green',
  'RussiaBelarus': 'green',
  'RussiaUkraine': 'green',
  'RussiaPoland': 'green',
  'RussiaMiddleEast': 'green',
  'Georgia': '#e6e000',
  'Belarus': '#cc0012',
  'Lithuania': 'pink',
  'Latvia': '#8400b3',
  'Estonia': '#aa4200',
  'Germany': '#002780',
  'GermanyFranceDenmark': '#002780',
  'GermanyPoland': '#002780',
  'GermanyFinal': '#002780',
  'Switzerland': '#fff54d',
  'France': '#178000',
  'Luxembourg': 'pink',
  'Belgium': '#1afffd',
  'Netherlands': '#ffc833',
  'Spain': '#000eb3',
  'Portugal': '#ff0024',
  'Cyprus': '#997b00',
  'N. Cyprus': 'green',
  'Denmark': '#80007e',
  'United Kingdom': '#ff4f33',
  'San Marino': '#00abff',
  'Ireland': '#00e607',
  'Liechtenstein': '#00abff',
  'Andorra': '#e600d2',
  'Norway': '#ff0029',
  'Sweden': '#ffe31a',
  'Finland': '#A77FB1',
  'Israel': '#99a7ff',
  'Jordan': '#ff5d4d',
  'Lebanon': '#4dff8e',
  'Syria': '#ffed33',
  'Palestine': '#4d6cff',
  'Iraq': '#00b356',
  'Saudi Arabia': '#ffa700',
  'Yemen': '#d900e6',
  'Kuwait': '#a900b3',
}
