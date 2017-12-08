const expect = require('expect');
const {isRealString} = require('./validation');

describe('isRealString', () => {
    it('should return false on data types other then string', () => {
        var result = isRealString(32);
        expect(result).toBe(false);
    });

    it('should return false on invalid string', () => {
        var result = isRealString('   ');
        expect(result).toBe(false);
    });

    it('should return true on valid string', () => {
        var result = isRealString(' Balaji S ');
        expect(result).toBe(true);
    });
});