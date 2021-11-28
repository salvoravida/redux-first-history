import { createMatchSelector } from '../index';

describe('react-router function', () => {
    const getFakeState = (key: string = 'router') => ({
        [key]: {
            location: {
                pathname: '/just/svv123/test/nrj123'
            }
        }
    } as any);
    const expectedOutput = {
        isExact: true,
        params: {
            idOne: 'svv123',
            idTwo: 'nrj123',
        },
        path: '/just/:idOne/test/:idTwo',
        url: '/just/svv123/test/nrj123'
    };
    it('createMatchSelector return matching object when options not passed', () => {
        const fakeState = getFakeState();
        const matchingFunction = createMatchSelector('/just/:idOne/test/:idTwo');
        const matchingObject = matchingFunction(fakeState);
        expect(matchingObject).toEqual(expectedOutput);
    });
    it('createMatchSelector return matching object when selectRouterState function passed', () => {
        const selectRouterState = (state: any) => state.ownrouterkey;
        const fakeState = getFakeState('ownrouterkey');
        const matchingFunction = createMatchSelector('/just/:idOne/test/:idTwo', { selectRouterState });
        const matchingObject = matchingFunction(fakeState);
        expect(matchingObject).toEqual(expectedOutput);
    });
    it('createMatchSelector return matching object when routerReducerKey passed', () => {
        const routerReducerKey = 'ownrouterkey';
        const fakeState = getFakeState(routerReducerKey);
        const matchingFunction = createMatchSelector('/just/:idOne/test/:idTwo', { routerReducerKey });
        const matchingObject = matchingFunction(fakeState);
        expect(matchingObject).toEqual(expectedOutput);
    });
    it('createMatchSelector return matching object when empty object passed', () => {
        const fakeState = getFakeState();
        const matchingFunction = createMatchSelector('/just/:idOne/test/:idTwo', {});
        const matchingObject = matchingFunction(fakeState);
        expect(matchingObject).toEqual(expectedOutput);
    });
});
