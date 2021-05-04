import { History } from 'history';
import { AnyAction } from 'redux';
import { push } from '../src';
import { createRouterMiddleware } from '../src/middleware';

describe('RouterMiddleware', () => {
   it('create middleware without showHistoryAction', () => {
      const fakeHistory = ({
         push: jest.fn(() => {}),
      } as unknown) as History;

      const routerMiddleware = createRouterMiddleware({
         history: fakeHistory,
         showHistoryAction: false,
      });
      const fakeDispatch = jest.fn((action: AnyAction): void => {});
      // @ts-ignore
      routerMiddleware()(fakeDispatch)(push('/ciao'));
      expect(fakeDispatch).toHaveBeenCalledTimes(0);
      expect(fakeHistory.push).toHaveBeenCalledTimes(1);
      // @ts-ignore
      routerMiddleware()(fakeDispatch)({ type: 'anytype' });
      expect(fakeDispatch).toHaveBeenCalledTimes(1);
      expect(fakeHistory.push).toHaveBeenCalledTimes(1);
   });
   it('create middleware with showHistoryAction', () => {
      const fakeHistory = ({
         push: jest.fn(() => {}),
      } as unknown) as History;

      const routerMiddleware = createRouterMiddleware({
         history: fakeHistory,
         showHistoryAction: true,
      });
      const fakeDispatch = jest.fn((action: AnyAction): void => {});
      // @ts-ignore
      routerMiddleware()(fakeDispatch)(push('/ciao'));
      expect(fakeDispatch).toHaveBeenCalledTimes(1);
      expect(fakeHistory.push).toHaveBeenCalledTimes(1);
      // @ts-ignore
      routerMiddleware()(fakeDispatch)({ type: 'anytype' });
      expect(fakeDispatch).toHaveBeenCalledTimes(2);
      expect(fakeHistory.push).toHaveBeenCalledTimes(1);
   });
});
