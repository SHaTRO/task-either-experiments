import { identity, pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { decodeOrErrorC } from '../../utils/schema';
import { AstroData, AstroQuery, fetchAstroTE } from './7timer-api';

describe('7Timer! API', () => {
  beforeEach(
    () => { jest.resetModules(); }
  );

  it('Fetching ASTRO data', async () => {
    const result = await fetchAstroTE({
      lat: 41,
      lon: -121,
      unit: 'british',
      output: 'json',
    })();
    console.log('result: ', result);
    expect(result).toBeTruthy();
  });

});
