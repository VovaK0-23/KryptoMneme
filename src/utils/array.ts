// Returns the element at the same index as the input element,
// but counting from the opposite end of the array.
// Example:
// arr = [1, 2, 3, 4]
// elem = 1 (index = 0) returns 4 (index = 3 but from the end of array 0)
// elem = 3 returns 2
export const findOppositeElement = <T>(elem: T, arr: T[]) =>
  [...arr].reverse()[arr.findIndex((n) => n == elem)];
