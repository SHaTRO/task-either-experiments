import { Lens } from 'monocle-ts';
import { mean, median, mode } from './averages';

describe('averages', () => {

  type TestObj = { a: number, b: number };
  const lensB = Lens.fromProp<TestObj>()('b');

  describe('mean', () => {

    it('1 value', () => {
      const list: TestObj[] = [
        { a: 0, b: 5 },
      ];
      expect(mean(lensB)(list)).toEqual(5);
    });

    it('2 values', () => {
      const list: TestObj[] = [
        { a: 0, b: 5 },
        { a: 1, b: 7 },
      ];
      expect(mean(lensB)(list)).toEqual(6);
    });

    it('3 equal values', () => {
      const list: TestObj[] = [
        { a: 0, b: 2 },
        { a: 1, b: 2 },
        { a: 2, b: 2 },
      ];
      expect(mean(lensB)(list)).toEqual(2);
    });

    it('4 unequal values', () => {
      const list: TestObj[] = [
        { a: 0, b: 1 },
        { a: 0, b: 2 },
        { a: 0, b: 3 },
        { a: 0, b: 4 },
      ];
      expect(mean(lensB)(list)).toEqual(2.5);
    });
    
    it('no values', () => {
      const list: TestObj[] = [];
      expect(mean(lensB)(list)).toEqual(undefined);
    });

  });
  
  describe('median', () => {

    it('1 value', () => {
      const list: TestObj[] = [
        { a: 0, b: 5 },
      ];
      expect(median(lensB)(list)).toEqual(5);
    });

    it('2 values', () => {
      const list: TestObj[] = [
        { a: 0, b: 5 },
        { a: 1, b: 7 },
      ];
      expect(median(lensB)(list)).toEqual(6);
    });

    it('3 equal values', () => {
      const list: TestObj[] = [
        { a: 0, b: 2 },
        { a: 1, b: 2 },
        { a: 2, b: 2 },
      ];
      expect(median(lensB)(list)).toEqual(2);
    });

    it('4 unequal unsorted values', () => {
      const list: TestObj[] = [
        { a: 0, b: 4 },
        { a: 0, b: 1 },
        { a: 0, b: 3 },
        { a: 0, b: 4 },
      ];
      expect(median(lensB)(list)).toEqual(3.5);
    });
    
    it('no values', () => {
      const list: TestObj[] = [];
      expect(median(lensB)(list)).toEqual(undefined);
    });

  });

  describe('mode', () => {

    it('1 value', () => {
      const list: TestObj[] = [
        { a: 0, b: 5 },
      ];
      expect(mode(lensB)(list)).toEqual([5]);
    });

    it('2 values', () => {
      const list: TestObj[] = [
        { a: 0, b: 5 },
        { a: 1, b: 7 },
      ];
      expect(mode(lensB)(list)).toEqual([5, 7]);
    });

    it('3 equal values', () => {
      const list: TestObj[] = [
        { a: 0, b: 2 },
        { a: 1, b: 2 },
        { a: 2, b: 2 },
      ];
      expect(mode(lensB)(list)).toEqual([2]);
    });

    it('4 unequal unsorted values', () => {
      const list: TestObj[] = [
        { a: 0, b: 4 },
        { a: 0, b: 1 },
        { a: 0, b: 3 },
        { a: 0, b: 4 },
      ];
      expect(mode(lensB)(list)).toEqual([4]);
    });
    
    it('no values', () => {
      const list: TestObj[] = [];
      expect(mode(lensB)(list)).toEqual(undefined);
    });
    
  });

});
