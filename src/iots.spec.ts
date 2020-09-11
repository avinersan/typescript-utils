import * as iots from './iots';
import { isRight, isLeft } from 'fp-ts/lib/Either';
import assert from 'assert';
import { string } from 'io-ts';

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

  describe('partialNull', () => {
    const ioType = iots.partialOrNull(
      {
        one: string,
        two: string,
      }
      , 'TestEnum',
    );

    [
      [{ one: '1', two: null }],
      [{ one: '1', two: undefined }],
      [{ one: '1', two: undefined }],
      [{}],
      [{ one: '1' }]
    ].forEach(([input]) => {
      it(`should decode input ${JSON.stringify(input)} and output strict equals input.`, () => {
        const res = ioType.decode(input);

        assert(isRight(res));
        expect(res.right).toStrictEqual(input);
      });
    });
  });

});
