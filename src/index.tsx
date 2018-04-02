import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import App from './containers/App';
import { sotah } from './reducers';
import { StoreState, FetchPingLevel, FetchRegionLevel, FetchRealmLevel } from './types';
import registerServiceWorker from './registerServiceWorker';

const preloadedState: StoreState = {
  fetchPingLevel: FetchPingLevel.initial,
  fetchRegionLevel: FetchRegionLevel.initial,
  regions: {},
  currentRegion: null,
  fetchRealmLevel: FetchRealmLevel.initial,
  realms: {}
};
const store = createStore<StoreState>(sotah, preloadedState, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
