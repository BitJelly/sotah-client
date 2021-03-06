import * as React from "react";

import { Intent } from "@blueprintjs/core";

import { ListDialogContainer } from "@app/containers/App/PriceLists/util/ListDialog";
import { IErrors, IProfile, ItemsMap } from "@app/types/global";
import { IPricelist, IUpdatePricelistRequestOptions, MutatePricelistLevel } from "@app/types/price-lists";
import { AppToaster } from "@app/util/toasters";

export interface IStateProps {
    isEditListDialogOpen: boolean;
    updatePricelistLevel: MutatePricelistLevel;
    updatePricelistErrors: IErrors;
    profile: IProfile | null;
    selectedList: IPricelist | null;
    items: ItemsMap;
}

export interface IDispatchProps {
    appendItems: (items: ItemsMap) => void;
    changeIsEditListDialogOpen: (isDialogOpen: boolean) => void;
    updatePricelist: (opts: IUpdatePricelistRequestOptions) => void;
}

export type Props = Readonly<IStateProps & IDispatchProps>;

type State = Readonly<{
    listDialogResetTrigger: number;
}>;

export class EditListDialog extends React.Component<Props, State> {
    public state = {
        listDialogResetTrigger: 0,
    };

    public componentDidUpdate(prevProps: Props) {
        const { updatePricelistLevel, selectedList } = this.props;
        const { listDialogResetTrigger } = this.state;

        if (prevProps.updatePricelistLevel !== updatePricelistLevel) {
            switch (updatePricelistLevel) {
                case MutatePricelistLevel.success:
                    AppToaster.show({
                        icon: "info-sign",
                        intent: Intent.SUCCESS,
                        message: `"${selectedList!.name}" has been saved.`,
                    });
                    this.setState({ listDialogResetTrigger: listDialogResetTrigger + 1 });

                    break;
                default:
                    break;
            }
        }
    }

    public render() {
        const { isEditListDialogOpen, updatePricelistErrors, updatePricelistLevel, selectedList } = this.props;
        const { listDialogResetTrigger } = this.state;

        if (selectedList === null) {
            return null;
        }

        return (
            <ListDialogContainer
                isOpen={isEditListDialogOpen}
                onClose={() => this.onListDialogClose()}
                title="Edit Price List"
                mutationErrors={updatePricelistErrors}
                mutatePricelistLevel={updatePricelistLevel}
                resetTrigger={listDialogResetTrigger}
                defaultName={selectedList!.name}
                defaultEntries={selectedList.pricelist_entries}
                onComplete={v => this.onListDialogComplete(v)}
            />
        );
    }

    private onListDialogClose() {
        const { changeIsEditListDialogOpen } = this.props;
        const { listDialogResetTrigger } = this.state;

        changeIsEditListDialogOpen(false);
        this.setState({ listDialogResetTrigger: listDialogResetTrigger + 1 });
    }

    private onListDialogComplete({ name, entries, items }) {
        const { updatePricelist, profile, selectedList, appendItems } = this.props;

        updatePricelist({
            meta: { isEditListDialogOpen: false },
            request: { entries, pricelist: { ...selectedList!, name }, token: profile!.token },
        });
        appendItems(items);
    }
}
