import { fetchCategoriesTE, fetchEntriesTE } from "./public-api";
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

describe('Public APIs Database', () => {

  it('fetch categories', async () => {
    const { count, categories } = pipe(
      await fetchCategoriesTE(),
      E.getOrElseW( (e) => { throw e }),
    );
    expect(count).toBeGreaterThan(0);
    expect(categories).toBeTruthy();
    expect(Array.isArray(categories)).toBeTruthy();
  });

  it('fetch entries', async () => {
    const { count, entries } = pipe(
      await fetchEntriesTE(),
      E.getOrElseW( (e) => { throw e }),
    );
    expect(count).toBeGreaterThan(0);
    expect(entries).toBeTruthy();
    expect(Array.isArray(entries)).toBeTruthy();
  });

});

