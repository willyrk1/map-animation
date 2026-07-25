import { countryFadeIn, countryReplace, mapStep, MapSteps, textFadeOut, textMove, textFontPct, textRotate, viewCenterChange, zoomChange, highlightFadeIn, highlightFadeOut, arrowFadeIn } from './mapReducer';
import { CountryDetails } from './utility';
import MapAnimation from './MapAnimation';
import { getCountriesHighRes, getInitialMapText, textFadeIn, summaryTextFadeIn, modernColorMap, countryHighlight, areaHighlight } from './countries';
import {
  getAHBalkansUnion,
  getBalkanTrioUnion,
  getAHCzechUnion,
  getCzechSlovakiaUnion,
  getAHFinalUnion,
  getGaliciaBukovinaUnion,
  getAHItalyUnion,
  getAHRomaniaUnion,
  getAHSerbiaUnion,
  getAustriaHungaryUnion,
  getBulgariaUnion,
  getGermanyFinalUnion,
  getKaliningradMemelUnion,
  getGermanyFranceDenmarkUnion,
  getAlsaceLorraineSouthJutlandUnion,
  getGermanyPolandUnion,
  getPolandWestNorthUnion,
  getRomaniaBulgariaUnion,
  getRomaniaUnion,
  getRussiaBalticsUnion,
  getBalticsUnion,
  getRussiaBelarusUnion,
  getRussiaFinlandUnion,
  getRussiaMiddleEastUnion,
  getCaucasusUnion,
  getRussiaPolandUnion,
  getRussiaUkraineUnion,
  getSerbiaFinalUnion,
  getOttomanEuropeUnion,
  getOttomanMiddleEastUnion,
  getLevantUnion
} from './positionCalc';
import trentinoSouthTyrolJson from './data/TrentinoSouthTyrol.json';
import vojvodinaJson from './data/Vojvodina.json';
import exRomaniaJson from './data/exRomania.json';

export const initialState = {
  countries: getCountriesHighRes(),
  textCollection: getInitialMapText(),
  highlightCollection: [],
  arrowCollection: [],
  viewCenter: [28, 57],
  zoom: 3.65,
}

const russiaFinlandUnion = getRussiaFinlandUnion(initialState)
const russiaBalticsUnion = getRussiaBalticsUnion(initialState)
const balticsUnion = getBalticsUnion(initialState)
const russiaBelarusUnion = getRussiaBelarusUnion(initialState)
const russiaUkraineUnion = getRussiaUkraineUnion(initialState)
const russiaPolandUnion = getRussiaPolandUnion(initialState)
const russiaMiddleEastUnion = getRussiaMiddleEastUnion(initialState)
const caucasusUnion = getCaucasusUnion(initialState)
const germanyFranceDenmarkUnion = getGermanyFranceDenmarkUnion(initialState)
const alsaceLorraineSouthJutlandUnion = getAlsaceLorraineSouthJutlandUnion()
const germanyPolandUnion = getGermanyPolandUnion(initialState)
const polandWestNorthUnion = getPolandWestNorthUnion(initialState)
const germanyFinalUnion = getGermanyFinalUnion(initialState)
const kaliningradMemelUnion = getKaliningradMemelUnion(initialState)
const austriaHungaryUnion = getAustriaHungaryUnion(initialState)
const ahCzechUnion = getAHCzechUnion(initialState)
const czechSlovakiaUnion = getCzechSlovakiaUnion(initialState)
const ahBalkansUnion = getAHBalkansUnion(initialState)
const balkanTrioUnion = getBalkanTrioUnion(initialState)
const ahItalyUnion = getAHItalyUnion(initialState)
const ahSerbiaUnion = getAHSerbiaUnion(initialState)
const romaniaUnion = getRomaniaUnion(initialState)
const ahRomaniaUnion = getAHRomaniaUnion(initialState)
const ahFinalUnion = getAHFinalUnion(initialState)
const galiciaBukovinaUnion = getGaliciaBukovinaUnion()
const bulgariaUnion = getBulgariaUnion(initialState)
const ottomanEuropeUnion = getOttomanEuropeUnion(initialState)
const romaniaBulgariaUnion = getRomaniaBulgariaUnion(initialState)
const serbiaFinalUnion = getSerbiaFinalUnion(initialState)
const ottomanMiddleEastUnion = getOttomanMiddleEastUnion(initialState)
const levantUnion = getLevantUnion(initialState)
const bosniaCoordinates = initialState.countries.find(c => c.name === 'Bosnia and Herz.')?.coordinates ?? []
const luxembourgCoordinates = initialState.countries.find(c => c.name === 'Luxembourg')?.coordinates ?? []

export const steps: MapSteps = [
  // ------------------------------------------------------------------- 0
  mapStep([
    textFadeOut('StartSummary'),
    summaryTextFadeIn('RussianEmpireSummary', 53, 63, ['Russia had been an empire for', 'nearly two centuries and', 'encompassed modern-day Finland...']),
    textFadeIn('Russian Empire', 44, 57.24804212417763, { text: ['Russian', 'Empire'], fontPct: 200 }),
    textFadeIn('Finland', 26, 62.5902121295499),
    highlightFadeIn(countryHighlight('Finland')),
  ], 4000),
  // ------------------------------------------------------------------- 1
  mapStep([
    textFadeOut('Finland'),
    highlightFadeOut('Finland'),
    countryReplace('Russia'),
    countryReplace('Finland'),
    countryFadeIn('RussiaFinland', russiaFinlandUnion)
  ]),
  // ------------------------------------------------------------------- 2
  mapStep([
    viewCenterChange(15, 52),
    zoomChange(8),
    textFadeOut('RussianEmpireSummary'),
    summaryTextFadeIn('RussiaBalticSummary', 34, 58, 'The Baltic states...'),
    textMove('Russian Empire', 38, 54),
    textFadeIn('Estonia', 25.8, 58.6),
    textFadeIn('Latvia', 25.84680136704439, 56.83295731831097),
    textFadeIn('Lithuania', 24, 55.4, { color: 'black' }),
    highlightFadeIn(areaHighlight('Baltics', balticsUnion)),
    textFadeIn('Ukraine', 31.00791766243967, 49.4, { fontPct: 150 }),
    textFadeIn('Belarus', 27.8206206153948, 53.2, { fontPct: 130 }),
    textFadeIn('Moldova', 28.5, 47.3, { fontPct: 85, rotation: 45 }),
    textFadeIn('Poland', 19.4, 52, { fontPct: 130, color: 'black' }),
    textFadeIn('France', 2.6, 48.1, { fontPct: 150 }),
    textFadeIn('Germany', 10.5, 51.8, { fontPct: 150, color: 'white' }),
    textFadeIn('United Kingdom', -1.8, 52.6, { text: ['United', 'Kingdom'], fontPct: 90 }),
    textFadeIn('Spain', -2.8, 42),
    textFadeIn('Italy', 10.1, 45),
    textFadeIn('Sweden', 14.2, 57.9, { color: 'black' }),
    textFadeIn('Romania', 24.9, 45.8, { color: 'black' }),
    textFadeIn('Bulgaria', 25.1, 42.6),
    textFadeIn('Norway', 8.4, 59.6),
    textFadeIn('Ireland', -7.8, 53, { fontPct: 85 }),
    textFadeIn('Czechia', 15.5, 49.6),
    textFadeIn('Austria', 14.7, 47.6),
    textFadeIn('Hungary', 19.1, 47.1),
    textFadeIn('Serbia', 21, 44),
  ], 1900),
  // ------------------------------------------------------------------- 3
  mapStep([
    textFadeOut('Estonia'),
    textFadeOut('Latvia'),
    textFadeOut('Lithuania'),
    highlightFadeOut('Baltics'),
    countryReplace('RussiaFinland'),
    countryReplace('Estonia'),
    countryReplace('Latvia'),
    countryFadeIn('RussiaBaltics', russiaBalticsUnion)
  ]),
  // ------------------------------------------------------------------- 4
  mapStep([
    textFadeOut('RussiaBalticSummary'),
    textMove('Russian Empire', 36, 57),
    summaryTextFadeIn('RussiaBelarusSummary', 37, 54, 'Belarus...'),
    highlightFadeIn(countryHighlight('Belarus')),
  ], 1500),
  // ------------------------------------------------------------------- 5
  mapStep([
    textFadeOut('Belarus'),
    highlightFadeOut('Belarus'),
    countryReplace('RussiaBaltics'),
    countryReplace('Belarus'),
    countryFadeIn('RussiaBelarus', russiaBelarusUnion)
  ]),
  // ------------------------------------------------------------------- 6
  mapStep([
    textFadeOut('RussiaBelarusSummary'),
    summaryTextFadeIn('RussiaUkraineSummary', 33.5, 54, 'Moldova and most of Ukraine...'),
    highlightFadeIn(countryHighlight('Ukraine')),
    highlightFadeIn(countryHighlight('Moldova')),
  ], 2500),
  // ------------------------------------------------------------------- 7
  mapStep([
    textFadeOut('Ukraine'),
    textFadeOut('Moldova'),
    highlightFadeOut('Ukraine'),
    highlightFadeOut('Moldova'),
    textFadeIn('Ukraine2', 24.4, 49, { text: 'Ukraine', fontPct: 90 }),
    countryReplace('RussiaBelarus'),
    countryReplace('Moldova'),
    countryFadeIn('RussiaUkraine', russiaUkraineUnion)
  ]),
  // ------------------------------------------------------------------- 8
  mapStep([
    textFadeOut('RussiaUkraineSummary'),
    summaryTextFadeIn('RussiaPolandSummary', 31, 53, ['Eastern Poland', '(Congress Poland)...']),
    highlightFadeIn(countryHighlight('Poland')),
  ], 2100),
  // ------------------------------------------------------------------- 9
  mapStep([
    highlightFadeOut('Poland'),
    textMove('Poland', 16.5, 53.2),
    textFontPct('Poland', 120),
    countryReplace('RussiaUkraine'),
    countryFadeIn('RussiaPoland', russiaPolandUnion),
  ]),
  // ------------------------------------------------------------------- 10
  mapStep([
    viewCenterChange(44.5, 43.8),
    zoomChange(10),
    textMove('Russian Empire', 40, 49),
    textFadeOut('RussiaPolandSummary'),
    summaryTextFadeIn('RussiaCaucusus', 52.8, 44, '...and the Caucasus region.'),
    textFadeIn('Georgia', 43.4, 42.1, { color: 'black' }),
    textFadeIn('Azerbaijan', 47.6, 40.5),
    textFadeIn('Armenia', 44.7, 40.4, { fontPct: 90, rotation: 45 }),
    textFadeIn('Turkey', 35.3, 39, { fontPct: 150 }),
    highlightFadeIn(areaHighlight('Caucasus', caucasusUnion)),
  ], 2300),
  // ------------------------------------------------------------------- 11
  mapStep([
    textFadeOut('Georgia'),
    textFadeOut('Azerbaijan'),
    textFadeOut('Armenia'),
    highlightFadeOut('Caucasus'),
    countryReplace('RussiaPoland'),
    countryReplace('Armenia'),
    countryReplace('Azerbaijan'),
    countryReplace('Georgia'),
    countryFadeIn('RussiaMiddleEast', russiaMiddleEastUnion),
  ]),
  // ------------------------------------------------------------------- 12
  mapStep([
    viewCenterChange(15, 52),
    zoomChange(13),
    textMove('Russian Empire', 25, 52),
    textFadeOut('RussiaCaucusus'),
    textFadeOut('Germany'),
    textFadeIn('German Empire', 10.5, 51.8, { fontPct: 150 }),
    textFadeIn('Denmark', 9.2, 56.2, { fontPct: 80 }),
    summaryTextFadeIn('GermanyInitial', 3, 54, [
      'Germany was also an empire', 'after unifying 43 years', 'earlier. It included South', 'Jutland (Denmark),', 'Alsace-Lorraine (France)...'
    ]),
    highlightFadeIn(areaHighlight('AlsaceLorraineSouthJutland', alsaceLorraineSouthJutlandUnion)),
    textFadeIn('Slovakia', 19.5, 48.75, { fontPct: 140, color: 'black' }),
    textFadeIn('Switzerland', 8.2, 46.8, { color: 'black' }),
    textFadeIn('Belgium', 4.7, 50.6, { color: 'black' }),
    textFontPct('Austria', 140),
    textFontPct('Hungary', 140),
    textFontPct('Czechia', 140),
    textFontPct('Romania', 140),
  ], 7000),
  // ------------------------------------------------------------------- 13
  mapStep([
    highlightFadeOut('AlsaceLorraineSouthJutland'),
    countryReplace('Germany'),
    countryFadeIn('GermanyFranceDenmark', germanyFranceDenmarkUnion),
  ]),
  // ------------------------------------------------------------------- 14
  mapStep([
    textFadeOut('GermanyInitial'),
    summaryTextFadeIn('GermanyPoland', 15.4, 55.5, ['Western and', 'northern Poland...']),
    highlightFadeIn(areaHighlight('PolandWestNorth', polandWestNorthUnion)),
  ], 2100),
  // ------------------------------------------------------------------- 15
  mapStep([
    highlightFadeOut('PolandWestNorth'),
    textMove('Poland', 21.4, 49.75),
    textMove('German Empire', 13, 52.3),
    countryReplace('GermanyFranceDenmark'),
    countryFadeIn('GermanyPoland', germanyPolandUnion),
  ]),
  // ------------------------------------------------------------------- 16
  mapStep([
    textFadeOut('GermanyPoland'),
    summaryTextFadeIn('EastGermany', 16, 56, ['...Kaliningrad (Russia),', 'and Memel (Lithuania).']),
    highlightFadeIn(areaHighlight('KaliningradMemel', kaliningradMemelUnion)),
  ], 2300),
  // ------------------------------------------------------------------- 17
  mapStep([
    highlightFadeOut('KaliningradMemel'),
    countryReplace('GermanyPoland'),
    countryReplace('Lithuania'),
    countryFadeIn('GermanyFinal', germanyFinalUnion),
  ]),
  // ------------------------------------------------------------------- 18
  mapStep([
    viewCenterChange(20.7, 46.8),
    zoomChange(14.7),
    textMove('France', 4, 46.9),
    textMove('German Empire', 9.3, 50.4),
    textMove('Russian Empire', 29, 51),
    textFontPct('Serbia', 140),
    textFontPct('Bulgaria', 140),
    textFontPct('Italy', 140),
    textFadeIn('Slovenia', 14.6, 46),
    textFadeIn('Croatia', 16.6, 45.6),
    textFadeIn('Bosnia', 17.8, 44.3, { text: ['Bosnia and', 'Herzegovina'], color: 'black' }),
    textFadeIn('Montenegro', 19.2, 42.9, { text: ['Monte-', 'negro'], fontPct: 75 }),
    textFadeIn('Kosovo', 20.9, 42.5, { fontPct: 80 }),
    textFadeIn('North Macedonia', 21.7, 41.6, { text: ['North', 'Macedonia'], fontPct: 90, color: 'black' }),
    textFadeIn('Greece', 21.6, 39.9, { fontPct: 120 }),
    textFadeIn('Albania', 20.15, 40.7, { fontPct: 90 }),
    textFadeOut('EastGermany'),
    summaryTextFadeIn('AustriaEmpire', 16, 44.5, ['In central Europe, Austria and Hungary were joined in', 'an empire led by the centuries-old Habsburg dynasty.']),
    highlightFadeIn(areaHighlight('AustriaHungary', austriaHungaryUnion)),
  ], 5400),
  // ------------------------------------------------------------------- 19
  mapStep([
    highlightFadeOut('AustriaHungary'),
    countryReplace('Austria'),
    countryReplace('Hungary'),
    countryFadeIn('AustriaHungary', austriaHungaryUnion),
    textFadeOut('Austria'),
    textFadeOut('Hungary'),
    textFadeIn('Austria-Hungary', 17, 47.3, { fontPct: 140 }),
  ]),
  // ------------------------------------------------------------------- 20
  mapStep([
    textFadeOut('AustriaEmpire'),
    summaryTextFadeIn('AHCzechoslovakia', 16, 44.8, 'It included its neighbors to the north...'),
    highlightFadeIn(areaHighlight('CzechSlovakia', czechSlovakiaUnion)),
  ], 2700),
  // ------------------------------------------------------------------- 21
  mapStep([
    highlightFadeOut('CzechSlovakia'),
    countryReplace('AustriaHungary'),
    countryReplace('Czechia'),
    countryReplace('Slovakia'),
    countryFadeIn('AustriaHungaryCZ', ahCzechUnion),
    textFadeOut('Czechia'),
    textFadeOut('Slovakia'),
    textMove('Austria-Hungary', 17.3, 48.1),
  ]),
  // ------------------------------------------------------------------- 22
  mapStep([
    textFadeOut('AHCzechoslovakia'),
    summaryTextFadeIn('AHBalkans', 24, 44.8, 'The western Balkan states...'),
    highlightFadeIn(areaHighlight('BalkanTrio', balkanTrioUnion)),
  ], 2100),
  // ------------------------------------------------------------------- 23
  mapStep([
    highlightFadeOut('BalkanTrio'),
    countryReplace('AustriaHungaryCZ'),
    countryReplace('Slovenia'),
    countryReplace('Croatia'),
    countryReplace('Bosnia and Herz.'),
    countryFadeIn('AustriaHungaryBalkans', ahBalkansUnion),
    textFadeOut('Slovenia'),
    textFadeOut('Croatia'),
    textFadeOut('Bosnia'),
    textMove('Austria-Hungary', 17.2, 47.2),
  ]),
  // ------------------------------------------------------------------- 24
  mapStep([
    textFadeOut('AHBalkans'),
    summaryTextFadeIn('Trentino', 10.9, 48.4, 'Trentino and South Tyrol (Italy)...'),
    highlightFadeIn(areaHighlight('Trentino', trentinoSouthTyrolJson)),
  ], 2500),
  // ------------------------------------------------------------------- 25
  mapStep([
    highlightFadeOut('Trentino'),
    countryReplace('AustriaHungaryBalkans'),
    countryFadeIn('AustriaHungaryItaly', ahItalyUnion),
  ]),
  // ------------------------------------------------------------------- 26
  mapStep([
    textFadeOut('Trentino'),
    summaryTextFadeIn('Vojvodina', 24.7, 45.7, 'Vojvodina (Serbia)...'),
    highlightFadeIn(areaHighlight('Vojvodina', vojvodinaJson)),
  ], 1700),
  // ------------------------------------------------------------------- 27
  mapStep([
    highlightFadeOut('Vojvodina'),
    countryReplace('AustriaHungaryItaly'),
    countryFadeIn('AustriaHungarySerbia', ahSerbiaUnion),
    textMove('Serbia', 21, 43.8),
  ]),
  // ------------------------------------------------------------------- 28
  mapStep([
    textFadeOut('Vojvodina'),
    summaryTextFadeIn('AHRomania', 26, 49, 'Much of Romania...'),
    highlightFadeIn(areaHighlight('ExRomania', exRomaniaJson)),
  ], 1900),
  // ------------------------------------------------------------------- 29
  mapStep([
    highlightFadeOut('ExRomania'),
    countryReplace('AustriaHungarySerbia'),
    countryReplace('Romania'),
    countryFadeIn('NewRomania', romaniaUnion),
    countryFadeIn('AustriaHungaryRomania', ahRomaniaUnion),
    textMove('Romania', 25.8, 44.7),
    textMove('Austria-Hungary', 19, 47),
  ]),
  // ------------------------------------------------------------------- 30
  mapStep([
    textFadeOut('AHRomania'),
    summaryTextFadeIn('GaliciaBukovina', 23.5, 51.3, 'Galicia, and Bukovina.'),
    highlightFadeIn(areaHighlight('GaliciaBukovina', galiciaBukovinaUnion)),
  ], 1900),
  // ------------------------------------------------------------------- 31
  mapStep([
    highlightFadeOut('GaliciaBukovina'),
    countryReplace('AustriaHungaryRomania'),
    countryReplace('Ukraine'),
    countryReplace('Poland'),
    countryFadeIn('AustriaHungaryFinal', ahFinalUnion),
    textFadeOut('Poland'),
    textFadeOut('Ukraine2'),
    textMove('Austria-Hungary', 19.5, 47.3),
  ]),
  // ------------------------------------------------------------------- 32
  mapStep([
    viewCenterChange(24.2, 43.2),
    zoomChange(16),
    textFadeOut('GaliciaBukovina'),
    summaryTextFadeIn('Bulgaria changes', 32.5, 43.5, ['The Balkan Wars of prior', 'years shaped the borders', 'of Bulgaria...']),
    textMove('Italy', 12.16, 43),
    textMove('Turkey', 33, 39),
    highlightFadeIn(countryHighlight('Bulgaria')),
  ], 3800),
  // ------------------------------------------------------------------- 33
  mapStep([
    highlightFadeOut('Bulgaria'),
    countryReplace('Bulgaria'),
    countryReplace('NewRomania'),
    countryReplace('Turkey'),
    countryFadeIn('RomaniaFinal', romaniaBulgariaUnion),
    countryFadeIn('OttomanEurope', ottomanEuropeUnion),
    countryFadeIn('BulgariaFinal', bulgariaUnion),
    textMove('North Macedonia', 21.55, 41.6),
  ]),
  // ------------------------------------------------------------------- 34
  mapStep([
    textFadeOut('Bulgaria changes'),
    summaryTextFadeIn('Serbia union', 25.7, 43.5, ['...as well as Serbia']),
    highlightFadeIn(areaHighlight('SerbiaFinal', serbiaFinalUnion)),
  ], 2100),
  // ------------------------------------------------------------------- 35
  mapStep([
    highlightFadeOut('SerbiaFinal'),
    countryReplace('Serbia'),
    countryReplace('North Macdeonia'),
    countryReplace('Kosovo'),
    countryFadeIn('SerbiaFinal', serbiaFinalUnion),
    textFadeOut('Kosovo'),
    textFadeOut('North Macedonia'),
    textMove('Serbia', 21.3, 43),
  ]),
  // ------------------------------------------------------------------- 36
  mapStep([
    viewCenterChange(40, 29),
    zoomChange(6.2),
    textMove('Turkey', 36, 39),
    textFadeOut('Serbia union'),
    textFadeOut('Greece'),
    textFadeOut('Albania'),
    textFadeOut('Montenegro'),
    textFadeOut('Romania'),
    textFadeOut('Bulgaria'),
    textFadeOut('Italy'),
    textFadeOut('Serbia'),
    summaryTextFadeIn('Middle East', 61, 35, ['In the Middle East, the Turkish', 'Ottoman Empire controlled many sea', 'coasts and the Holy Land.']),
    textFadeIn('Syria', 38.4, 35.2, { color: 'black' }),
    textFadeIn('Iraq', 43.3, 33.1, { fontPct: 120 }),
    textFadeIn('Jordan', 36.5, 30.7, { fontPct: 70 }),
    textFadeIn('Saudi Arabia', 43.6, 24.3, { fontPct: 120, color: 'black' }),
    textFadeIn('Yemen', 47.1, 15.9),
    highlightFadeIn(areaHighlight('Levant', levantUnion)),
  ], 5200),
  // ------------------------------------------------------------------- 37
  mapStep([
    highlightFadeOut('Levant'),
    countryReplace('OttomanEurope'),
    countryReplace('Lebanon'),
    countryReplace('Israel'),
    countryReplace('Palestine'),
    countryFadeIn('OttomanMiddleEast', ottomanMiddleEastUnion),
    textFadeOut('Iraq'),
    textFadeOut('Jordan'),
    textFadeOut('Syria'),
    textFadeOut('Turkey'),
    textFadeIn('Ottoman Empire', 39.5, 38, { text: ['Ottoman', 'Empire'], fontPct: 150 }),
    textFadeOut('Saudi Arabia'),
    textFadeIn('Arabia', 46, 23.5, { fontPct: 120, color: 'black' }),
    textMove('Yemen', 49.3, 16.3),
  ]),
  // ------------------------------------------------------------------- 38
  mapStep([
    viewCenterChange(18, 42),
    zoomChange(4.6),
    textFadeOut('Middle East'),
    textFadeOut('Spain'),
    textFadeOut('Denmark'),
    textFadeOut('Ireland'),
    textFadeOut('Switzerland'),
    textFadeOut('Belgium'),
    textFontPct('Ottoman Empire', 100),
    textFontPct('Russian Empire', 100),
    textFontPct('German Empire', 100),
    textFontPct('Austria-Hungary', 100),
    textFontPct('France', 100),
    textFontPct('United Kingdom', 70),
    textMove('France', 2.5, 46.9),
    textMove('German Empire', 13, 52.5),
    textMove('Russian Empire', 28, 52),
    summaryTextFadeIn('WWIClimate', -5, 35, [
      'By 1914, Europe was divided into rival',
      'alliances. Ambitious Germany allied with',
      'the fading Austria-Hungarian and Ottoman',
      'Empires while Britain and France allied',
      'with the struggling Russian Empire.'
    ]),
  ], 5500),
  // ------------------------------------------------------------------- 39
  mapStep([
    viewCenterChange(22, 43),
    zoomChange(14),
    textFadeOut('WWIClimate'),
    textFadeIn('Serbia', 21.06, 43.3, { fontPct: 120 }),
    textFadeIn('Montenegro', 19.25, 42.85, { text: ['Monte-', 'negro'], fontPct: 70 }),
    textFadeIn('Bulgaria', 25.1, 42.6, { fontPct: 140 }),
    textFadeIn('Romania', 25.8, 44.7, { fontPct: 140, color: 'black' }),
    textFadeIn('Albania', 20.15, 40.7, { fontPct: 80 }),
    textFadeIn('Greece', 21.6, 39.7, { fontPct: 120 }),
    textFadeIn('Italy', 10.1, 45, { fontPct: 140 }),
    textFadeIn('Bosnia', 17.6, 44.2, { fontPct: 120 }),
    textFadeIn('Switzerland', 8.2, 46.8, { color: 'black' }),
    textMove('Ottoman Empire', 31, 39),
    textMove('Russian Empire', 30, 48),
    textMove('German Empire', 10, 48.5),
    textMove('Austria-Hungary', 19.5, 46.5),
    textFontPct('Ottoman Empire', 200),
    textFontPct('Russian Empire', 200),
    textFontPct('German Empire', 160),
    textFontPct('Austria-Hungary', 200),
    highlightFadeIn(areaHighlight('Bosnia', bosniaCoordinates, { strokeDasharray: `${4 / 40} ${2.5 / 40}`, opacity: 0.55 })),
    summaryTextFadeIn('BalkanWars', 12, 40, [
      'Caught between aging empires,',
      'the Balkan states spent 1912',
      'and 1913 warring with the',
      'Ottomans and each other amid',
      'growing nationalist sentiment.',
    ]),
  ], 5500),
  // ------------------------------------------------------------------- 40
  mapStep([
    viewCenterChange(18.39, 43.86),
    zoomChange(40),
    textFadeOut('BalkanWars'),
    textFontPct('Bosnia', 140),
    textFontPct('Serbia', 140),
    textFadeOut('Montenegro'),
    textFadeIn('Montenegro', 19.2, 42.9),
    textMove('Bulgaria', 23.22, 42.6),
    textMove('Romania', 23.37, 44.55),
    textMove('Albania', 19.93, 42.2),
    textFontPct('Albania', 90),
    textMove('Austria-Hungary', 17.9, 45.2),
    textFontPct('Austria-Hungary', 300),
    textRotate('Austria-Hungary', -20),
    textFadeIn('SarajevoMarker', 18.413, 43.856, { text: '★', fontPct: 200, color: '#e8c84a' }),
    textFadeIn('Sarajevo', 18.03, 43.856, { fontPct: 90, color: '#e8c84a' }),
    summaryTextFadeIn('Assassination', 14.8, 42.85, [
      'Tensions boiled over on June 28, 1914',
      'when a Bosnian Serb nationalist',
      'assassinated the heir to the throne',
      'of Austria-Hungary, Archduke Franz',
      'Ferdinand, and his wife, while they',
      'visited the Bosnian provincial',
      'capital of Sarajevo.',
    ]),
  ]),
  // ------------------------------------------------------------------- 41
  mapStep([
    textFadeOut('Assassination'),
    summaryTextFadeIn('Aftermath', 14.5, 43.0, [
      'The assassination triggered the',
      '"July Crisis" with violence',
      'across Bosnia. Austria-Hungary',
      'blamed Serbia for the plot and,',
      'over the following month,',
      'arrested thousands of ethnic',
      'Serbs, Croats, and Bosniaks',
      'suspected of pro-Serbian',
      'sympathies.',
    ]),
  ], 5500),
  // ------------------------------------------------------------------- 42
  mapStep([
    textFadeOut('Aftermath'),
    textFadeIn('BelgradeMarker', 20.46, 44.81, { text: '💥', fontPct: 200 }),
    textFadeIn('Belgrade', 20.46, 44.65, { fontPct: 90, color: '#e8c84a' }),
    summaryTextFadeIn('WarDeclaration', 14.7, 43.0, [
      'Negotiations collapsed. On July 28,',
      '1914 - exactly one month after the',
      'assassination - Austria-Hungary',
      'declared war on Serbia and began',
      'shelling Belgrade, the Serbian',
      'capital, from across the Danube.',
    ]),
  ], 6000, [{ center: [20.46, 44.81], radius: 12 }]),
  // ------------------------------------------------------------------- 43
  mapStep([
    viewCenterChange(22, 49),
    zoomChange(10),
    textFadeOut('WarDeclaration'),
    textMove('Austria-Hungary', 19.5, 47.5),
    textFontPct('Austria-Hungary', 160),
    textRotate('Austria-Hungary', 0),
    textMove('German Empire', 12.5, 52),
    textMove('Russian Empire', 24, 52),
    textFontPct('Russian Empire', 160),
    textFontPct('Serbia', 100),
    textMove('Romania', 26, 44.6),
    textMove('Bulgaria', 25.5, 42.6),
    textFadeOut('Montenegro'),
    textFadeOut('Albania'),
    textFontPct('Belgrade', 80),
    textMove('Belgrade', 20.8, 44.2),
    textFontPct('France', 160),
    textFontPct('Switzerland', 85),
    textFontPct('Bosnia', 90),
    textFadeOut('Sarajevo'),
    textFontPct('SarajevoMarker', 100),
    textFadeIn('Belgium', 4.7, 50.6, { fontPct: 85, color: 'black' }),
    textFadeIn('Netherlands', 5.6, 52.2, { fontPct: 65, color: 'black' }),
    textFadeIn('GermanyRussiaMarker', 18, 52.2, { text: '⚔️', fontPct: 180 }),
    summaryTextFadeIn('GermanyRussiaWar', 35, 52, [
      'After more failed talks,',
      "allies followed suit, and",
      "Germany declared war on",
      'Russia on August 1, 1914.',
    ]),
  ]),
  // ------------------------------------------------------------------- 44
  mapStep([
    viewCenterChange(6.06, 49.75),
    zoomChange(55),
    textFadeOut('GermanyRussiaWar'),
    textMove('France', 4, 49.3),
    textFontPct('France', 200),
    textMove('German Empire', 8, 49.9),
    textFontPct('German Empire', 200),
    textMove('Belgium', 5.2, 50.4),
    textFontPct('Belgium', 200),
    countryReplace('Luxembourg'),
    countryFadeIn('Luxembourg', luxembourgCoordinates, { stripesColors: [modernColorMap['Luxembourg'], modernColorMap['Germany']] }),
    textFadeIn('Luxembourg', 6.13, 49.75, { fontPct: 100, color: 'white' }),
    summaryTextFadeIn('LuxembourgInvasion', 8, 50.5, [
      'The next day, August 2, 1914,',
      'with French troops still a good',
      'distance away, Germany opened the',
      'western front by occupying Luxembourg.',
    ]),
  ]),
  // ------------------------------------------------------------------- 45
  mapStep([
    textFadeOut('LuxembourgInvasion'),
    textFadeIn('FranceGermanyWarMarker', 6.0, 49.2, { text: '⚔️', fontPct: 150 }),
    summaryTextFadeIn('BelgiumDemand', 8, 50.5, [
      'On August 3, Germany declared war',
      'on France and demanded that neutral',
      'Belgium allow its troops passage.',
    ]),
  ]),
  // ------------------------------------------------------------------- 46
  mapStep([
    textFadeOut('BelgiumDemand'),
    arrowFadeIn({
      id: 'GermanyLiege',
      start: [6.55, 50.5],
      end: [5.7, 50.6],
      width: 5,
      color: modernColorMap['Germany'],
      borderColor: 'black',
      borderWidth: 1,
      curvature: -0.18,
    }),
    textFadeIn('LiegeExplosion', 5.5706, 50.6397, { text: '💥', fontPct: 150 }),
    textFadeIn('Liege', 5.35, 50.7, { text: 'Liège', fontPct: 110, color: 'black' }),
    summaryTextFadeIn('BelgiumInvasion', 8, 50.5, [
      'When Belgium refused, Germany',
      'invaded and the Battle of',
      'Liège began on August 5.',
    ]),
  ], undefined, [{ center: [5.5706, 50.6397], radius: 10 }]),
]

function toWithPathProps(country: CountryDetails): CountryDetails {
  return {
    ...country,
    pathProps: {
      stroke: '#3d2a1a',
      strokeWidth: 0.03,
      fill: modernColorMap[country.name ?? ''] ?? 'grey',
      ...country.pathProps
    }
  }
}

export default function WW1() {
  return <MapAnimation steps={steps} initialState={initialState} toWithPathProps={toWithPathProps} />
}
