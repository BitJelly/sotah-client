import { connect, Dispatch } from 'react-redux';

import { App, StateProps, DispatchProps, OwnProps } from '../components/App';
import { StoreState, Region } from '../types';
import { FetchPing, FetchRegions, FetchRealms, Actions } from '../actions';

const mapStateToProps = (state: StoreState): StateProps => {
  const { fetchPingLevel, fetchRegionLevel, regions, currentRegion, fetchRealmLevel } = state;
  return { fetchPingLevel, fetchRegionLevel, regions, currentRegion, fetchRealmLevel };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
  return {
    onLoad: () => dispatch(FetchPing()),
    refreshRegions: () => dispatch(FetchRegions()),
    refreshRealms: (region: Region) => dispatch(FetchRealms(region))
  };
};

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(App);
