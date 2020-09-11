import * as iots from './iots';
import { isRight, isLeft } from 'fp-ts/lib/Either';
import assert from 'assert';

describe('iots', () => {
  describe('stringEnum', () => {
    enum TestEnum {
      a = '1',
      b = '2',
    }
    const enumType = iots.stringEnum(TestEnum, 'TestEnum');

    it('should correctly decode enum value "1" to a', () => {
      const res = enumType.decode('1');

      assert(isRight(res));
      assert(res.right === TestEnum.a);
    });

    it('should fail decode a number', () => {
      const res = enumType.decode(1);

      assert(isLeft(res));
    });

    it('should fail decode for value "10"', () => {
      const res = enumType.decode('10');

      assert(isLeft(res));
    });
  });
});
