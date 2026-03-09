import { countryFadeIn, countryReplace, MapTransitionList, textFadeIn, textFadeOut, viewCenterChange, zoomChange } from "./mapReducer";
import { CountryDetails } from "./utility";
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
      coordinates: [55, 62],
      text: [
        'Russia had been an empire for',
        'nearly two centuries and encompassed',
        'the modern-day countries of Finland...'
      ]
    })),
    textFadeIn(baseText({
      id: 'Russian Empire',
      coordinates: [44, 57.24804212417763],
      svgTextProps: { fontSize: "200%" },
    }))
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
      coordinates: [40, 58],
      text: 'The Baltic states...'
    })),
  ],
  () => [
    textFadeOut('EstoniaShort'),
    textFadeOut('LatviaShort'),
    textFadeOut('LithuaniaShort'),
    countryReplace('RussiaFinland'),
    countryReplace('Estonia'),
    countryReplace('Latvia'),
    countryFadeIn({ "name": "RussiaBaltics", "coordinates": russiaBalticsUnion })
  ],
  () => [
    textFadeOut('RussiaBalticSummary'),
    textFadeIn(summaryText({
      id: 'RussiaBelarusSummary',
      coordinates: [40, 54],
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
      coordinates: [40, 54],
      text: 'Moldova and most of Ukraine...'
    })),
  ],
  () => [
    textFadeOut('Ukraine'),
    countryReplace('RussiaBelarus'),
    countryReplace('Moldova'),
    countryFadeIn({ "name": "RussiaUkraine", "coordinates": russiaUkraineUnion })
  ],
  () => [
    textFadeOut('RussiaUkraineSummary'),
    textFadeIn(summaryText({
      id: 'RussiaPolandSummary',
      coordinates: [36, 53],
      text: ['Eastern Poland', '(Congress Poland)...']
    })),
  ],
  () => [
    countryReplace('RussiaUkraine'),
    countryFadeIn({
      "name": "RussiaPoland",
      "coordinates": russiaPolandUnion
    })
  ],
  // () => {
  //   const russiaMiddleEast = {
  //     "name": "RussiaMiddleEast",
  //     "coordinates": russiaMiddleEastUnion
  //   }
  //   return countryReplacement(['RussiaPoland', 'Armenia', 'Azerbaijan', 'Georgia'], [russiaMiddleEast])
  // },
  // () => [viewCenterChange(15, 52), zoomChange(13)],
  // () => {
  //   const germanyFranceDenmark = {
  //     "name": "GermanyFranceDenmark",
  //     "coordinates": germanyFranceDenmarkUnion
  //   }
  //   return countryReplacement(['Germany'], [germanyFranceDenmark])
  // },
  // () => {
  //   const germanyPoland = {
  //     "name": "GermanyPoland",
  //     "coordinates": germanyPolandUnion
  //   }
  //   return countryReplacement(['GermanyFranceDenmark'], [germanyPoland])
  // },
  // () => {
  //   const germanyFinal = {
  //     "name": "GermanyFinal",
  //     "coordinates": germanyFinalUnion
  //   }
  //   return countryReplacement(['GermanyPoland', 'Lithuania'], [germanyFinal])
  // },
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
