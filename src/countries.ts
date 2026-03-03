import { FeatureCollection } from "geojson";
import modernGeoJson from "./data/custom.hires.geo.json"
import { geoJson2CountryDetails } from "./utility";
import { MapText } from "./mapReducer";

export function getCountriesHighRes() {
  return geoJson2CountryDetails(modernGeoJson as FeatureCollection)
}

type PartialMapText = Omit<MapText, 'text'> & { text?: string | Array<string> }

export function globalTextMap({ svgTextProps, ...mapText }: PartialMapText): MapText {
  return {
    text: mapText.id,
    svgTextProps: { fill: '#f2f2f2', ...svgTextProps },
    ...mapText,
  }
}

export function summaryText({ svgTextProps, ...mapText }: PartialMapText): MapText {
  return {
    includeBackground: true,
    ...globalTextMap({
      svgTextProps: { fill: 'black', fontSize: '150%', ...svgTextProps },
      ...mapText
    })
  }
}

export function getInitialMapText(): Array<MapText> {
  const initialTextCollection: Array<PartialMapText> = [
    {
      id: 'Ukraine',
      coordinates: [31.00791766243967, 49.53499805741697],
    },
    {
      id: 'Belarus',
      coordinates: [27.8206206153948, 53],
      svgTextProps: { fontSize: '90%' },
    },
    {
      id: 'Russia',
      coordinates: [40.64032191671039, 57.24804212417763],
      svgTextProps: { fontSize: "200%" },
    },
    {
      id: 'Finland',
      coordinates: [26, 62.5902121295499],
    },
    {
      id: 'EstoniaShort',
      coordinates: [25.8, 58.6],
      text: 'Es.',
      svgTextProps: { fontSize: '75%' },
    },
    {
      id: 'LatviaShort',
      coordinates: [25.84680136704439, 56.83295731831097],
      text: 'Lat.',
      svgTextProps: { fontSize: '75%' },
    },
    {
      id: 'LithuaniaShort',
      coordinates: [24.074296892793875, 55.2510188544136],
      text: 'Lit.',
      svgTextProps: { fontSize: '75%' },
    },
  ]

  return [
    summaryText({
      id: 'StartSummary',
      coordinates: [49, 64],
      text: [
        'World War I began with',
        'a map significantly different',
        'from the map of today.',
      ],
      includeBackground: true,
    }),
    ...initialTextCollection.map(globalTextMap)
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
  'Lithuania': '#001fcc',
  'Latvia': '#8400b3',
  'Estonia': '#aa4200',
  'Germany': '#002780',
  'GermanyFranceDenmark': '#002780',
  'GermanyPoland': '#002780',
  'GermanyFinal': '#002780',
  'Switzerland': '#fff54d',
  'France': '#178000',
  'Luxembourg': '#b30016',
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
