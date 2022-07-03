import { flow, identity, pipe } from 'fp-ts/function';
import * as N from 'fp-ts/number';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNA from 'fp-ts/ReadonlyNonEmptyArray';
import { Lens } from 'monocle-ts';
import { match } from 'ts-pattern';
import { fromCompare } from 'fp-ts/lib/Ord';
import { fromEquals } from 'fp-ts/lib/Eq';

/** meanN takes a readonly array of numbers (N extends number) and returns Option<N> */
const meanN = <N extends number>(as: readonly N[]) => pipe(
  as,
  RNA.fromReadonlyArray,
  O.map(
    flow(
      RNA.reduce(0, (b, a: N) => b + a),
      (sum) => sum / as.length,
    )
  )
);

/**
 * Given a lens, the mean function returns the mean average of that property in a list of objects.
 * @param lens 
 * @returns number mean of the lensed values
 */
export const mean = <S, A extends number>(lens: Lens<S, A>) => (as: readonly S[]): number|undefined => 
  pipe(
    as,
    RA.map(lens.get),
    meanN,
    O.match(
      () => undefined,
      identity,
    )
  );

const isZero = (n: number) => n === 0;
const isEven = (n: number) => n % 2 === 0;

/**
 * Given a lens, the median function returns the median average of that property in a list of objects.
 * @param lens 
 * @returns number median of the lensed values
 */
export const median = <S, A extends number>(lens: Lens<S, A>) => (as: readonly S[]): number|undefined => {
  const result = pipe(
    as,
    RA.map(lens.get),
    RA.sort(N.Ord),
    RA.splitAt(as.length/2),
    (a) => match(as.length)
      .when(isZero, () => O.none)
      .when(isEven, () => meanN(RA.compact([ RA.last(a[0]), RA.head(a[1]) ])))
      .otherwise( () => meanN(RA.compact([ RA.head(a[1]) ]))
    ),
    O.match(
      () => undefined,
      identity
    )
  );
  return result;
}


type freqTuple = [ string, number ];

const freqTupleOrd = fromCompare((a: freqTuple, b: freqTuple) => N.Ord.compare(a[1], b[1]));
const freqEq = fromEquals((a: freqTuple, b: freqTuple) => N.Eq.equals(a[1], b[1]));
const freqTupleToNumber = (n: freqTuple) => Number.parseFloat(n[0]);

export const mode = <S, A extends number>(lens: Lens<S, A>) => (as: readonly S[]): number[]|undefined => pipe(
    as,
    RA.map(lens.get),
    (ras: readonly A[]) => R.fromFoldableMap({ concat: (a: number, b: number) => a + b }, RA.Foldable)(ras, (a) => [ `${a}`, 1 ]),
    R.toEntries,
    RNA.fromArray,
    O.match(
      () => undefined,
      flow(
        RNA.sort( freqTupleOrd ),
        RNA.reverse,
        RNA.group( freqEq ),
        (a) => a[0],      // get the first group (RNA.head does NOT work here?!?!)
        RNA.map(freqTupleToNumber),   // map to their original numbers
        RNA.sort(N.Ord),  // order for response 
        (a) => [ ...a ],  // convert to number array
      )
    )
  );
