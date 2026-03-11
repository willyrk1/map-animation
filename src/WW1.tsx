import { countryFadeIn, countryReplace, MapTransitionList, textFadeIn, textFadeOut, textMove, viewCenterChange, zoomChange } from "./mapReducer";
import { CountryDetails, position2Spaced } from "./utility";
import MapAnimation from "./MapAnimation";
import { getCountriesHighRes, getInitialMapText, baseText, modernColorMap, summaryText } from "./countries";
import {
  getAHBalkansUnion,
  getAHCzechUnion,
  getAHFinalUnion,
  getAHItalyUnion,
  getAHRomaniaUnion,
  getAHSerbiaUnion,
  getAustriaHungaryUnion,
  getBulgariaUnion,
  getGermanyFinalUnion,
  getGermanyFranceDenmarkUnion,
  getGermanyPolandUnion,
  getRomaniaBulgariaUnion,
  getRomaniaUnion,
  getRussiaBalticsUnion,
  getRussiaBelarusUnion,
  getRussiaFinlandUnion,
  getRussiaMiddleEastUnion,
  getRussiaPolandUnion,
  getRussiaUkraineUnion,
  getSerbiaFinalUnion,
  getOttomanEuropeUnion,
  getOttomanMiddleEastUnion
} from "./positionCalc";

const initialState = {
  countries: getCountriesHighRes(),
  textCollection: getInitialMapText(),
  viewCenter: [28, 57],
  zoom: 3.65,
}

const russiaFinlandUnion = getRussiaFinlandUnion(initialState)
const russiaBalticsUnion = getRussiaBalticsUnion(initialState)
const russiaBelarusUnion = getRussiaBelarusUnion(initialState)
const russiaUkraineUnion = getRussiaUkraineUnion(initialState)
const russiaPolandUnion = getRussiaPolandUnion(initialState)
const russiaMiddleEastUnion = getRussiaMiddleEastUnion(initialState)
const germanyFranceDenmarkUnion = getGermanyFranceDenmarkUnion(initialState)
const germanyPolandUnion = getGermanyPolandUnion(initialState)
const germanyFinalUnion = getGermanyFinalUnion(initialState)
const austriaHungaryUnion = getAustriaHungaryUnion(initialState)
const ahCzechUnion = getAHCzechUnion(initialState)
const ahBalkansUnion = getAHBalkansUnion(initialState)
const ahItalyUnion = getAHItalyUnion(initialState)
const ahSerbiaUnion = getAHSerbiaUnion(initialState)
const romaniaUnion = getRomaniaUnion(initialState)
const ahRomaniaUnion = getAHRomaniaUnion(initialState)
const ahFinalUnion = getAHFinalUnion(initialState)
const bulgariaUnion = getBulgariaUnion(initialState)
const ottomanEuropeUnion = getOttomanEuropeUnion(initialState)
const romaniaBulgariaUnion = getRomaniaBulgariaUnion(initialState)
const serbiaFinalUnion = getSerbiaFinalUnion(initialState)
const ottomanMiddleEastUnion = getOttomanMiddleEastUnion(initialState)

const transitions: MapTransitionList = [
  () => [
    textFadeOut('StartSummary'),
    textFadeOut('Russia'),
    textFadeIn(summaryText({
      id: 'RussianEmpireSummary',
      coordinates: [53, 62],
      text: [
        'Russia had been an empire for',
        'nearly two centuries and',
        'encompassed modern-day Finland...'
      ]
    })),
    textFadeIn(baseText({
      id: 'Russian Empire',
      coordinates: [44, 57.24804212417763],
      svgTextProps: { fontSize: "200%" },
    })),
    textFadeIn(baseText({
      id: 'Finland',
      coordinates: [26, 62.5902121295499],
    })),
  ],
  () => [
    textFadeOut('Finland'),
    countryReplace('Russia'),
    countryReplace('Finland'),
    countryFadeIn({ "name": "RussiaFinland", "coordinates": russiaFinlandUnion })
  ],
  () => [
    viewCenterChange(15, 52),
    zoomChange(8),
    textFadeOut('RussianEmpireSummary'),
    textFadeIn(summaryText({
      id: 'RussiaBalticSummary',
      coordinates: [34, 58],
      text: 'The Baltic states...'
    })),
    textMove('Russian Empire', 42, 54),
    textFadeIn(baseText({
      id: 'Estonia',
      coordinates: [25.8, 58.6],
    })),
    textFadeIn(baseText({
      id: 'Latvia',
      coordinates: [25.84680136704439, 56.83295731831097],
    })),
    textFadeIn(baseText({
      id: 'Lithuania',
      coordinates: [24, 55.4],
    })),
    textFadeIn(baseText({
      id: 'Ukraine',
      coordinates: [31.00791766243967, 49.4],
      svgTextProps: { fontSize: '150%' },
    })),
    textFadeIn(baseText({
      id: 'Belarus',
      coordinates: [27.8206206153948, 53.2],
      svgTextProps: { fontSize: '130%' },
    })),
    textFadeIn(baseText({
      id: 'Moldova',
      coordinates: [28.5, 47.3],
      svgTextProps: { fontSize: '85%', transform: `rotate(45 ${position2Spaced([28.5, 47.3])})` },
    })),
    textFadeIn(baseText({
      id: 'Poland',
      coordinates: [19.4, 52],
      svgTextProps: { fontSize: '130%', style: { fill: 'black' } },
    })),
  ],
  () => [
    textFadeOut('Estonia'),
    textFadeOut('Latvia'),
    textFadeOut('Lithuania'),
    countryReplace('RussiaFinland'),
    countryReplace('Estonia'),
    countryReplace('Latvia'),
    countryFadeIn({ "name": "RussiaBaltics", "coordinates": russiaBalticsUnion })
  ],
  () => [
    textFadeOut('RussiaBalticSummary'),
    textFadeOut('Russian Empire'),
    textFadeIn(baseText({
      id: 'Russian Empire2',
      text: 'Russian Empire',
      coordinates: [36, 57],
      svgTextProps: { fontSize: "200%" },
    })),
    textFadeIn(summaryText({
      id: 'RussiaBelarusSummary',
      coordinates: [37, 54],
      text: 'Belarus...'
    })),
  ],
  () => [
    textFadeOut('Belarus'),
    countryReplace('RussiaBaltics'),
    countryReplace('Belarus'),
    countryFadeIn({ "name": "RussiaBelarus", "coordinates": russiaBelarusUnion })
  ],
  () => [
    textFadeOut('RussiaBelarusSummary'),
    textFadeIn(summaryText({
      id: 'RussiaUkraineSummary',
      coordinates: [35, 54],
      text: 'Moldova and most of Ukraine...'
    })),
  ],
  () => [
    textFadeOut('Ukraine'),
    textFadeOut('Moldova'),
    textFadeIn(baseText({
      id: 'Ukraine2',
      text: 'Ukraine',
      coordinates: [24.4, 49],
      svgTextProps: { fontSize: '90%' },
    })),
    countryReplace('RussiaBelarus'),
    countryReplace('Moldova'),
    countryFadeIn({ "name": "RussiaUkraine", "coordinates": russiaUkraineUnion })
  ],
  () => [
    textFadeOut('RussiaUkraineSummary'),
    textFadeIn(summaryText({
      id: 'RussiaPolandSummary',
      coordinates: [31, 53],
      text: ['Eastern Poland', '(Congress Poland)...']
    })),
  ],
  () => [
    textFadeOut('Poland'),
    textFadeIn(baseText({
      id: 'Poland2',
      text: 'Poland',
      coordinates: [16.5, 53.2],
      svgTextProps: { fontSize: '120%', style: { fill: 'black' } },
    })),
    countryReplace('RussiaUkraine'),
    countryFadeIn({
      "name": "RussiaPoland",
      "coordinates": russiaPolandUnion
    }),
  ],
  () => [
    viewCenterChange(44.5, 43.8),
    zoomChange(10),
    textMove('Russian Empire2', 40, 49),
    textFadeOut('RussiaPolandSummary'),
    textFadeIn(summaryText({
      id: 'RussiaCaucusus',
      coordinates: [52.8, 44],
      text: ['...and the Caucasus region']
    })),
    textFadeIn(baseText({
      id: 'Georgia',
      coordinates: [43.4, 42.1],
      svgTextProps: { style: { fill: 'black' } },
    })),
    textFadeIn(baseText({
      id: 'Azerbaijan',
      coordinates: [47.6, 40.5],
    })),
    textFadeIn(baseText({
      id: 'Armenia',
      coordinates: [44.7, 40.4],
      svgTextProps: { fontSize: '90%', transform: `rotate(45 ${position2Spaced([44.7, 40.4])})` },
    })),
    textFadeIn(baseText({
      id: 'Turkey',
      coordinates: [35.3, 39],
      svgTextProps: { fontSize: '150%' },
    }))
  ],
  () => [
    textFadeOut('Georgia'),
    textFadeOut('Azerbaijan'),
    textFadeOut('Armenia'),
    countryReplace('RussiaPoland'),
    countryReplace('Armenia'),
    countryReplace('Azerbaijan'),
    countryReplace('Georgia'),
    countryFadeIn({
      "name": "RussiaMiddleEast",
      "coordinates": russiaMiddleEastUnion
    }),
  ],
  () => [
    viewCenterChange(15, 52),
    zoomChange(13),
    textMove('Russian Empire2', 25, 52),
    textFadeOut('RussiaCaucusus'),
    textFadeIn(baseText({
      id: 'German Empire',
      coordinates: [10.5, 51.8],
      svgTextProps: { fontSize: '150%' },
    })),
    textFadeIn(baseText({
      id: 'Denmark',
      coordinates: [9.2, 56.2],
      svgTextProps: { fontSize: '80%' },
    })),
    textFadeIn(baseText({
      id: 'France',
      coordinates: [2.6, 48.1],
      svgTextProps: { fontSize: '150%' },
    })),
    textFadeIn(summaryText({
      id: 'GermanyInitial',
      coordinates: [0.5, 54],
      text: [
        'Germany was also an empire after',
        'unifying 43 years earlier. It',
        'included South Jutland (Denmark),',
        'Alsace-Lorraine (France)...'
      ],
    })),
  ],
  () => [
    countryReplace('Germany'),
    countryFadeIn({
      "name": "GermanyFranceDenmark",
      "coordinates": germanyFranceDenmarkUnion,
    }),
  ],
  () => [
    textFadeOut("GermanyInitial"),
    textFadeIn(summaryText({
      id: 'GermanyPoland',
      coordinates: [15.4, 55.5],
      text: ['Western and', 'northern Poland...'],
    })),
  ],
  () => [
    textFadeOut('Poland2'),
    textFadeIn(baseText({
      id: 'Poland',
      coordinates: [21.4, 49.75],
      svgTextProps: { fontSize: '120%', style: { fill: 'black' } },
    })),
    textMove('German Empire', 13, 52.3),
    countryReplace('GermanyFranceDenmark'),
    countryFadeIn({
      "name": "GermanyPoland",
      "coordinates": germanyPolandUnion
    }),
  ],
  () => [
    textFadeOut("GermanyPoland"),
    textFadeIn(summaryText({
      id: 'EastGermany',
      coordinates: [16, 56],
      text: ['...Kaliningrad (Russia)', 'and Memel (Lithuania).'],
    })),
  ],
  () => [
    countryReplace('GermanyPoland'),
    countryReplace('Lithuania'),
    countryFadeIn({
      "name": "GermanyFinal",
      "coordinates": germanyFinalUnion
    }),
  ],
  // () => [viewCenterChange(13, 46), zoomChange(14.7)],
  // () => {
  //   const austriaHungary = {
  //     "name": "AustriaHungary",
  //     "coordinates": austriaHungaryUnion
  //   }
  //   return countryReplacement(['Austria', 'Hungary'], [austriaHungary])
  // },
  // () => {
  //   const austriaHungaryCZ = {
  //     "name": "AustriaHungaryCZ",
  //     "coordinates": ahCzechUnion
  //   }
  //   return countryReplacement(['AustriaHungary'], [austriaHungaryCZ])
  // },
  // () => {
  //   const austriaHungaryBalkans = {
  //     "name": "AustriaHungaryBalkans",
  //     "coordinates": ahBalkansUnion
  //   }
  //   return countryReplacement(['AustriaHungaryCZ', 'Slovenia', 'Croatia', 'Bosnia and Herz.'], [austriaHungaryBalkans])
  // },
  // () => {
  //   const austriaHungaryItaly = {
  //     "name": "AustriaHungaryItaly",
  //     "coordinates": ahItalyUnion
  //   }
  //   return countryReplacement(['AustriaHungaryBalkans'], [austriaHungaryItaly])
  // },
  // () => {
  //   const austriaHungarySerbia = {
  //     "name": "AustriaHungarySerbia",
  //     "coordinates": ahSerbiaUnion
  //   }
  //   return countryReplacement(['AustriaHungaryItaly'], [austriaHungarySerbia])
  // },
  // () => {
  //   const origRomania = {
  //     "name": "NewRomania",
  //     "coordinates": romaniaUnion
  //   }
  //   const austriaHungaryRomania = {
  //     "name": "AustriaHungaryRomania",
  //     "coordinates": ahRomaniaUnion
  //   }
  //   return countryReplacement(['AustriaHungarySerbia', 'Romania'], [origRomania, austriaHungaryRomania])
  // },
  // () => {
  //   const austriaHungaryFinal = {
  //     "name": "AustriaHungaryFinal",
  //     "coordinates": ahFinalUnion
  //   }
  //   return countryReplacement(['AustriaHungaryRomania', 'Ukraine', 'Poland'], [austriaHungaryFinal])
  // },
  // () => {
  //   const romaniaFinal = {
  //     "name": "RomaniaFinal",
  //     "coordinates": romaniaBulgariaUnion
  //   }
  //   const bulgariaFinal = {
  //     "name": "BulgariaFinal",
  //     "coordinates": bulgariaUnion
  //   }
  //   const ottomanEurope = {
  //     "name": "OttomanEurope",
  //     "coordinates": ottomanEuropeUnion
  //   }
  //   return countryReplacement(['Bulgaria', 'NewRomania', 'Turkey'], [bulgariaFinal, ottomanEurope, romaniaFinal])
  // },
  // () => {
  //   const serbiaFinal = {
  //     "name": "SerbiaFinal",
  //     "coordinates": serbiaFinalUnion
  //   }
  //   return countryReplacement(['Serbia', 'North Macdeonia', 'Kosovo'], [serbiaFinal])
  // },
  // () => [viewCenterChange(40, 29), zoomChange(6.2)],
  // () => {
  //   const ottomanMiddleEast = {
  //     "name": "OttomanMiddleEast",
  //     "coordinates": ottomanMiddleEastUnion
  //   }
  //   return countryReplacement(['OttomanEurope', 'Lebanon', 'Israel', 'Palestine'], [ottomanMiddleEast])
  // },
]

function toWithPathProps(country: CountryDetails): CountryDetails {
  return {
    ...country,
    pathProps: {
      stroke: "black",
      strokeWidth: 0.03,
      fill: modernColorMap[country.name ?? ''] ?? 'grey',
      ...country.pathProps
    }
  }
}

export default function WW1() {
  return <MapAnimation transitions={transitions} initialState={initialState} toWithPathProps={toWithPathProps} />
}
