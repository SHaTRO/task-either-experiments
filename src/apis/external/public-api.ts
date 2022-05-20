import * as t from 'io-ts';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { PositiveInt } from 'io-ts-numbers';
import request from 'superagent';
import { decodeBodyOrErrorTE, tryCatchWithErrorTE } from '../../utils/taskeither';

import { config } from '../../config';


/** Codec & Type for Entry at public-apis */
export const PublicEntry = t.type({
  API: t.string,
  Description: t.string,
  Auth: t.string,
  HTTPS: t.boolean,
  Cors: t.string,
  Link: t.string,
  Category: t.string,
});
export type PublicEntry = t.TypeOf<typeof PublicEntry>;

/** Codec & Type for Entries at public-apis */
export const PublicEntries = t.type({
  count: PositiveInt,
  entries: t.readonlyArray(PublicEntry),
});
export type PublicEntries = t.TypeOf<typeof PublicEntries>;

/** Codec & Type for Categories at public-apis */
export const PublicCategories = t.type({
  count: PositiveInt,
  categories: t.readonlyArray(t.string),
});
export type PublicCategories = t.TypeOf<typeof PublicCategories>;

export const SearchRequest = t.type({
  title: t.string,
  description: t.string,
  auth: t.string,
  https: t.string,
  cors: t.string,
  category: t.string
});
export type SearchRequest = t.TypeOf<typeof SearchRequest>;

// functions

const getFromPathLambda = (path: string) => () => request.get(`${config.public_apis.url}${path}`);
const fetchPathTE = (path: string) => <A,O,I>(codec: t.Type<A,O,I>) => (): TE.TaskEither<Error, A> => pipe(
  tryCatchWithErrorTE( getFromPathLambda(path) ),
  TE.chain( decodeBodyOrErrorTE(codec) ) 
);

/** function to fetch the categories */
export const fetchCategoriesTE: () => TE.TaskEither<Error, PublicCategories> = fetchPathTE(config.public_apis.paths.categories)(PublicCategories);

/** function to fetch the entries */
export const fetchEntriesTE: () => TE.TaskEither<Error, PublicEntries> = fetchPathTE(config.public_apis.paths.entries)(PublicEntries);
