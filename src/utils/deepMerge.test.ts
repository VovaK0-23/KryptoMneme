import { DeepPartial } from '@/types';

import { deepMerge } from './deepMerge';

describe('deepMerge', () => {
  it('should merge objects', () => {
    const target = {
      name: 'John',
      age: 25,
      address: {
        street: '123 Main St',
        city: 'City A',
      },
    };

    const source: DeepPartial<typeof target> = {
      age: 30,
      address: {
        city: 'City B',
      },
    };

    const result = deepMerge(target, source);

    expect(result).toEqual({
      name: 'John',
      age: 30,
      address: {
        street: '123 Main St',
        city: 'City B',
      },
    });
  });

  it('should replace arrays', () => {
    const target = {
      data: [1, 2, 3],
    };

    const source: DeepPartial<typeof target> = {
      data: [4, 5],
    };

    const result = deepMerge(target, source);

    expect(result).toEqual({
      data: [4, 5],
    });
  });

  it('should handle readonly arrays', () => {
    const target = {
      data: [1, 2, 3] as const,
    };

    const source: DeepPartial<typeof target> = {
      data: [1, 3],
    };

    const result = deepMerge(target, source);

    expect(result).toEqual({
      data: [1, 3],
    });
  });

  it('should merge nested objects', () => {
    const target = {
      user: {
        name: 'Alice',
        age: 28,
      },
    };

    const source: DeepPartial<typeof target> = {
      user: {
        age: 30,
      },
    };

    const result = deepMerge(target, source);

    expect(result).toEqual({
      user: {
        name: 'Alice',
        age: 30,
      },
    });
  });

  it('should handle complex nested objects', () => {
    const target = {
      user: {
        name: 'Alice',
        address: {
          city: 'City A',
          postalCode: '12345',
        },
      },
    };

    const source: DeepPartial<typeof target> = {
      user: {
        address: {
          city: 'City B',
        },
      },
    };

    const result = deepMerge(target, source);

    expect(result).toEqual({
      user: {
        name: 'Alice',
        address: {
          city: 'City B',
          postalCode: '12345',
        },
      },
    });
  });

  it('should handle deeply nested objects', () => {
    const target = {
      a: {
        b: {
          c: {
            d: [1],
          },
        },
      },
    };

    const source: DeepPartial<typeof target> = {
      a: {
        b: {
          c: {
            d: [2, 3],
          },
        },
      },
    };

    const result = deepMerge(target, source);

    expect(result).toEqual({
      a: {
        b: {
          c: {
            d: [2, 3],
          },
        },
      },
    });
  });

  it('should ignore undefined properties', () => {
    const target = {
      a: 1,
      b: null as null | number,
    };

    const source: DeepPartial<typeof target> = {
      a: undefined,
      b: 2,
    };

    const result = deepMerge(target, source);

    expect(result).toEqual({
      a: 1,
      b: 2,
    });
  });

  it('should merge null properties', () => {
    const target = {
      a: 1,
      b: 2 as null | number,
    };

    const source: DeepPartial<typeof target> = {
      b: null,
    };

    const result = deepMerge(target, source);

    expect(result).toEqual({
      a: 1,
      b: null,
    });
  });
});
