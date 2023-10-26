import { findOppositeElement } from '@/utils/array';

describe('findOppositeElement', () => {
  it('should return the opposite element from the end of the array', () => {
    const arr = [1, 2, 3, 4, 5];

    expect(findOppositeElement(1, arr)).toBe(5);
    expect(findOppositeElement(3, arr)).toBe(3);
    expect(findOppositeElement(5, arr)).toBe(1);
  });

  it('should return undefined if the element is not found in the array or array is empty', () => {
    const arr = [1, 2, 3, 4, 5];

    expect(findOppositeElement(6, arr)).toBe(undefined);
    expect(findOppositeElement(5, [])).toBe(undefined);
  });

  it('should return the same element for an array with a single element', () => {
    const arr = [1];

    expect(findOppositeElement(1, arr)).toBe(1);
  });
});
