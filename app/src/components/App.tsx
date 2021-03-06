import * as React from "react";

import { Classes, Intent } from "@blueprintjs/core";
import { RouteComponentProps } from "react-router-dom";

import { Content } from "@app/components/App/Content";
import { TopbarRouteContainer } from "@app/route-containers/App/Topbar";
import { IProfile, IRealm, IRegion, IUserPreferences } from "@app/types/global";
import { AuthLevel, FetchBootLevel, FetchPingLevel, FetchRealmLevel, FetchUserPreferencesLevel } from "@app/types/main";
import { didRegionChange } from "@app/util";
import { AppToaster } from "@app/util/toasters";

import "./App.scss";

export interface IStateProps {
    fetchPingLevel: FetchPingLevel;
    currentRegion: IRegion | null;
    fetchRealmLevel: FetchRealmLevel;
    currentRealm: IRealm | null;
    preloadedToken: string;
    authLevel: AuthLevel;
    isLoginDialogOpen: boolean;
    fetchUserPreferencesLevel: FetchUserPreferencesLevel;
    userPreferences: IUserPreferences | null;
    profile: IProfile | null;
    fetchBootLevel: FetchBootLevel;
}

export interface IDispatchProps {
    onLoad: () => void;
    reloadUser: (token: string) => void;
    refreshRealms: (region: IRegion) => void;
    changeIsLoginDialogOpen: (isLoginDialogOpen: boolean) => void;
    loadUserPreferences: (token: string) => void;
    changeAuthLevel: (authLevel: AuthLevel) => void;
    boot: () => void;
}

export interface IOwnProps extends RouteComponentProps<{}> {}

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

type State = Readonly<{
    regionToastKey: string;
}>;

export class App extends React.Component<Props, State> {
    public state: State = {
        regionToastKey: "",
    };

    public didHandleUnauth: boolean = false;

    public componentDidMount() {
        const { onLoad, preloadedToken, reloadUser, changeAuthLevel } = this.props;

        onLoad();

        if (preloadedToken.length === 0) {
            changeAuthLevel(AuthLevel.unauthenticated);
        } else {
            reloadUser(preloadedToken);
        }
    }

    public handleUnauth(prevProps: Props) {
        const {
            isLoginDialogOpen,
            changeIsLoginDialogOpen,
            currentRegion,
            fetchBootLevel,
            fetchRealmLevel,
            refreshRealms,
            preloadedToken,
        } = this.props;

        if (preloadedToken.length > 0 && this.didHandleUnauth === false) {
            if (fetchBootLevel === FetchBootLevel.success) {
                this.didHandleUnauth = true;

                AppToaster.show({
                    action: {
                        icon: "log-in",
                        intent: Intent.PRIMARY,
                        onClick: () => changeIsLoginDialogOpen(!isLoginDialogOpen),
                        text: "Login",
                    },
                    icon: "info-sign",
                    intent: Intent.WARNING,
                    message: "Your session has expired.",
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

    public handleAuth(prevProps: Props) {
        const {
            fetchUserPreferencesLevel,
            loadUserPreferences,
            profile,
            userPreferences,
            currentRegion,
            fetchRealmLevel,
            refreshRealms,
            authLevel,
        } = this.props;

        if (prevProps.authLevel !== authLevel) {
            const hasBeenAuthorized = [AuthLevel.unauthenticated, AuthLevel.initial].indexOf(prevProps.authLevel) > -1;
            if (hasBeenAuthorized) {
                AppToaster.show({
                    icon: "user",
                    intent: Intent.SUCCESS,
                    message: "You are logged in.",
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
                        icon: "user",
                        intent: Intent.WARNING,
                        message: "There was an error loading your preferences.",
                    });

                    break;
                case FetchUserPreferencesLevel.success:
                    if (userPreferences === null) {
                        AppToaster.show({
                            icon: "user",
                            intent: Intent.WARNING,
                            message: "You have no preferences.",
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

    public componentDidUpdate(prevProps: Props) {
        const { fetchBootLevel, fetchPingLevel, boot, authLevel } = this.props;
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
                switch (fetchBootLevel) {
                    case FetchBootLevel.initial:
                        if (authLevel === AuthLevel.unauthenticated) {
                            const initialToastKey = AppToaster.show({
                                icon: "info-sign",
                                intent: Intent.NONE,
                                message: "Loading regions.",
                            });
                            this.setState({ regionToastKey: initialToastKey });

                            boot();
                        }

                        break;
                    case FetchBootLevel.prompted:
                        const promptedToastKey = AppToaster.show({
                            icon: "info-sign",
                            intent: Intent.NONE,
                            message: "Loading regions.",
                        });
                        this.setState({ regionToastKey: promptedToastKey });

                        boot();

                        break;
                    case FetchBootLevel.failure:
                        if (prevProps.fetchBootLevel === FetchBootLevel.fetching) {
                            AppToaster.show({
                                icon: "info-sign",
                                intent: Intent.DANGER,
                                message: "Failed to fetch regions.",
                            });
                        }

                        break;
                    case FetchBootLevel.success:
                        if (prevProps.fetchBootLevel !== fetchBootLevel) {
                            if (regionToastKey.length > 0) {
                                setTimeout(() => AppToaster.dismiss(regionToastKey), 5 * 100);
                            }

                            this.setState({ regionToastKey: "" });
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

    public renderConnected() {
        return (
            <div id="app" className={`${Classes.DARK} dark-app`}>
                <TopbarRouteContainer />
                <Content />
            </div>
        );
    }

    public render() {
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
