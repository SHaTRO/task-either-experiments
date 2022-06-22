import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import nock from 'nock';
import { fetchAstroTE } from './7timer-api';
import { readFileSync } from 'fs';
import * as path from 'path';

import { config } from '../../../src/config';

describe('7Timer! API', () => {
  beforeEach(
    () => { jest.resetModules(); }
  );

  it('Fetching ASTRO data', async () => {
    const contents = JSON.parse(readFileSync(path.resolve(__dirname, '../../../fixtures/7timer-astro.json'), 'utf-8'));
    nock(config.seven_timer.url)
      .get(config.seven_timer.paths.astro)
      .query(true)
      .reply(200, contents);
    const result = await pipe(
      fetchAstroTE({
        lat: 41,
        lon: -121,
        unit: 'british',
        output: 'json',
      }),
      TE.getOrElseW((e) => { throw e }),
    )();
    expect(result).toBeTruthy();
  });

});
