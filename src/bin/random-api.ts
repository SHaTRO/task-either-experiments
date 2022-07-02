import { randomInt } from 'crypto';
import { flow, pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import * as apis from '../apis/external/public-api';

async function main(..._args: string[]): Promise<void> {
  const randomEntry = await pipe(
    apis.fetchEntriesTE,
    TE.map(
      flow(
        results => results.entries,
        entries => entries[randomInt(entries.length)]
      )
    )
  )();
  console.log('Random entry', randomEntry);
}

main().catch(e => { throw e });
