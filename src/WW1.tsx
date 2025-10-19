import { countryReplacement, MapTransitionList, SteplessMapState, viewBoxChange } from "./mapReducer";
import { CountryDetails, difference, position2ViewBox, union } from "./utility";
import MapAnimation from "./MapAnimation";
import { getCountriesHighRes } from "./countries";
import { modernColorMap } from "./colors";
import congressPolandJson from "./data/CongressPoland.json"
import trentinoSouthTyrolJson from "./data/TrentinoSouthTyrol.json"
import vojvodinaJson from "./data/Vojvodina.json"
import exRomaniaJson from "./data/exRomania.json"
import neRomaniaJson from "./data/neRomania.json"
import galiciaJson from "./data/Galicia.json"
import bukovinaJson from "./data/Bukovina.json"
import southDobrujaJson from "./data/SouthDobruja.json"
import bulgarianMacedoniaJson from './data/BulgarianMacedonia.json'
import seNMacedoniaJson from './data/seNMacedonia.json'
import bulgarianThraceJson from './data/BulgarianThrace.json'
import ottomanWestThraceJson from './data/OttomanWestThrace.json'
import bosilegradJson from './data/Bosilegrad.json'
import nBulgariaSerbiaJson from './data/nBulgariaSerbia.json'
import tzaribrodJson from './data/Tzaribrod.json'

const initialState = {
  viewBox: position2ViewBox(-10, 72, 67, 34),
  countries: getCountriesHighRes()
}

function getRussiaFinlandUnion({ countries }: SteplessMapState) {
  const russiaCoordinates = countries.find(({ name }) => name === 'Russia')?.coordinates
  const finlandCoordinates = countries.find(({ name }) => name === 'Finland')?.coordinates
  if (russiaCoordinates && finlandCoordinates) {
    return union(russiaCoordinates, finlandCoordinates)
  }
}

const russiaFinlandUnion = getRussiaFinlandUnion(initialState)

function getRussiaBalticsUnion({ countries }: SteplessMapState) {
  const russiaCoordinates = countries.find(({ name }) => name === 'Russia')?.coordinates
  const estoniaCoordinates = countries.find(({ name }) => name === 'Estonia')?.coordinates
  const latviaCoordinates = countries.find(({ name }) => name === 'Latvia')?.coordinates
  const lithuaniaCoordinates = countries.find(({ name }) => name === 'Lithuania')?.coordinates
  if (russiaFinlandUnion && russiaCoordinates && estoniaCoordinates && latviaCoordinates && lithuaniaCoordinates) {
    return union(russiaFinlandUnion, estoniaCoordinates, latviaCoordinates, lithuaniaCoordinates)
  }
}

const russiaBalticsUnion = getRussiaBalticsUnion(initialState)

function getRussiaBelarusUnion({ countries }: SteplessMapState) {
  const belarusCoordinates = countries.find(({ name }) => name === 'Belarus')?.coordinates
  if (russiaBalticsUnion && belarusCoordinates) {
    return union(russiaBalticsUnion, belarusCoordinates)
  }
}

const russiaBelarusUnion = getRussiaBelarusUnion(initialState)

function getRussiaUkraineUnion({ countries }: SteplessMapState) {
  const ukraineCoordinates = countries.find(({ name }) => name === 'Ukraine')?.coordinates
  const moldovaCoordinates = countries.find(({ name }) => name === 'Moldova')?.coordinates
  if (russiaBelarusUnion && ukraineCoordinates && moldovaCoordinates) {
    const eastUkraineCoordinates = difference(ukraineCoordinates, galiciaJson, bukovinaJson)
    return union(russiaBelarusUnion, moldovaCoordinates, eastUkraineCoordinates)
  }
}

const russiaUkraineUnion = getRussiaUkraineUnion(initialState)

function getRussiaPolandUnion({ countries }: SteplessMapState) {
  const polandCoordinates = countries.find(({ name }) => name === 'Poland')?.coordinates
  if (russiaUkraineUnion && polandCoordinates) {
    const [, eastPoland] = difference(polandCoordinates, congressPolandJson)
    return union(russiaUkraineUnion, [eastPoland], congressPolandJson)
  }
}

const russiaPolandUnion = getRussiaPolandUnion(initialState)

function getAustriaHungaryUnion({ countries }: SteplessMapState) {
  const austriaCoordinates = countries.find(({ name }) => name === 'Austria')?.coordinates
  const hungaryCoordinates = countries.find(({ name }) => name === 'Hungary')?.coordinates
  if (austriaCoordinates && hungaryCoordinates) {
    return union(austriaCoordinates, hungaryCoordinates)
  }
}

const austriaHungaryUnion = getAustriaHungaryUnion(initialState)

function getAHCzechUnion({ countries }: SteplessMapState) {
  const czechiaCoordinates = countries.find(({ name }) => name === 'Czechia')?.coordinates
  const slovakiaCoordinates = countries.find(({ name }) => name === 'Slovakia')?.coordinates
  if (austriaHungaryUnion && czechiaCoordinates && slovakiaCoordinates) {
    return union(austriaHungaryUnion, czechiaCoordinates, slovakiaCoordinates)
  }
}

const ahCzechUnion = getAHCzechUnion(initialState)

function getAHBalkansUnion({ countries }: SteplessMapState) {
  const sloveniaCoordinates = countries.find(({ name }) => name === 'Slovenia')?.coordinates
  const croatiaCoordinates = countries.find(({ name }) => name === 'Croatia')?.coordinates
  const bosniaCoordinates = countries.find(({ name }) => name === 'Bosnia and Herz.')?.coordinates
  if (ahCzechUnion && sloveniaCoordinates && croatiaCoordinates && bosniaCoordinates) {
    return union(ahCzechUnion, sloveniaCoordinates, croatiaCoordinates, bosniaCoordinates)
  }
}

const ahBalkansUnion = getAHBalkansUnion(initialState)

function getAHItalyUnion() {
  if (ahBalkansUnion) {
    return union(ahBalkansUnion, trentinoSouthTyrolJson)
  }
}

const ahItalyUnion = getAHItalyUnion()

function getAHSerbiaUnion() {
  if (ahItalyUnion) {
    return union(ahItalyUnion, vojvodinaJson)
  }
}

const ahSerbiaUnion = getAHSerbiaUnion()

function getRomaniaUnion({ countries }: SteplessMapState) {
  const romaniaCoordinates = countries.find(({ name }) => name === 'Romania')?.coordinates
  if (romaniaCoordinates) {
    return union(romaniaCoordinates, neRomaniaJson)
  }
}

const romaniaUnion = getRomaniaUnion(initialState)

function getAHRomaniaUnion() {
  if (ahSerbiaUnion) {
    return union(ahSerbiaUnion, exRomaniaJson)
  }
}

const ahRomaniaUnion = getAHRomaniaUnion()

function getAHFinalUnion() {
  if (ahRomaniaUnion) {
    return union(ahRomaniaUnion, galiciaJson, bukovinaJson)
  }
}

const ahFinalUnion = getAHFinalUnion()

function getBulgariaUnion({ countries }: SteplessMapState) {
  const bulgariaCoordinates = countries.find(({ name }) => name === 'Bulgaria')?.coordinates
  if (bulgariaCoordinates) {
    return union(bulgariaCoordinates, bulgarianMacedoniaJson, seNMacedoniaJson, bulgarianThraceJson, bosilegradJson, tzaribrodJson, nBulgariaSerbiaJson)
  }
}

const bulgariaUnion = getBulgariaUnion(initialState)

function getTurkeyEuropeUnion({ countries }: SteplessMapState) {
  const turkeyCoordinates = countries.find(({ name }) => name === 'Turkey')?.coordinates
  if (turkeyCoordinates) {
    return union(turkeyCoordinates, ottomanWestThraceJson)
  }
}

const turkeyEuropeUnion = getTurkeyEuropeUnion(initialState)

function getRomaniaBulgariaUnion() {
  if (romaniaUnion && ahFinalUnion) {
    const smallRomania = difference(romaniaUnion, ahFinalUnion)
    return union(smallRomania, southDobrujaJson)
  }
}

const romaniaBulgariaUnion = getRomaniaBulgariaUnion()

const transitions: MapTransitionList = [
  () => {
    if (russiaFinlandUnion) {
      const russiaFinland = {
        "name": "RussiaFinland",
        "coordinates": russiaFinlandUnion
      }
      return countryReplacement(['Russia', 'Finland'], [russiaFinland])
    }
  },
  () => {
    if (russiaBalticsUnion) {
      const russiaBaltics = {
        "name": "RussiaBaltics",
        "coordinates": russiaBalticsUnion
      }
      return countryReplacement(['RussiaFinland', 'Estonia', 'Latvia', 'Lithuania'], [russiaBaltics])
    }
  },
  () => {
    if (russiaBelarusUnion) {
      const russiaBelarus = {
        "name": "RussiaBelarus",
        "coordinates": russiaBelarusUnion
      }
      return countryReplacement(['RussiaBaltics', 'Belarus'], [russiaBelarus])
    }
  },
  () => {
    if (russiaUkraineUnion) {
      const russiaUkraine = {
        "name": "RussiaUkraine",
        "coordinates": russiaUkraineUnion
      }
      return countryReplacement(['RussiaBelarus', 'Moldova'], [russiaUkraine])
    }
  },
  () => {
    if (russiaPolandUnion) {
      const russiaPoland = {
        "name": "RussiaPoland",
        "coordinates": russiaPolandUnion
      }
      return countryReplacement(['RussiaUkraine'], [russiaPoland])
    }
  },
  () => viewBoxChange(7, 52, 19, 40),
  () => {
    if (austriaHungaryUnion) {
      const austriaHungary = {
        "name": "AustriaHungary",
        "coordinates": austriaHungaryUnion
      }
      return countryReplacement(['Austria', 'Hungary'], [austriaHungary])
    }
  },
  () => {
    if (ahCzechUnion) {
      const austriaHungaryCZ = {
        "name": "AustriaHungaryCZ",
        "coordinates": ahCzechUnion
      }
      return countryReplacement(['AustriaHungary'], [austriaHungaryCZ])
    }
  },
  () => {
    if (ahBalkansUnion) {
      const austriaHungaryBalkans = {
        "name": "AustriaHungaryBalkans",
        "coordinates": ahBalkansUnion
      }
      return countryReplacement(['AustriaHungaryCZ', 'Slovenia', 'Croatia', 'Bosnia and Herz.'], [austriaHungaryBalkans])
    }
  },
  () => {
    if (ahItalyUnion) {
      const austriaHungaryItaly = {
        "name": "AustriaHungaryItaly",
        "coordinates": ahItalyUnion
      }
      return countryReplacement(['AustriaHungaryBalkans'], [austriaHungaryItaly])
    }
  },
  () => {
    if (ahSerbiaUnion) {
      const austriaHungarySerbia = {
        "name": "AustriaHungarySerbia",
        "coordinates": ahSerbiaUnion
      }
      return countryReplacement(['AustriaHungaryItaly'], [austriaHungarySerbia])
    }
  },
  () => {
    if (romaniaUnion && ahRomaniaUnion) {
      const origRomania = {
        "name": "NewRomania",
        "coordinates": romaniaUnion
      }
      const austriaHungaryRomania = {
        "name": "AustriaHungaryRomania",
        "coordinates": ahRomaniaUnion
      }
      return countryReplacement(['AustriaHungarySerbia', 'Romania'], [origRomania, austriaHungaryRomania])
    }
  },
  () => {
    if (ahFinalUnion) {
      const austriaHungaryFinal = {
        "name": "AustriaHungaryFinal",
        "coordinates": ahFinalUnion
      }
      return countryReplacement(['AustriaHungaryRomania', 'Ukraine'], [austriaHungaryFinal])
    }
  },
  () => {
    if (romaniaBulgariaUnion && bulgariaUnion && turkeyEuropeUnion) {
      const romaniaFinal = {
        "name": "RomaniaFinal",
        "coordinates": romaniaBulgariaUnion
      }
      const bulgariaFinal = {
        "name": "BulgariaFinal",
        "coordinates": bulgariaUnion
      }
      const turkeyEurope = {
        "name": "TurkeyEurope",
        "coordinates": turkeyEuropeUnion
      }
      return countryReplacement(['Bulgaria', 'NewRomania', 'Turkey'], [bulgariaFinal, turkeyEurope, romaniaFinal])
    }
  },
]

function toWithPathProps(country: CountryDetails): CountryDetails {
  return {
    ...country,
    pathProps: {
      stroke: "black",
      strokeWidth: 0.03,
      fill: modernColorMap[country.name ?? ''] ?? 'none',
      ...country.pathProps
    }
  }
}

export default function WW1() {
  return <MapAnimation transitions={transitions} initialState={initialState} toWithPathProps={toWithPathProps} />
}
