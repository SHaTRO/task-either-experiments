import { fetchCategoriesTE, fetchEntriesTE } from './public-api';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import nock from 'nock';
import { readFileSync } from 'fs';
import * as path from 'path';

import { config } from '../../config';


describe('Public APIs Database', () => {

  it('fetch categories', async () => {
    const contents = JSON.parse(readFileSync(path.resolve(__dirname, '../../../fixtures/public-api-categories.txt'), 'utf-8'));
    nock(config.public_apis.url)
      .get(config.public_apis.paths.categories)
      .reply(200, contents);
    const { count, categories } = pipe(
      await fetchCategoriesTE(),
      E.getOrElseW( (e) => { throw e; }),
    );
    expect(count).toBeGreaterThan(0);
    expect(categories).toBeTruthy();
    expect(Array.isArray(categories)).toBeTruthy();
  });

  it('fetch entries', async () => {
    const contents = JSON.parse(readFileSync(path.resolve(__dirname, '../../../fixtures/public-api-entries.txt'), 'utf-8'));
    nock(config.public_apis.url)
      .get(config.public_apis.paths.entries)
      .reply(200, contents);
    const { count, entries } = pipe(
      await fetchEntriesTE(),
      E.getOrElseW( (e) => { throw e; }),
    );
    expect(count).toBeGreaterThan(0);
    expect(entries).toBeTruthy();
    expect(Array.isArray(entries)).toBeTruthy();
  });

});

