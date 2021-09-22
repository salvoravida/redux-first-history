/* eslint-disable @typescript-eslint/no-empty-function */
import { History } from 'history';
import { push, replace, go, goBack, goForward } from '../src';
import { createRouterMiddleware } from '../src/middleware';

describe('RouterMiddleware history v4', () => {
   describe('without showHistoryAction', () => {
      let routerMiddleware;
      let nextDispatch;
      let fakeHistory;

      beforeEach(() => {
         fakeHistory = {
            push: jest.fn(() => {}),
            replace: jest.fn(() => {}),
            go: jest.fn(() => {}),
            goBack: jest.fn(() => {}),
            goForward: jest.fn(() => {}),
         } as unknown as History;
         routerMiddleware = createRouterMiddleware({
            history: fakeHistory,
            showHistoryAction: false,
         });
         nextDispatch = jest.fn(() => {});
      });

      it('should handle push action', () => {
         routerMiddleware()(nextDispatch)(push('/path'));
         expect(nextDispatch).toHaveBeenCalledTimes(0);
         expect(fakeHistory.push).toHaveBeenCalledTimes(1);
      });

      it('should handle replace action', () => {
         routerMiddleware()(nextDispatch)(replace('/path'));
         expect(nextDispatch).toHaveBeenCalledTimes(0);
         expect(fakeHistory.replace).toHaveBeenCalledTimes(1);
      });

      it('should handle go action', () => {
         routerMiddleware()(nextDispatch)(go(1));
         expect(nextDispatch).toHaveBeenCalledTimes(0);
         expect(fakeHistory.go).toHaveBeenCalledTimes(1);
      });

      it('should handle goBack action', () => {
         routerMiddleware()(nextDispatch)(goBack());
         expect(nextDispatch).toHaveBeenCalledTimes(0);
         expect(fakeHistory.goBack).toHaveBeenCalledTimes(1);
      });

      it('should handle goForward action', () => {
         routerMiddleware()(nextDispatch)(goForward());
         expect(nextDispatch).toHaveBeenCalledTimes(0);
         expect(fakeHistory.goForward).toHaveBeenCalledTimes(1);
      });

      it('should ignore any other action', () => {
         routerMiddleware()(nextDispatch)({ type: 'anytype' });
         expect(nextDispatch).toHaveBeenCalledTimes(1);
         expect(fakeHistory.push).toHaveBeenCalledTimes(0);
         expect(fakeHistory.replace).toHaveBeenCalledTimes(0);
         expect(fakeHistory.go).toHaveBeenCalledTimes(0);
         expect(fakeHistory.goBack).toHaveBeenCalledTimes(0);
         expect(fakeHistory.goForward).toHaveBeenCalledTimes(0);
      });
   });

   describe('with showHistoryAction', () => {
      let routerMiddleware;
      let nextDispatch;
      let fakeHistory;

      beforeEach(() => {
         fakeHistory = {
            push: jest.fn(() => {}),
            replace: jest.fn(() => {}),
            go: jest.fn(() => {}),
            goBack: jest.fn(() => {}),
            goForward: jest.fn(() => {}),
         } as unknown as History;
         routerMiddleware = createRouterMiddleware({
            history: fakeHistory,
            showHistoryAction: true,
         });
         nextDispatch = jest.fn(() => {});
      });

      it('should handle push action', () => {
         routerMiddleware()(nextDispatch)(push('/path'));
         expect(nextDispatch).toHaveBeenCalledTimes(1);
         expect(fakeHistory.push).toHaveBeenCalledTimes(1);
      });

      it('should handle replace action', () => {
         routerMiddleware()(nextDispatch)(replace('/path'));
         expect(nextDispatch).toHaveBeenCalledTimes(1);
         expect(fakeHistory.replace).toHaveBeenCalledTimes(1);
      });

      it('should handle go action', () => {
         routerMiddleware()(nextDispatch)(go(1));
         expect(nextDispatch).toHaveBeenCalledTimes(1);
         expect(fakeHistory.go).toHaveBeenCalledTimes(1);
      });

      it('should handle goBack action', () => {
         routerMiddleware()(nextDispatch)(goBack());
         expect(nextDispatch).toHaveBeenCalledTimes(1);
         expect(fakeHistory.goBack).toHaveBeenCalledTimes(1);
      });

      it('should handle goForward action', () => {
         routerMiddleware()(nextDispatch)(goForward());
         expect(nextDispatch).toHaveBeenCalledTimes(1);
         expect(fakeHistory.goForward).toHaveBeenCalledTimes(1);
      });

      it('should ignore any other action', () => {
         routerMiddleware()(nextDispatch)({ type: 'anytype' });
         expect(nextDispatch).toHaveBeenCalledTimes(1);
         expect(fakeHistory.push).toHaveBeenCalledTimes(0);
         expect(fakeHistory.replace).toHaveBeenCalledTimes(0);
         expect(fakeHistory.go).toHaveBeenCalledTimes(0);
         expect(fakeHistory.goBack).toHaveBeenCalledTimes(0);
         expect(fakeHistory.goForward).toHaveBeenCalledTimes(0);
      });
   });
});

describe('RouterMiddleware history v5', () => {
   describe('without showHistoryAction', () => {
      let routerMiddleware;
      let nextDispatch;
      let fakeHistory;

      beforeEach(() => {
         fakeHistory = {
            push: jest.fn(() => {}),
            replace: jest.fn(() => {}),
            go: jest.fn(() => {}),
            back: jest.fn(() => {}),
            forward: jest.fn(() => {}),
         } as unknown as History;
         routerMiddleware = createRouterMiddleware({
            history: fakeHistory,
            showHistoryAction: false,
         });
         nextDispatch = jest.fn(() => {});
      });

      it('should handle push action', () => {
         routerMiddleware()(nextDispatch)(push('/path'));
         expect(nextDispatch).toHaveBeenCalledTimes(0);
         expect(fakeHistory.push).toHaveBeenCalledTimes(1);
      });

      it('should handle replace action', () => {
         routerMiddleware()(nextDispatch)(replace('/path'));
         expect(nextDispatch).toHaveBeenCalledTimes(0);
         expect(fakeHistory.replace).toHaveBeenCalledTimes(1);
      });

      it('should handle go action', () => {
         routerMiddleware()(nextDispatch)(go(1));
         expect(nextDispatch).toHaveBeenCalledTimes(0);
         expect(fakeHistory.go).toHaveBeenCalledTimes(1);
      });

      it('should handle goBack action', () => {
         routerMiddleware()(nextDispatch)(goBack());
         expect(nextDispatch).toHaveBeenCalledTimes(0);
         expect(fakeHistory.back).toHaveBeenCalledTimes(1);
      });

      it('should handle goForward action', () => {
         routerMiddleware()(nextDispatch)(goForward());
         expect(nextDispatch).toHaveBeenCalledTimes(0);
         expect(fakeHistory.forward).toHaveBeenCalledTimes(1);
      });

      it('should ignore any other action', () => {
         routerMiddleware()(nextDispatch)({ type: 'anytype' });
         expect(nextDispatch).toHaveBeenCalledTimes(1);
         expect(fakeHistory.push).toHaveBeenCalledTimes(0);
         expect(fakeHistory.replace).toHaveBeenCalledTimes(0);
         expect(fakeHistory.go).toHaveBeenCalledTimes(0);
         expect(fakeHistory.back).toHaveBeenCalledTimes(0);
         expect(fakeHistory.forward).toHaveBeenCalledTimes(0);
      });
   });

   describe('with showHistoryAction', () => {
      let routerMiddleware;
      let nextDispatch;
      let fakeHistory;

      beforeEach(() => {
         fakeHistory = {
            push: jest.fn(() => {}),
            replace: jest.fn(() => {}),
            go: jest.fn(() => {}),
            back: jest.fn(() => {}),
            forward: jest.fn(() => {}),
         } as unknown as History;
         routerMiddleware = createRouterMiddleware({
            history: fakeHistory,
            showHistoryAction: true,
         });
         nextDispatch = jest.fn(() => {});
      });

      it('should handle push action', () => {
         routerMiddleware()(nextDispatch)(push('/path'));
         expect(nextDispatch).toHaveBeenCalledTimes(1);
         expect(fakeHistory.push).toHaveBeenCalledTimes(1);
      });

      it('should handle replace action', () => {
         routerMiddleware()(nextDispatch)(replace('/path'));
         expect(nextDispatch).toHaveBeenCalledTimes(1);
         expect(fakeHistory.replace).toHaveBeenCalledTimes(1);
      });

      it('should handle go action', () => {
         routerMiddleware()(nextDispatch)(go(1));
         expect(nextDispatch).toHaveBeenCalledTimes(1);
         expect(fakeHistory.go).toHaveBeenCalledTimes(1);
      });

      it('should handle goBack action', () => {
         routerMiddleware()(nextDispatch)(goBack());
         expect(nextDispatch).toHaveBeenCalledTimes(1);
         expect(fakeHistory.back).toHaveBeenCalledTimes(1);
      });

      it('should handle goForward action', () => {
         routerMiddleware()(nextDispatch)(goForward());
         expect(nextDispatch).toHaveBeenCalledTimes(1);
         expect(fakeHistory.forward).toHaveBeenCalledTimes(1);
      });

      it('should ignore any other action', () => {
         routerMiddleware()(nextDispatch)({ type: 'anytype' });
         expect(nextDispatch).toHaveBeenCalledTimes(1);
         expect(fakeHistory.push).toHaveBeenCalledTimes(0);
         expect(fakeHistory.replace).toHaveBeenCalledTimes(0);
         expect(fakeHistory.go).toHaveBeenCalledTimes(0);
         expect(fakeHistory.back).toHaveBeenCalledTimes(0);
         expect(fakeHistory.forward).toHaveBeenCalledTimes(0);
      });
   });
});
