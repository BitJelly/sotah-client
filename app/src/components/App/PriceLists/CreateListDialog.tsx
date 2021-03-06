import * as React from "react";

import { Intent } from "@blueprintjs/core";

import { ICreatePricelistRequest, ICreateProfessionPricelistRequest } from "@app/api/price-lists";
import { ListDialogContainer } from "@app/containers/App/PriceLists/util/ListDialog";
import { IErrors, IExpansion, IProfession, IProfile, IRealm, IRegion, ItemsMap } from "@app/types/global";
import { MutatePricelistLevel } from "@app/types/price-lists";
import { AppToaster } from "@app/util/toasters";

export interface IStateProps {
    isAddListDialogOpen: boolean;
    currentRegion: IRegion | null;
    currentRealm: IRealm | null;
    createPricelistLevel: MutatePricelistLevel;
    createPricelistErrors: IErrors;
    profile: IProfile | null;
    selectedProfession: IProfession | null;
    selectedExpansion: IExpansion | null;
}

export interface IDispatchProps {
    appendItems: (items: ItemsMap) => void;
    changeIsAddListDialogOpen: (isDialogOpen: boolean) => void;
    createPricelist: (token: string, request: ICreatePricelistRequest) => void;
    createProfessionPricelist: (token: string, request: ICreateProfessionPricelistRequest) => void;
}

export type Props = Readonly<IStateProps & IDispatchProps>;

type State = Readonly<{
    listDialogResetTrigger: number;
}>;

export class CreateListDialog extends React.Component<Props, State> {
    public state = {
        listDialogResetTrigger: 0,
    };

    public componentDidUpdate(prevProps: Props) {
        const { createPricelistLevel } = this.props;
        const { listDialogResetTrigger } = this.state;

        if (prevProps.createPricelistLevel !== createPricelistLevel) {
            switch (createPricelistLevel) {
                case MutatePricelistLevel.success:
                    AppToaster.show({
                        icon: "info-sign",
                        intent: Intent.SUCCESS,
                        message: "Your pricelist has been created.",
                    });
                    this.setState({ listDialogResetTrigger: listDialogResetTrigger + 1 });

                    break;
                default:
                    break;
            }
        }
    }

    public render() {
        const {
            isAddListDialogOpen,
            changeIsAddListDialogOpen,
            createPricelistErrors,
            createPricelistLevel,
            selectedProfession,
        } = this.props;
        const { listDialogResetTrigger } = this.state;

        let dialogTitle = "New Price List";
        if (selectedProfession !== null) {
            dialogTitle = `New ${selectedProfession.label} Price List`;
        }

        return (
            <ListDialogContainer
                isOpen={isAddListDialogOpen}
                onClose={() => changeIsAddListDialogOpen(!isAddListDialogOpen)}
                title={dialogTitle}
                mutationErrors={createPricelistErrors}
                mutatePricelistLevel={createPricelistLevel}
                resetTrigger={listDialogResetTrigger}
                onComplete={v => this.onListDialogComplete(v)}
            />
        );
    }

    private onListDialogComplete({ name, entries, items }) {
        const {
            createPricelist,
            profile,
            appendItems,
            currentRegion,
            currentRealm,
            selectedProfession,
            createProfessionPricelist,
            selectedExpansion,
        } = this.props;

        if (selectedProfession === null) {
            createPricelist(profile!.token, {
                entries,
                pricelist: { name, region: currentRegion!.name, realm: currentRealm!.slug },
            });
        } else {
            createProfessionPricelist(profile!.token, {
                entries,
                expansion_name: selectedExpansion!.name,
                pricelist: { name, region: currentRegion!.name, realm: currentRealm!.slug },
                profession_name: selectedProfession.name,
            });
        }

        appendItems(items);
    }
}
