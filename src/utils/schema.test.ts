import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as t from 'io-ts';

import { decodeOrErrorC } from './schema';

describe('utils/schema', () => {

  const TestCodec = t.type({
    foo: t.string,
    bar: t.number,
  });
  type TestCodec = t.TypeOf<typeof TestCodec>;

  it('decodeOrErrorC right', () => {
    const { foo, bar } = pipe(
      {
        foo: 'Foo', 
        bar: 123,
      },
      decodeOrErrorC(TestCodec),
      E.getOrElseW( (e) => { throw e; } ),
    );
    expect(foo).toEqual('Foo');
    expect(bar).toEqual(123);
  });

  it('decodeOrErrorC left', () => {
    expect(E.isLeft(decodeOrErrorC(TestCodec)({ dog: 'puppy' }))).toBeTruthy();
  });

});

