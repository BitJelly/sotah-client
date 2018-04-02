import { connect, Dispatch } from 'react-redux';

import { App, StateProps, DispatchProps, OwnProps } from '../components/App';
import { StoreState, Region } from '../types';
import { SotahClientAction, FetchPing, FetchRegions, FetchRealms } from '../actions';

const mapStateToProps = (state: StoreState): StateProps => {
  const { appLevel, regions, currentRegion } = state;
  return { appLevel, regions, currentRegion };
};

const mapDispatchToProps = (dispatch: Dispatch<SotahClientAction>): DispatchProps => {
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
