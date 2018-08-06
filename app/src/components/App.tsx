import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Intent } from '@blueprintjs/core';

import { Region, Realm, UserPreferences, Profile } from '@app/types/global';
import {
  FetchPingLevel,
  FetchRegionLevel,
  FetchRealmLevel,
  AuthLevel,
  FetchUserPreferencesLevel
} from '@app/types/main';
import Topbar from '@app/route-containers/App/Topbar';
import { Content } from '@app/components/App/Content';
import { didRegionChange } from '@app/util';
import { AppToaster } from '@app/util/toasters';

import './App.scss';

export type StateProps = {
  fetchPingLevel: FetchPingLevel
  fetchRegionLevel: FetchRegionLevel
  currentRegion: Region | null
  fetchRealmLevel: FetchRealmLevel
  currentRealm: Realm | null
  preloadedToken: string
  authLevel: AuthLevel
  isLoginDialogOpen: boolean
  fetchUserPreferencesLevel: FetchUserPreferencesLevel
  userPreferences: UserPreferences | null
  profile: Profile | null
};

export type DispatchProps = {
  onLoad: () => void
  reloadUser: (token: string) => void
  refreshRegions: () => void
  refreshRealms: (region: Region) => void
  changeIsLoginDialogOpen: (isLoginDialogOpen: boolean) => void
  loadUserPreferences: (token: string) => void
  changeAuthLevel: (authLevel: AuthLevel) => void
};

export interface OwnProps extends RouteComponentProps<{}> {}

export type Props = Readonly<StateProps & DispatchProps & OwnProps>;

type State = Readonly<{
  regionToastKey: string
}>;

export class App extends React.Component<Props, State> {
  state: State = {
    regionToastKey: ''
  };

  didHandleUnauth: boolean = false;

  componentDidMount() {
    const { onLoad, preloadedToken, reloadUser, changeAuthLevel } = this.props;

    onLoad();

    if (preloadedToken.length === 0) {
      changeAuthLevel(AuthLevel.unauthenticated);
    } else {
      reloadUser(preloadedToken);
    }
  }

  handleUnauth(prevProps: Props) {
    const {
      isLoginDialogOpen,
      changeIsLoginDialogOpen,
      currentRegion,
      fetchRealmLevel,
      refreshRealms,
      fetchRegionLevel,
      preloadedToken
    } = this.props;

    if (preloadedToken.length > 0 && this.didHandleUnauth === false) {
      if (fetchRegionLevel === FetchRegionLevel.success) {
        this.didHandleUnauth = true;

        AppToaster.show({
          message: 'Your session has expired.',
          intent: Intent.WARNING,
          icon: 'info-sign',
          action: {
            text: 'Login',
            intent: Intent.PRIMARY,
            icon: 'log-in',
            onClick: () => changeIsLoginDialogOpen(!isLoginDialogOpen)
          }
        });
      }
    }

    if (currentRegion !== null) {
      switch (fetchRealmLevel) {
        case FetchRealmLevel.initial:
        case FetchRealmLevel.prompted:
          refreshRealms(currentRegion);

          break;
        case FetchRealmLevel.success:
          if (didRegionChange(prevProps.currentRegion, currentRegion)) {
            refreshRealms(currentRegion);
          }

          break;
        default:
          break;
      }
    }
  }

  handleAuth(prevProps: Props) {
    const {
      fetchUserPreferencesLevel,
      loadUserPreferences,
      profile,
      userPreferences,
      currentRegion,
      fetchRealmLevel,
      refreshRealms,
      authLevel
    } = this.props;

    if (prevProps.authLevel !== authLevel) {
      const hasBeenAuthorized = [AuthLevel.unauthenticated, AuthLevel.initial].indexOf(prevProps.authLevel) > -1;
      if (hasBeenAuthorized) {
        AppToaster.show({
          message: 'You are logged in.',
          intent: Intent.SUCCESS,
          icon: 'user'
        });
    
        if (fetchUserPreferencesLevel === FetchUserPreferencesLevel.initial) {
          loadUserPreferences(profile!.token);
        }
      }
    }

    if (prevProps.fetchUserPreferencesLevel !== fetchUserPreferencesLevel) {
      switch (fetchUserPreferencesLevel) {
        case FetchUserPreferencesLevel.failure:
          AppToaster.show({
            message: 'There was an error loading your preferences.',
            intent: Intent.WARNING,
            icon: 'user'
          });
  
          break;
        case FetchUserPreferencesLevel.success:
          if (userPreferences === null) {
            AppToaster.show({
              message: 'You have no preferences.',
              intent: Intent.WARNING,
              icon: 'user'
            });
  
            break;
          }
  
          break;
        default:
          break;
      }
    }

    if (currentRegion !== null) {
      switch (fetchRealmLevel) {
        case FetchRealmLevel.prompted:
          refreshRealms(currentRegion);

          break;
        case FetchRealmLevel.success:
          if (didRegionChange(prevProps.currentRegion, currentRegion)) {
            refreshRealms(currentRegion);
          }

          break;
        default:
          break;
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {
      fetchPingLevel,
      fetchRegionLevel,
      refreshRegions,
      authLevel
    } = this.props;
    const { regionToastKey } = this.state;

    switch (authLevel) {
      case AuthLevel.unauthenticated:
        this.handleUnauth(prevProps);

        break;
      case AuthLevel.authenticated:
        this.handleAuth(prevProps);

        break;
      default:
        break;
    }

    switch (fetchPingLevel) {
      case FetchPingLevel.success:
        switch (fetchRegionLevel) {
          case FetchRegionLevel.initial:
            if (authLevel === AuthLevel.unauthenticated) {
              const initialToastKey = AppToaster.show({
                message: 'Loading regions.',
                intent: Intent.NONE,
                icon: 'info-sign'
              });
              this.setState({ regionToastKey: initialToastKey });

              refreshRegions();
            }

            break;
          case FetchRegionLevel.prompted:
            const promptedToastKey = AppToaster.show({
              message: 'Loading regions.',
              intent: Intent.NONE,
              icon: 'info-sign'
            });
            this.setState({ regionToastKey: promptedToastKey });

            refreshRegions();

            break;
          case FetchRegionLevel.failure:
            if (prevProps.fetchRegionLevel === FetchRegionLevel.fetching) {
              AppToaster.show({
                message: 'Failed to fetch regions.',
                intent: Intent.DANGER,
                icon: 'info-sign'
              });
            }

            break;
          case FetchRegionLevel.success:
            if (prevProps.fetchRegionLevel !== fetchRegionLevel) {
              if (regionToastKey.length > 0) {
                setTimeout(
                  () => AppToaster.dismiss(regionToastKey),
                  5 * 100
                );
              }

              this.setState({  regionToastKey: '' });
            }

            break;
          default:
            break;
        }

        break;
      default:
        break;
    }
  }

  renderConnected() {
    return (
      <div id="app">
        <Topbar />
        <Content />
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
