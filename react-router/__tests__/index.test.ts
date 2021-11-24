import { createMatchSelector } from '../index';

describe('react-router function', () => {
    const fakeState = {
        router: {
            location: {
                pathname: '/just/svv123/test/nrj123'
            }
        }
    };
    it('createMatchSelector return matching object', () => {
        const expectedOutput = {
            isExact: true,
            params: {
                idOne: 'svv123',
                idTwo: 'nrj123',
            },
            path: '/just/:idOne/test/:idTwo',
            url: '/just/svv123/test/nrj123'
        };
        const matchingFunction = createMatchSelector('/just/:idOne/test/:idTwo');
        const matchingObject = matchingFunction(fakeState);
        expect(matchingObject).toEqual(expectedOutput);
    });
});
