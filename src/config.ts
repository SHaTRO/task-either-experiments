import rawConfig from 'config';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { decodeOrErrorC } from './utils/schema';

export const PublicApisConfig = t.type({
  url: t.string,
  paths: t.type({
    categories: t.string,
    entries: t.string,
  }),
});
export type PublicApisConfig = t.Type<typeof PublicApisConfig>;

const SevenTimerApps = {
  astro: 'ASTRO',
};
export const SevenTimerApisConfig = t.type({
  url: t.string,
  paths: t.record(t.keyof(SevenTimerApps), t.string),
});
export type SevenTimerApisConfig = t.Type<typeof SevenTimerApisConfig>;

const BaseConfig = t.type({
  full_name: t.string,
  public_apis: PublicApisConfig,
  seven_timer: SevenTimerApisConfig
});

export const config = pipe(
  rawConfig,
  decodeOrErrorC(BaseConfig),
  E.getOrElseW((e) => { throw e; })
);
