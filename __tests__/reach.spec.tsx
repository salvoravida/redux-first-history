/* eslint-disable react/jsx-indent */
import * as Reach from '@reach/router';
import React from 'react';
import { act, render } from '@testing-library/react';
import { createTestEnv } from './store';

describe('Reach Router', () => {
   it('should handle transition with history v4', () => {
      const { history: fakeHistory, reduxHistory, store, reachHistory } = createTestEnv();

      let spyListen;
      const listenCallback = jest.fn((location, action) => {
         spyListen = { location, action };
      });
      reduxHistory.listen(listenCallback);

      store.dispatch = jest.fn(store.dispatch);
      expect(store.dispatch).toHaveBeenCalledTimes(0);

      const Home = ({ path }: { path?: string }) => <p>Home {path}</p>;
      const Dashboard = ({ path }: { path?: string }) => <p>Dashboard {path}</p>;

      const App = () => (
         <Reach.LocationProvider history={reachHistory}>
            <>
               <Reach.Router>
                  <Home path="/" />
                  <Dashboard path="dashboard" />
               </Reach.Router>
            </>
         </Reach.LocationProvider>
      );
      act(() => {
         fakeHistory.push('/');
      });
      const { container } = render(<App />);

      expect(container.querySelector('p')?.innerHTML).toEqual('Home');
      act(() => {
         fakeHistory.push('/dashboard');
      });
      expect(spyListen.location.pathname).toEqual('/dashboard');
      expect(reduxHistory.listenObject).toBe(false);
   });

   it('should handle transition with history v5', () => {
      const { history: fakeHistory, reduxHistory, store, reachHistory } = createTestEnv({}, true);

      let spyListen;
      const listenCallback = jest.fn(({ location, action }) => {
         spyListen = { location, action };
      });
      reduxHistory.listen(listenCallback);

      store.dispatch = jest.fn(store.dispatch);
      expect(store.dispatch).toHaveBeenCalledTimes(0);

      const Home = ({ path }: { path?: string }) => <p>Home {path}</p>;
      const Dashboard = ({ path }: { path?: string }) => <p>Dashboard {path}</p>;

      const App = () => (
         <Reach.LocationProvider history={reachHistory}>
            <>
               <Reach.Router>
                  <Home path="/" />
                  <Dashboard path="dashboard" />
               </Reach.Router>
            </>
         </Reach.LocationProvider>
      );
      act(() => {
         fakeHistory.push('/');
      });
      const { container } = render(<App />);

      expect(container.querySelector('p')?.innerHTML).toEqual('Home');
      act(() => {
         fakeHistory.push('/dashboard');
      });
      expect(spyListen.location.pathname).toEqual('/dashboard');
      expect(reduxHistory.listenObject).toBe(true);
   });
});
