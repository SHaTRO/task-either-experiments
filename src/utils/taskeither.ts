import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { Response } from 'superagent';
import { flow } from 'fp-ts/function';
import * as Json from 'fp-ts/Json';
import { decodeOrErrorC } from './schema';

export const tryCatchWithErrorTE = <A,B>(fn: (a: A) => Promise<B>) => TE.tryCatchK(fn, E.toError);

export const decodeBodyOrErrorTE = <A,O,I>(codec: t.Type<A,O,I>) => flow(
  (resp: Response) => resp.body,
  (body) => { console.log('body: ', body); return body; },
  TE.fromEitherK(decodeOrErrorC(codec))
);

export const decodeTextOrErrorTE = <A,O>(codec: t.Type<A,O,unknown>) => flow(
  (resp: Response) => resp.text,
  Json.parse,
  E.mapLeft(E.toError),
  TE.fromEitherK(E.chain(decodeOrErrorC(codec))),
);
