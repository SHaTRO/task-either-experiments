import rawConfig from 'config';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

export const PublicApisConfig = t.type({
  url: t.string,
  paths: t.type({
    categories: t.string,
    entries: t.string,
  }),
});
export type PublicApisConfig = t.Type<typeof PublicApisConfig>;

const BaseConfig = t.type({
  full_name: t.string,
  public_apis: PublicApisConfig
});

export const config = pipe(
  rawConfig,
  BaseConfig.decode,
  E.getOrElseW((e) => { throw E.toError(e); })
);
