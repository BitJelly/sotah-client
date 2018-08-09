import * as React from "react";

import { Intent } from "@blueprintjs/core";

import { ICreatePricelistRequest } from "@app/api/price-lists";
import { ListDialog } from "@app/components/App/PriceLists/util/ListDialog";
import { IErrors, IProfile, IRealm, IRegion } from "@app/types/global";
import { MutatePricelistLevel } from "@app/types/price-lists";
import { AppToaster } from "@app/util/toasters";

export interface IStateProps {
    isAddListDialogOpen: boolean;
    currentRegion: IRegion | null;
    currentRealm: IRealm | null;
    createPricelistLevel: MutatePricelistLevel;
    createPricelistErrors: IErrors;
    profile: IProfile | null;
}

export interface IDispatchProps {
    changeIsAddListDialogOpen: (isDialogOpen: boolean) => void;
    createPricelist: (token: string, request: ICreatePricelistRequest) => void;
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
            createPricelist,
            profile,
            currentRegion,
            currentRealm,
        } = this.props;
        const { listDialogResetTrigger } = this.state;

        return (
            <ListDialog
                isOpen={isAddListDialogOpen}
                onClose={() => changeIsAddListDialogOpen(!isAddListDialogOpen)}
                title="New Price List"
                mutationErrors={createPricelistErrors}
                mutatePricelistLevel={createPricelistLevel}
                resetTrigger={listDialogResetTrigger}
                onComplete={({ name, entries }) => {
                    createPricelist(profile!.token, {
                        entries,
                        pricelist: { name, region: currentRegion!.name, realm: currentRealm!.slug },
                    });
                }}
            />
        );
    }
}
