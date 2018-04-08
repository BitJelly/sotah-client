import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { FetchPingLevel, FetchRegionLevel, Region, FetchRealmLevel } from '../types';
import Topbar from '../route-containers/App/Topbar';
import { Content } from './App/Content';

import './App.scss';

export type StateProps = {
  fetchPingLevel: FetchPingLevel
  fetchRegionLevel: FetchRegionLevel
  fetchRealmLevel: FetchRealmLevel
  currentRegion: Region | null
};

export type DispatchProps = {
  onLoad: () => void
  refreshRegions: () => void
  refreshRealms: (region: Region) => void
};

export interface OwnProps extends RouteComponentProps<{}> {}

export type Props = Readonly<StateProps & DispatchProps & OwnProps>;

export class App extends React.Component<Props> {
  componentDidMount() {
    this.props.onLoad();
  }

  didRegionChange(prevRegion: Region | null, currentRegion: Region): boolean {
    if (prevRegion === null) {
      return true;
    }

    if (prevRegion.name === currentRegion.name) {
      return false;
    }

    return true;
  }

  componentDidUpdate(prevProps: Props) {
    const { fetchPingLevel, fetchRegionLevel, fetchRealmLevel, currentRegion } = this.props;

    if (fetchPingLevel === FetchPingLevel.success && fetchRegionLevel === FetchRegionLevel.initial) {
      this.props.refreshRegions();

      return;
    }

    if (currentRegion !== null) {
      const shouldRefreshRealms = fetchRealmLevel === FetchRealmLevel.initial
        || fetchRealmLevel === FetchRealmLevel.success
          && this.didRegionChange(prevProps.currentRegion, currentRegion);
      if (shouldRefreshRealms) {
        this.props.refreshRealms(currentRegion);

        return;
      }
    }
  }

  renderConnected() {
    return (
      <div id="app">
        <Topbar/>
        <Content/>
      </div>
    );
  }

  render() {
    const { fetchPingLevel } = this.props;
    switch (fetchPingLevel) {
      case FetchPingLevel.initial:
        return <>Welcome!</>;
      case FetchPingLevel.fetching:
        return <>Connecting...</>;
      case FetchPingLevel.failure:
        return <>Could not connect!</>;
      case FetchPingLevel.success:
        return this.renderConnected();
      default:
        return <>You should never see this!</>;
    }
  }
}
