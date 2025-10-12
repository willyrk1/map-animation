import { countryReplacement, MapTransitionList, SteplessMapState, viewBoxChange } from "./mapReducer";
import { CountryDetails, difference, position2ViewBox, union } from "./utility";
import vojvodinaJson from "./data/Vojvodina.json"
import exRomaniaJson from "./data/exRomania.json"
import neRomaniaJson from "./data/neRomania.json"
import galiciaJson from "./data/Galicia.json"
import bukovinaJson from "./data/Bukovina.json"
import congressPolandJson from "./data/CongressPoland.json"
import trentinoSouthTyrolJson from "./data/TrentinoSouthTyrol.json"
import MapAnimation from "./MapAnimation";
import { getCountriesHighRes } from "./countries";
import { modernColorMap } from "./colors";

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
    const kaliningradCoordinates = russiaCoordinates[1]
    return union(russiaFinlandUnion, estoniaCoordinates, latviaCoordinates, lithuaniaCoordinates, [kaliningradCoordinates])
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
    const eastUkraineCoordinates = difference(ukraineCoordinates, [galiciaJson], [bukovinaJson])
    return union(russiaBelarusUnion, moldovaCoordinates, eastUkraineCoordinates)
  }
}

const russiaUkraineUnion = getRussiaUkraineUnion(initialState)

function getRussiaPolandUnion({ countries }: SteplessMapState) {
  const polandCoordinates = countries.find(({ name }) => name === 'Poland')?.coordinates
  if (russiaUkraineUnion && polandCoordinates) {
    const [, eastPoland] = difference(polandCoordinates, [congressPolandJson])
    return union(russiaUkraineUnion, [eastPoland], [congressPolandJson])[0]
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
    const [croatiaMain, croatiaExclave] = croatiaCoordinates
    return union(ahCzechUnion, sloveniaCoordinates, [croatiaMain], [croatiaExclave], bosniaCoordinates)
  }
}

const ahBalkansUnion = getAHBalkansUnion(initialState)

function getAHItalyUnion() {
  if (ahBalkansUnion) {
    return union(ahBalkansUnion, [trentinoSouthTyrolJson])
  }
}

const ahItalyUnion = getAHItalyUnion()

function getAHSerbiaUnion() {
  if (ahItalyUnion) {
    return union(ahItalyUnion, [vojvodinaJson])
  }
}

const ahSerbiaUnion = getAHSerbiaUnion()

function getRomaniaUnion({ countries }: SteplessMapState) {
  const romaniaCoordinates = countries.find(({ name }) => name === 'Romania')?.coordinates
  if (romaniaCoordinates) {
    return union(romaniaCoordinates, [neRomaniaJson])
  }
}

const romaniaUnion = getRomaniaUnion(initialState)

function getAHRomaniaUnion() {
  if (ahSerbiaUnion) {
    return union(ahSerbiaUnion, [exRomaniaJson])
  }
}

const ahRomaniaUnion = getAHRomaniaUnion()

function getAHFinalUnion() {
  if (ahRomaniaUnion) {
    return union(ahRomaniaUnion, [galiciaJson], [bukovinaJson])
  }
}

const ahFinalUnion = getAHFinalUnion()

const transitions: MapTransitionList = [
  ({ countries }) => {
    const russiaCoordinates = countries.find(({ name }) => name === 'Russia')?.coordinates
    const finlandCoordinates = countries.find(({ name }) => name === 'Finland')?.coordinates
    if (russiaFinlandUnion && russiaCoordinates && finlandCoordinates) {
      const [_russiaMain, ...russiaRest] = russiaCoordinates
      const [_finlandMain, ...finlandRest] = finlandCoordinates
      const russiaFinland = {
        "name": "RussiaFinland",
        "coordinates": [...russiaFinlandUnion, ...russiaRest, ...finlandRest]
      }
      return countryReplacement(['Russia', 'Finland'], [russiaFinland])
    }
  },
  ({ countries }) => {
    const russiaFinlandCoordinates = countries.find(({ name }) => name === 'RussiaFinland')?.coordinates
    const estoniaCoordinates = countries.find(({ name }) => name === 'Estonia')?.coordinates
    const latviaCoordinates = countries.find(({ name }) => name === 'Latvia')?.coordinates
    const lithuaniaCoordinates = countries.find(({ name }) => name === 'Lithuania')?.coordinates
    if (russiaBalticsUnion && russiaFinlandCoordinates && estoniaCoordinates && latviaCoordinates && lithuaniaCoordinates) {
      const [_russiaFinlandMain, _kaliningradCoordinates, ...russiaFinlandRest] = russiaFinlandCoordinates
      const [_estoniaMain, ...estoniaRest] = estoniaCoordinates
      const [_latviaMain, ...latviaRest] = latviaCoordinates
      const [_lithuaniaMain, ...lithuaniaRest] = lithuaniaCoordinates
      const russiaBaltics = {
        "name": "RussiaBaltics",
        "coordinates": [...russiaBalticsUnion, ...russiaFinlandRest, ...estoniaRest, ...latviaRest, ...lithuaniaRest]
      }
      return countryReplacement(['RussiaFinland', 'Estonia', 'Latvia', 'Lithuania'], [russiaBaltics])
    }
  },
  ({ countries }) => {
    const russiaBalticsCoordinates = countries.find(({ name }) => name === 'RussiaBaltics')?.coordinates
    const belarusCoordinates = countries.find(({ name }) => name === 'Belarus')?.coordinates
    if (russiaBelarusUnion && russiaBalticsCoordinates && belarusCoordinates) {
      const [_russiaBalticsMain, ...russiaBalticsRest] = russiaBalticsCoordinates
      const [_belarusMain, ...belarusRest] = belarusCoordinates
      const russiaBelarus = {
        "name": "RussiaBelarus",
        "coordinates": [...russiaBelarusUnion, ...russiaBalticsRest, ...belarusRest]
      }
      return countryReplacement(['RussiaBaltics', 'Belarus'], [russiaBelarus])
    }
  },
  ({ countries }) => {
    const russiaBelarusCoordinates = countries.find(({ name }) => name === 'RussiaBelarus')?.coordinates
    const ukraineCoordinates = countries.find(({ name }) => name === 'Ukraine')?.coordinates
    const moldovaCoordinates = countries.find(({ name }) => name === 'Moldova')?.coordinates
    if (russiaUkraineUnion && russiaBelarusCoordinates && ukraineCoordinates && moldovaCoordinates) {
      const [_russiaBelarusMain, ...russiaBelarusRest] = russiaBelarusCoordinates
      const [_ukraineMain, ...ukraineRest] = ukraineCoordinates
      const [_moldovaMain, ...moldovaRest] = moldovaCoordinates
      const russiaUkraine = {
        "name": "RussiaUkraine",
        "coordinates": [...russiaUkraineUnion, ...russiaBelarusRest, ...ukraineRest, ...moldovaRest]
      }
      return countryReplacement(['RussiaBelarus', 'Moldova'], [russiaUkraine])
    }
  },
  ({ countries }) => {
    const russiaUkraineCoordinates = countries.find(({ name }) => name === 'RussiaUkraine')?.coordinates
    if (russiaPolandUnion && russiaUkraineCoordinates) {
      const [_russiaUkraineMain, ...russiaUkraineRest] = russiaUkraineCoordinates
      const russiaPoland = {
        "name": "RussiaPoland",
        "coordinates": [russiaPolandUnion, ...russiaUkraineRest]
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
  ({ countries }) => {
    const croatiaCoordinates = countries.find(({ name }) => name === 'Croatia')?.coordinates
    if (ahBalkansUnion && croatiaCoordinates) {
      const [_croatiaMain, _croatiaExclave, ...croatiaRest] = croatiaCoordinates
      const austriaHungaryBalkans = {
        "name": "AustriaHungaryBalkans",
        "coordinates": [...ahBalkansUnion, ...croatiaRest]
      }
      return countryReplacement(['AustriaHungaryCZ', 'Slovenia', 'Croatia', 'Bosnia and Herz.'], [austriaHungaryBalkans])
    }
  },
  ({ countries }) => {
    const ahBalkansCoordinates = countries.find(({ name }) => name === 'AustriaHungaryBalkans')?.coordinates
    if (ahItalyUnion && ahBalkansCoordinates) {
      const [_ahBalkansMain, ...ahBalkansRest] = ahBalkansCoordinates
      const austriaHungaryItaly = {
        "name": "AustriaHungaryItaly",
        "coordinates": [...ahItalyUnion, ...ahBalkansRest]
      }
      return countryReplacement(['AustriaHungaryBalkans'], [austriaHungaryItaly])
    }
  },
  ({ countries }) => {
    const ahItalyCoordinates = countries.find(({ name }) => name === 'AustriaHungaryItaly')?.coordinates
    if (ahSerbiaUnion && ahItalyCoordinates) {
      const [_ahItalyMain, ...ahItalyRest] = ahItalyCoordinates
      const austriaHungarySerbia = {
        "name": "AustriaHungarySerbia",
        "coordinates": [...ahSerbiaUnion, ...ahItalyRest]
      }
      return countryReplacement(['AustriaHungaryItaly'], [austriaHungarySerbia])
    }
  },
  ({ countries }) => {
    const ahSerbiaCoordinates = countries.find(({ name }) => name === 'AustriaHungarySerbia')?.coordinates
    const romaniaCoordinates = countries.find(({ name }) => name === 'Romania')?.coordinates
    if (romaniaUnion && ahRomaniaUnion && ahSerbiaCoordinates && romaniaCoordinates) {
      const [_romaniaMain, ...romaniaRest] = romaniaCoordinates
      const origRomania = {
        "name": "NewRomania",
        "coordinates": [...romaniaUnion, ...romaniaRest]
      }
      const [_ahSerbiaMain, ...ahSerbiaRest] = ahSerbiaCoordinates
      const austriaHungaryRomania = {
        "name": "AustriaHungaryRomania",
        "coordinates": [...ahRomaniaUnion, ...ahSerbiaRest]
      }
      return countryReplacement(['AustriaHungarySerbia', 'Romania'], [origRomania, austriaHungaryRomania])
    }
  },
  ({ countries }) => {
    const ahRomaniaCoordinates = countries.find(({ name }) => name === 'AustriaHungaryRomania')?.coordinates
    if (ahFinalUnion && ahRomaniaCoordinates) {
      const [_ahRomaniaMain, ...ahRomaniaRest] = ahRomaniaCoordinates
      const austriaHungaryFinal = {
        "name": "AustriaHungaryFinal",
        "coordinates": [...ahFinalUnion, ...ahRomaniaRest]
      }
      return countryReplacement(['AustriaHungaryRomania', 'Ukraine'], [austriaHungaryFinal])
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
