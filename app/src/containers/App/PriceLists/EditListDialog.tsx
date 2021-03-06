import { connect, Dispatch } from "react-redux";

import { Actions } from "@app/actions";
import { AppendItems, ChangeIsEditListDialogOpen, FetchUpdatePricelist } from "@app/actions/price-lists";
import { EditListDialog, IDispatchProps, IStateProps } from "@app/components/App/PriceLists/EditListDialog";
import { IStoreState } from "@app/types";
import { ItemsMap } from "@app/types/global";
import { IUpdatePricelistRequestOptions } from "@app/types/price-lists";

const mapStateToProps = (state: IStoreState): IStateProps => {
    const { profile } = state.Main;
    const { isEditListDialogOpen, items, updatePricelistLevel, updatePricelistErrors, selectedList } = state.PriceLists;

    return {
        isEditListDialogOpen,
        items,
        profile,
        selectedList,
        updatePricelistErrors,
        updatePricelistLevel,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>): IDispatchProps => {
    return {
        appendItems: (items: ItemsMap) => dispatch(AppendItems(items)),
        changeIsEditListDialogOpen: (isDialogOpen: boolean) => dispatch(ChangeIsEditListDialogOpen(isDialogOpen)),
        updatePricelist: (opts: IUpdatePricelistRequestOptions) => dispatch(FetchUpdatePricelist(opts)),
    };
};

export const EditListDialogContainer = connect<IStateProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(EditListDialog);
