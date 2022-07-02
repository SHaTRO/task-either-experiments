import { config } from '../../config';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { PositiveInt } from 'io-ts-numbers';
import request from 'superagent';
import { decodeBodyOrErrorTE, decodeTextOrErrorTE, tryCatchWithErrorTE } from '../../utils/taskeither';
import { flow, pipe } from 'fp-ts/lib/function';
import { Lens } from 'monocle-ts';
import { mean, median, mode } from '../../math/averages';

export const NumericalKeyOf = <D extends Record<number, unknown>>(
  keys: D,
  name: string = Object.keys(keys)
    .map(k => JSON.stringify(k))
    .join(' | ')
): t.KeyofC<D> => {
  const is = (u: unknown): u is keyof D => t.number.is(u) && Object.prototype.hasOwnProperty.call(keys, u)
  return new t.KeyofType(name, is, (u, c) => (is(u) ? t.success(u) : t.failure(u, c)), t.identity, keys)
}

type RelativeHumidityIndicators = -4|-3|-2|-1|0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16;
export const RelativeHumidityMap: Readonly<Record<RelativeHumidityIndicators, string>> = {
  [-4]: '0%-5%',
  [-3]: '5%-10%',
  [-2]: '10%-15%',
  [-1]: '15%-20%',
  [0]: '20%-25%',
  [1]: '25%-30%',
  [2]: '30%-35%',
  [3]: '35%-40%',
  [4]: '40%-45%',
  [5]: '45%-50%',
  [6]: '50%-55%',
  [7]: '55%-60%',
  [8]: '60%-65%',
  [9]: '65%-70%',
  [10]: '70%-75%',
  [11]: '75%-80%',
  [12]: '80%-85%',
  [13]: '85%-90%',
  [14]: '90%-95%',
  [15]: '95%-99%',
  [16]: '100%',
};
export const RelativeHumidity2m = NumericalKeyOf(RelativeHumidityMap);
export type RelativeHumidity2m = t.TypeOf<typeof RelativeHumidity2m>;

// to avoid confusion, do not export the Enum
enum WindDirectionEnum {
  N,
  NE,
  E,
  SE,
  S,
  SW,
  W,
  NW,
};
export const WindDirection = t.keyof(WindDirectionEnum);
export type WindDirection = t.TypeOf<typeof WindDirection>;

export type WindDescriptor = {
  mph: string,
  mps: string,
  term: string, 
};
type WindSpeedIndicators = 1|2|3|4|5|6|7|8;
export const WindSpeedMap: Readonly<Record<WindSpeedIndicators, WindDescriptor>> = {
  [1]: { mph: '<0.7 mph', mps: 'Below 0.3 m/s', term: 'calm' },
  [2]: { mph: '0.7-7.6 mph', mps: '0.3-3.4 m/s', term: 'light' },
  [3]: { mph: '7.6-17.9 mph', mps: '3.4-8.0 m/s', term: 'moderate' },
  [4]: { mph: '17.9-24.2 mph', mps: '8.0-10.8 m/s', term: 'fresh' },
  [5]: { mph: '24.2-38.5 mph', mps: '10.8-17.2 m/s', term: 'strong' },
  [6]: { mph: '38.5-54.8 mph', mps: '17.2-24.5 m/s', term: 'gale' },
  [7]: { mph: '54.8-73 mph', mps: '24.5-32.6', term: 'storm' },
  [8]: { mph: '>73 mph', mps: 'Over 32.6 m/s', term: 'hurricane' },
};
export const WindSpeed = NumericalKeyOf(WindSpeedMap);
export type WindSpeed = t.TypeOf<typeof WindSpeed>;

export const Wind10m = t.type({
  direction: WindDirection,
  speed: PositiveInt,
});
export type Wind10m = t.TypeOf<typeof Wind10m>;

// to avoid confusion, do not export the Enum
enum PrecipitationTypeEnum {
  snow,
  rain,
  frzr,
  icep,
  none,
};
export const PrecipitationType = t.keyof(PrecipitationTypeEnum);
export type PrecipitationType = t.TypeOf<typeof PrecipitationType>;

export const AstroDataSeriesItem = t.type({
  timepoint: PositiveInt,
  cloudcover: PositiveInt,
  seeing: PositiveInt,
  transparency: PositiveInt,
  lifted_index: t.Int,
  rh2m: RelativeHumidity2m,
  wind10m: Wind10m,
  temp2m: t.Int,   
  prec_type: PrecipitationType,
});
export type AstroDataSeriesItem = t.TypeOf<typeof AstroDataSeriesItem>;

export const AstroData = t.type({
  product: t.literal('astro'),
  init: t.string,
  dataseries: t.readonlyArray(AstroDataSeriesItem), 
});
export type AstroData = t.TypeOf<typeof AstroData>;
export type AstroDataEncoded = t.OutputOf<typeof AstroData>;

export type AltitudeCorrectionValue = 0|2|7;
export const AltitudeCorrectionMap: Readonly<Record<AltitudeCorrectionValue, string>> = {
  [0]: '0 km',
  [2]: '2 km',
  [7]: '7 km',
};
export const AltitudeCorrection = t.keyof(AltitudeCorrectionMap);
export type AltitudeCorrection = t.TypeOf<typeof AltitudeCorrection>;

export const AstroQuery = t.union([
  t.type({
    lon: t.number,
    lat: t.number,
    unit: t.union([ t.literal('metric'), t.literal('british') ]),
    output: t.literal('json'),  // must be json for the API interface here
  }),
  t.partial({
    ac: t.union([AltitudeCorrection, t.undefined]),
    lang: t.literal('en'),  // not documented which languages are supported
    tzshift: t.Int,
  }),
]);
export type AstroQuery = t.TypeOf<typeof AstroQuery>;


type QueryRecord = Readonly<Record<string, string|number|undefined>>;

const getFromPathQuery = (path: string) => 
  (query: QueryRecord) => request.get(`${config.seven_timer.url}${path}`).query(query);

const fetchPathWithQueryTE = 
  <A,O>(responseCodec: t.Type<A,O,unknown>) =>
    (path: string) =>
      <AR, OR extends QueryRecord, IR>(requestCodec: t.Type<AR,OR,IR>): ((query: AR) => TE.TaskEither<Error, A>) => 
        flow(
          requestCodec.encode,
          tryCatchWithErrorTE(getFromPathQuery(path)),
          TE.chain(decodeTextOrErrorTE(responseCodec))
        );
    
export const fetchAstroTE: (q: AstroQuery) => TE.TaskEither<Error, AstroData> = fetchPathWithQueryTE(AstroData)(config.seven_timer.paths.astro)(AstroQuery);

const astroPathLens = Lens.fromPath<AstroDataSeriesItem>();
const astroPropLens = Lens.fromProp<AstroDataSeriesItem>();

export const averageWindSpeed = mode(astroPathLens([ 'wind10m', 'speed' ]));
export const averageTemperature = mean(astroPropLens('temp2m'));
export const averageHumidity = median(astroPropLens('rh2m'));
