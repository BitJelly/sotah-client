import * as React from "react";

import { Classes, Intent, ITreeNode, NonIdealState, Spinner, Tree } from "@blueprintjs/core";

import { IGetProfessionPricelistsRequestOptions } from "@app/api/price-lists";
import { LastModified } from "@app/components/util";
import { PriceListPanelContainer } from "@app/containers/App/PriceLists/PriceListPanel";
import { IExpansion, IProfession, IRealm, IRegion } from "@app/types/global";
import { AuthLevel } from "@app/types/main";
import {
    GetProfessionPricelistsLevel,
    IExpansionProfessionPricelistMap,
    IPricelist,
    ISelectExpansionPayload,
} from "@app/types/price-lists";

export interface IStateProps {
    pricelists: IPricelist[];
    selectedList: IPricelist | null;
    currentRegion: IRegion | null;
    currentRealm: IRealm | null;
    professions: IProfession[];
    selectedProfession: IProfession | null;
    getProfessionPricelistsLevel: GetProfessionPricelistsLevel;
    professionPricelists: IExpansionProfessionPricelistMap;
    expansions: IExpansion[];
    selectedExpansion: IExpansion | null;
    authLevel: AuthLevel;
}

export interface IDispatchProps {
    changeSelectedList: (list: IPricelist) => void;
    changeSelectedProfession: (profession: IProfession) => void;
    refreshProfessionPricelists: (opts: IGetProfessionPricelistsRequestOptions) => void;
    changeSelectedExpansion: (v: ISelectExpansionPayload) => void;
}

export type Props = Readonly<IStateProps & IDispatchProps>;

interface ITopOpenMap {
    [key: string]: boolean;
}

interface IState {
    topOpenMap: ITopOpenMap;
}

enum TopOpenKey {
    pricelists = "pricelists",
    professions = "professions",
}

export class PricelistTree extends React.Component<Props, IState> {
    public state: IState = {
        topOpenMap: {
            [TopOpenKey.pricelists]: true,
            [TopOpenKey.professions]: true,
        },
    };

    public componentDidUpdate(prevProps: Props) {
        const { getProfessionPricelistsLevel, expansions, changeSelectedExpansion } = this.props;

        const shouldSelectFirstExpansion =
            prevProps.getProfessionPricelistsLevel === GetProfessionPricelistsLevel.fetching &&
            getProfessionPricelistsLevel === GetProfessionPricelistsLevel.success;
        if (shouldSelectFirstExpansion) {
            changeSelectedExpansion({ expansion: expansions[0] });
        }
    }

    public render() {
        const { selectedList, pricelists, authLevel } = this.props;
        const { topOpenMap } = this.state;

        const nodes: ITreeNode[] = [];

        // optionally appending custom-pricelists
        if (authLevel === AuthLevel.authenticated) {
            nodes.push({
                childNodes: pricelists.map(v => this.getPricelistNode(v)),
                hasCaret: true,
                icon: "list",
                id: `top-${TopOpenKey.pricelists}`,
                isExpanded: topOpenMap[TopOpenKey.pricelists],
                label: "Custom Pricelists",
            });
        }

        // appending profession-pricelists
        nodes.push({
            childNodes: this.getProfessionNodes(),
            hasCaret: true,
            icon: "list",
            id: `top-${TopOpenKey.professions}`,
            isExpanded: topOpenMap[TopOpenKey.professions],
            label: "Professions",
        });

        return (
            <div style={{ marginTop: "10px" }}>
                <div className="pure-g">
                    <div className="pure-u-1-4">
                        <Tree contents={nodes} className={Classes.ELEVATION_0} onNodeClick={v => this.onNodeClick(v)} />
                    </div>
                    <div className="pure-u-3-4">
                        <div style={{ paddingLeft: "10px" }}>{this.renderTreeContent(selectedList)}</div>
                    </div>
                </div>
            </div>
        );
    }

    private getProfessionNodes() {
        const { professions } = this.props;

        return professions.map(v => this.getProfessionNode(v));
    }

    private getProfessionNode(v: IProfession) {
        const { selectedProfession, getProfessionPricelistsLevel } = this.props;

        const isSelected = selectedProfession !== null && selectedProfession.name === v.name;
        const result: ITreeNode = {
            id: `profession-${v.name}`,
            isSelected,
            label: v.label,
        };
        if (!isSelected) {
            return result;
        }

        result.isExpanded = true;
        result.hasCaret = false;

        switch (getProfessionPricelistsLevel) {
            case GetProfessionPricelistsLevel.initial:
                result.childNodes = [
                    {
                        icon: <Spinner size={20} value={0} intent={Intent.NONE} />,
                        id: "loading-0",
                        label: <span style={{ marginLeft: "5px" }}>Loading</span>,
                    },
                ];

                break;
            case GetProfessionPricelistsLevel.fetching:
                result.childNodes = [
                    {
                        icon: <Spinner size={20} intent={Intent.PRIMARY} />,
                        id: "loading-0",
                        label: <span style={{ marginLeft: "5px" }}>Loading</span>,
                    },
                ];

                break;
            case GetProfessionPricelistsLevel.failure:
                result.childNodes = [
                    {
                        icon: <Spinner size={20} intent={Intent.DANGER} />,
                        id: "loading-0",
                        label: <span style={{ marginLeft: "5px" }}>Failed to load profession pricelists!</span>,
                    },
                ];

                break;
            case GetProfessionPricelistsLevel.success:
                result.childNodes = this.getExpansionNodes();

                break;
            default:
                break;
        }

        return result;
    }

    private getExpansionNodes(): ITreeNode[] {
        const { expansions, selectedExpansion } = this.props;

        return expansions.map(v => {
            const isSelected = selectedExpansion !== null && selectedExpansion.name === v.name;
            const result: ITreeNode = {
                childNodes: this.getProfessionPricelistNodes(v),
                hasCaret: false,
                id: `expansion-${v.name}`,
                isExpanded: true,
                isSelected,
                label: v.label,
            };

            return result;
        });
    }

    private getProfessionPricelistNodes(expansion: IExpansion): ITreeNode[] {
        const { professionPricelists, selectedExpansion } = this.props;

        const isSelected = selectedExpansion !== null && expansion.name === selectedExpansion.name;

        if (expansion === null || !(expansion.name in professionPricelists)) {
            if (!isSelected) {
                return [];
            }

            return [{ id: "none-none", label: <em>None found.</em> }];
        }

        const result = professionPricelists[expansion.name];
        if (result.length === 0) {
            if (!isSelected) {
                return [];
            }

            return [{ id: "none-none", label: <em>None found.</em> }];
        }

        return result.map(v => this.getPricelistNode(v.pricelist!));
    }

    private getPricelistNode(v: IPricelist) {
        const { selectedList } = this.props;

        const result: ITreeNode = {
            id: `pricelist-${v.id}`,
            isSelected: selectedList !== null && selectedList.id === v.id,
            label: v.name,
        };

        return result;
    }

    private onPricelistNodeClick(id: string) {
        const {
            pricelists,
            professionPricelists,
            changeSelectedList,
            changeSelectedExpansion,
            expansions,
        } = this.props;

        // checking user pricelists first
        const list = pricelists.reduce((result, v) => {
            if (result !== null) {
                return result;
            }

            if (v.id.toString() === id) {
                return v;
            }

            return null;
        }, null);
        if (list !== null) {
            changeSelectedList(list);

            return;
        }

        // checking profession pricelists
        for (const expansionName of Object.keys(professionPricelists)) {
            const expansion: IExpansion | null = expansions.reduce((result: IExpansion, v) => {
                if (result !== null) {
                    return result;
                }

                if (v.name === expansionName) {
                    return v;
                }

                return null;
            }, null);

            for (const professionPricelist of professionPricelists[expansionName]) {
                if (professionPricelist.pricelist_id.toString() === id) {
                    changeSelectedExpansion({
                        expansion: expansion!,
                        jumpTo: professionPricelist.pricelist!,
                    });

                    return;
                }
            }
        }
    }

    private onProfessionNodeClick(id: string) {
        const { professions, changeSelectedProfession, refreshProfessionPricelists } = this.props;

        const profession = professions.reduce((result, v) => {
            if (result !== null) {
                return result;
            }

            if (v.name === id) {
                return v;
            }

            return null;
        }, null);

        if (profession === null) {
            return;
        }

        changeSelectedProfession(profession);
        refreshProfessionPricelists({ profession: profession!.name });
    }

    private onTopNodeClick(id: TopOpenKey) {
        const { topOpenMap } = this.state;

        this.setState({ topOpenMap: { ...topOpenMap, [id]: !topOpenMap[id] } });
    }

    private onExpansionClick(id: string) {
        const { expansions, changeSelectedExpansion } = this.props;

        const expansion = expansions.reduce((result, v) => {
            if (result !== null) {
                return result;
            }

            if (v.name === id) {
                return v;
            }

            return null;
        }, null);

        if (expansion === null) {
            return;
        }

        changeSelectedExpansion({ expansion });
    }

    private onNodeClick(node: ITreeNode) {
        const separatorIndex = node.id.toString().indexOf("-");
        if (separatorIndex === -1) {
            return;
        }

        const [kind, id] = [
            node.id.toString().substr(0, separatorIndex),
            node.id.toString().substr(separatorIndex + 1),
        ];
        const nodeClickMap = {
            expansion: v => this.onExpansionClick(v),
            pricelist: v => this.onPricelistNodeClick(v),
            profession: v => this.onProfessionNodeClick(v),
            top: v => this.onTopNodeClick(v),
        };

        if (!(kind in nodeClickMap)) {
            return;
        }

        nodeClickMap[kind](id);
    }

    private renderTreeContent(list: IPricelist | null) {
        const { currentRealm, authLevel } = this.props;

        if (list === null) {
            if (authLevel === AuthLevel.unauthenticated) {
                return (
                    <NonIdealState
                        title="Pricelists"
                        icon="list"
                        description="Please select a profession to view pricelists."
                    />
                );
            }

            return (
                <NonIdealState
                    title="Pricelists"
                    icon="list"
                    description="Please select a profession to view pricelists."
                />
            );
        }

        return (
            <>
                <PriceListPanelContainer list={list} />
                <LastModified targetDate={new Date(currentRealm!.last_modified * 1000)} />
            </>
        );
    }
}
