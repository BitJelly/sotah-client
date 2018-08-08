import {
    CHANGE_ENTRY_CREATELEVEL,
    CHANGE_IS_ADD_ENTRY_DIALOG_OPEN,
    CHANGE_IS_ADD_LIST_DIALOG_OPEN,
    CHANGE_IS_DELETE_LIST_DIALOG_OPEN,
    CHANGE_IS_EDIT_LIST_DIALOG_OPEN,
    CHANGE_SELECTED_LIST,
    PriceListsActions,
    RECEIVE_CREATE_PRICELIST,
    RECEIVE_DELETE_PRICELIST,
    RECEIVE_GET_PRICELISTS,
    RECEIVE_UPDATE_PRICELIST,
    REQUEST_CREATE_PRICELIST,
    REQUEST_DELETE_PRICELIST,
    REQUEST_GET_PRICELISTS,
    REQUEST_UPDATE_PRICELIST,
} from "@app/actions/price-lists";
import {
    defaultPriceListsState,
    GetPricelistsLevel,
    IPricelist,
    IPriceListsState,
    MutatePricelistLevel,
} from "@app/types/price-lists";
import { getPricelistIndex } from "./helper";

type State = Readonly<IPriceListsState> | undefined;

export const priceLists = (state: State, action: PriceListsActions): State => {
    if (state === undefined) {
        return defaultPriceListsState;
    }

    switch (action.type) {
        case REQUEST_CREATE_PRICELIST:
            return { ...state, createPricelistLevel: MutatePricelistLevel.fetching };
        case RECEIVE_CREATE_PRICELIST:
            if (action.payload.errors !== null) {
                return {
                    ...state,
                    createPricelistErrors: action.payload.errors,
                    createPricelistLevel: MutatePricelistLevel.failure,
                };
            }

            return {
                ...state,
                createPricelistErrors: {},
                createPricelistLevel: MutatePricelistLevel.success,
                isAddListDialogOpen: false,
            };
        case REQUEST_UPDATE_PRICELIST:
            return { ...state, updatePricelistLevel: MutatePricelistLevel.fetching };
        case RECEIVE_UPDATE_PRICELIST:
            if (action.payload.response.errors !== null) {
                return {
                    ...state,
                    updatePricelistErrors: action.payload.response.errors,
                    updatePricelistLevel: MutatePricelistLevel.failure,
                };
            }

            const replacedIndex = getPricelistIndex(state.pricelists, action.payload.response.data!.pricelist.id);
            const replacedPricelist = action.payload.response.data!.pricelist;
            replacedPricelist.pricelist_entries = action.payload.response.data!.entries;

            return {
                ...state,
                ...action.payload.meta,
                pricelists: [
                    ...state.pricelists.splice(0, replacedIndex),
                    replacedPricelist,
                    ...state.pricelists.splice(replacedIndex + 1),
                ],
                selectedList: replacedPricelist,
                updatePricelistErrors: {},
                updatePricelistLevel: MutatePricelistLevel.success,
            };
        case REQUEST_DELETE_PRICELIST:
            return { ...state };
        case RECEIVE_DELETE_PRICELIST:
            const deletedIndex = getPricelistIndex(state.pricelists, action.payload!);
            const onDeletePricelists = [
                ...state.pricelists.splice(0, deletedIndex),
                ...state.pricelists.splice(deletedIndex + 1),
            ];
            let onDeleteSelectedList: IPricelist | null = null;
            if (onDeletePricelists.length > 0) {
                const isLastDeleted = deletedIndex === onDeletePricelists.length;
                onDeleteSelectedList = isLastDeleted
                    ? onDeletePricelists[deletedIndex - 1]
                    : onDeletePricelists[deletedIndex];
            }

            return {
                ...state,
                isDeleteListDialogOpen: false,
                pricelists: onDeletePricelists,
                selectedList: onDeleteSelectedList,
            };
        case REQUEST_GET_PRICELISTS:
            return {
                ...state,
                getPricelistsLevel: GetPricelistsLevel.fetching,
            };
        case RECEIVE_GET_PRICELISTS:
            let receivedSelectedList: IPricelist | null = null;
            if (Object.keys(action.payload.pricelists).length > 0) {
                receivedSelectedList = action.payload.pricelists[Object.keys(action.payload.pricelists)[0]];
            }

            return {
                ...state,
                getPricelistsLevel: GetPricelistsLevel.success,
                pricelists: action.payload.pricelists,
                selectedList: receivedSelectedList,
            };
        case CHANGE_ENTRY_CREATELEVEL:
            return { ...state, entryCreateLevel: action.payload };
        case CHANGE_SELECTED_LIST:
            return { ...state, selectedList: action.payload };
        case CHANGE_IS_ADD_LIST_DIALOG_OPEN:
            return { ...state, isAddListDialogOpen: action.payload };
        case CHANGE_IS_EDIT_LIST_DIALOG_OPEN:
            return { ...state, isEditListDialogOpen: action.payload };
        case CHANGE_IS_DELETE_LIST_DIALOG_OPEN:
            return { ...state, isDeleteListDialogOpen: action.payload };
        case CHANGE_IS_ADD_ENTRY_DIALOG_OPEN:
            return { ...state, isAddEntryDialogOpen: action.payload };
        default:
            return state;
    }
};
