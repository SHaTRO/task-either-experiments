import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { Response } from 'superagent';
import { flow, Lazy } from 'fp-ts/function';
import { decodeOrErrorC } from './schema';

export const tryCatchWithErrorTE = <A,B>(fn: (a: A) => Promise<B>) => TE.tryCatchK(fn, E.toError);

export const decodeBodyOrErrorTE = <A,O,I>(codec: t.Type<A,O,I>) => flow(
  (resp: Response) => resp.body,
  TE.fromEitherK(decodeOrErrorC(codec))
);
