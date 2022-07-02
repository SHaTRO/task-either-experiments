import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import nock from 'nock';
import { AstroData, averageHumidity, averageTemperature, averageWindSpeed, fetchAstroTE } from './7timer-api';
import { readFileSync } from 'fs';
import * as path from 'path';

import { config } from '../../../src/config';

describe('7Timer! API', () => {
  beforeEach(
    () => { jest.resetModules(); }
  );

  
  function fetchAstroData(): Promise<AstroData> {
    const contents = JSON.parse(readFileSync(path.resolve(__dirname, '../../../fixtures/7timer-astro.json'), 'utf-8'));
    nock(config.seven_timer.url)
      .get(config.seven_timer.paths.astro)
      .query(true)
      .reply(200, contents);
    return pipe(
      fetchAstroTE({
        lat: 41,
        lon: -121,
        unit: 'british',
        output: 'json',
      }),
      TE.getOrElse((e) => { throw e }),
    )();
  }
      

  it('Fetching ASTRO data', async () => {
    const result = await fetchAstroData();
    expect(result).toBeTruthy();
  });
  
  it('Averaging fetched ASTRO data', async () => {
    const result = await fetchAstroData();
    const avgWindSpeed = averageWindSpeed(result.dataseries);
    expect(avgWindSpeed).toEqual([2]);
    const avgTemp = averageTemperature(result.dataseries);
    expect(avgTemp).toEqual(68.875);
    const avgHumidity = averageHumidity(result.dataseries);
    expect(avgHumidity).toEqual(1);
  });

});
