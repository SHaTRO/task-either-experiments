import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import { formatValidationErrors } from 'io-ts-reporters';
import { flow, pipe } from 'fp-ts/function';

// primitive versions of decode wrappers
export const decodeOrErrorC = <A,O,I>(codec: t.Type<A,O,I>) => (data: I): E.Either<Error, A> => pipe(
  data,
  codec.decode,
  E.mapLeft(
    flow(
      formatValidationErrors,
      E.toError
    )
  )
);