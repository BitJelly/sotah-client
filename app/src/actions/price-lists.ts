import { Dispatch } from "redux";

import {
    createPricelist,
    deletePricelist,
    getPricelists,
    ICreatePricelistRequest,
    ICreatePricelistResponse,
    IDeletePricelistRequestOptions,
    IGetPricelistsOptions,
    IGetPricelistsResponse,
    updatePricelist,
} from "@app/api/price-lists";
import {
    EntryCreateLevel,
    IPricelist,
    IUpdatePricelistRequestOptions,
    IUpdatePricelistResponseOptions,
} from "@app/types/price-lists";

import { ActionsUnion, createAction } from "./helpers";

export const REQUEST_CREATE_PRICELIST = "REQUEST_CREATE_PRICELIST";
export const RequestCreatePricelist = () => createAction(REQUEST_CREATE_PRICELIST);
export const RECEIVE_CREATE_PRICELIST = "RECEIVE_CREATE_PRICELIST";
export const ReceiveCreatePricelist = (payload: ICreatePricelistResponse) =>
    createAction(RECEIVE_CREATE_PRICELIST, payload);
type FetchCreatePricelistType = ReturnType<typeof RequestCreatePricelist | typeof ReceiveCreatePricelist>;
export const FetchCreatePricelist = (token: string, request: ICreatePricelistRequest) => {
    return async (dispatch: Dispatch<FetchCreatePricelistType>) => {
        dispatch(RequestCreatePricelist());
        dispatch(ReceiveCreatePricelist(await createPricelist(token, request)));
    };
};

export const REQUEST_UPDATE_PRICELIST = "REQUEST_UPDATE_PRICELIST";
export const RequestUpdatePricelist = () => createAction(REQUEST_UPDATE_PRICELIST);
export const RECEIVE_UPDATE_PRICELIST = "RECEIVE_UPDATE_PRICELIST";
export const ReceiveUpdatePricelist = (payload: IUpdatePricelistResponseOptions) =>
    createAction(RECEIVE_UPDATE_PRICELIST, payload);
type FetchUpdatePricelistType = ReturnType<typeof RequestUpdatePricelist | typeof ReceiveUpdatePricelist>;
export const FetchUpdatePricelist = (opts: IUpdatePricelistRequestOptions) => {
    return async (dispatch: Dispatch<FetchUpdatePricelistType>) => {
        dispatch(RequestUpdatePricelist());
        dispatch(
            ReceiveUpdatePricelist({
                meta: opts.meta,
                response: await updatePricelist(opts.request),
            }),
        );
    };
};

export const REQUEST_DELETE_PRICELIST = "REQUEST_DELETE_PRICELIST";
export const RequestDeletePricelist = () => createAction(REQUEST_DELETE_PRICELIST);
export const RECEIVE_DELETE_PRICELIST = "RECEIVE_DELETE_PRICELIST";
export const ReceiveDeletePricelist = (payload: number | null) => createAction(RECEIVE_DELETE_PRICELIST, payload);
type FetchDeletePricelistType = ReturnType<typeof RequestDeletePricelist | typeof ReceiveDeletePricelist>;
export const FetchDeletePricelist = (opts: IDeletePricelistRequestOptions) => {
    return async (dispatch: Dispatch<FetchDeletePricelistType>) => {
        dispatch(RequestDeletePricelist());
        dispatch(ReceiveDeletePricelist(await deletePricelist(opts)));
    };
};

export const REQUEST_GET_PRICELISTS = "REQUEST_GET_PRICELISTS";
export const RequestGetPricelists = () => createAction(REQUEST_GET_PRICELISTS);
export const RECEIVE_GET_PRICELISTS = "RECEIVE_GET_PRICELISTS";
export const ReceiveGetPricelists = (payload: IGetPricelistsResponse) => createAction(RECEIVE_GET_PRICELISTS, payload);
type FetchGetPricelistsType = ReturnType<typeof RequestGetPricelists | typeof ReceiveGetPricelists>;
export const FetchGetPricelists = (opts: IGetPricelistsOptions) => {
    return async (dispatch: Dispatch<FetchGetPricelistsType>) => {
        dispatch(RequestGetPricelists());
        dispatch(ReceiveGetPricelists(await getPricelists(opts)));
    };
};

export const CHANGE_ENTRY_CREATELEVEL = "CHANGE_ENTRY_CREATELEVEL";
export const ChangeEntryCreateLevel = (payload: EntryCreateLevel) => createAction(CHANGE_ENTRY_CREATELEVEL, payload);

export const CHANGE_SELECTED_LIST = "CHANGE_SELECTED_LIST";
export const ChangeSelectedList = (payload: IPricelist) => createAction(CHANGE_SELECTED_LIST, payload);

export const CHANGE_IS_ADD_LIST_DIALOG_OPEN = "CHANGE_IS_ADD_LIST_DIALOG_OPEN";
export const ChangeIsAddListDialogOpen = (payload: boolean) => createAction(CHANGE_IS_ADD_LIST_DIALOG_OPEN, payload);

export const CHANGE_IS_EDIT_LIST_DIALOG_OPEN = "CHANGE_IS_EDIT_LIST_DIALOG_OPEN";
export const ChangeIsEditListDialogOpen = (payload: boolean) => createAction(CHANGE_IS_EDIT_LIST_DIALOG_OPEN, payload);

export const CHANGE_IS_DELETE_LIST_DIALOG_OPEN = "CHANGE_IS_DELETE_LIST_DIALOG_OPEN";
export const ChangeIsDeleteListDialogOpen = (payload: boolean) =>
    createAction(CHANGE_IS_DELETE_LIST_DIALOG_OPEN, payload);

export const CHANGE_IS_ADD_ENTRY_DIALOG_OPEN = "CHANGE_IS_ADD_ENTRY_DIALOG_OPEN";
export const ChangeIsAddEntryDialogOpen = (payload: boolean) => createAction(CHANGE_IS_ADD_ENTRY_DIALOG_OPEN, payload);

export const PriceListsActions = {
    ChangeEntryCreateLevel,
    ChangeIsAddEntryDialogOpen,
    ChangeIsAddListDialogOpen,
    ChangeIsDeleteListDialogOpen,
    ChangeIsEditListDialogOpen,
    ChangeSelectedList,
    ReceiveCreatePricelist,
    ReceiveDeletePricelist,
    ReceiveGetPricelists,
    ReceiveUpdatePricelist,
    RequestCreatePricelist,
    RequestDeletePricelist,
    RequestGetPricelists,
    RequestUpdatePricelist,
};

export type PriceListsActions = ActionsUnion<typeof PriceListsActions>;
