import { Dispatch } from 'redux';

import { Pricelist, EntryCreateLevel } from '@app/types/price-lists';
import {
  CreatePricelistRequest, CreatePricelistResponse, createPricelist,
  UpdatePricelistRequest, UpdatePricelistResponse, updatePricelist,
  GetPricelistsOptions, GetPricelistsResponse, getPricelists
} from '@app/api/price-lists';

import { createAction, ActionsUnion } from './helpers';

export const REQUEST_CREATE_PRICELIST = 'REQUEST_CREATE_PRICELIST';
export const RequestCreatePricelist = () => createAction(REQUEST_CREATE_PRICELIST);
export const RECEIVE_CREATE_PRICELIST = 'RECEIVE_CREATE_PRICELIST';
export const ReceiveCreatePricelist = (
  payload: CreatePricelistResponse
) => createAction(RECEIVE_CREATE_PRICELIST, payload);
type FetchCreatePricelistType = ReturnType<typeof RequestCreatePricelist | typeof ReceiveCreatePricelist>;
export const FetchCreatePricelist = (token: string, request: CreatePricelistRequest) => {
  return async (dispatch: Dispatch<FetchCreatePricelistType>) => {
    dispatch(RequestCreatePricelist());
    dispatch(ReceiveCreatePricelist(await createPricelist(token, request)));
  };
};

export const REQUEST_UPDATE_PRICELIST = 'REQUEST_UPDATE_PRICELIST';
export const RequestUpdatePricelist = () => createAction(REQUEST_UPDATE_PRICELIST);
export const RECEIVE_UPDATE_PRICELIST = 'RECEIVE_UPDATE_PRICELIST';
export const ReceiveUpdatePricelist = (
  payload: UpdatePricelistResponse
) => createAction(RECEIVE_UPDATE_PRICELIST, payload);
type FetchUpdatePricelistType = ReturnType<typeof RequestUpdatePricelist | typeof ReceiveUpdatePricelist>;
export const FetchUpdatePricelist = (request: UpdatePricelistRequest) => {
  return async (dispatch: Dispatch<FetchUpdatePricelistType>) => {
    dispatch(RequestUpdatePricelist());
    dispatch(ReceiveUpdatePricelist(await updatePricelist(request)));
  };
};

export const REQUEST_GET_PRICELISTS = 'REQUEST_GET_PRICELISTS';
export const RequestGetPricelists = () => createAction(REQUEST_GET_PRICELISTS);
export const RECEIVE_GET_PRICELISTS = 'RECEIVE_GET_PRICELISTS';
export const ReceiveGetPricelists = (
  payload: GetPricelistsResponse
) => createAction(RECEIVE_GET_PRICELISTS, payload);
type FetchGetPricelistsType = ReturnType<typeof RequestGetPricelists | typeof ReceiveGetPricelists>;
export const FetchGetPricelists = (opts: GetPricelistsOptions) => {
  return async (dispatch: Dispatch<FetchGetPricelistsType>) => {
    dispatch(RequestGetPricelists());
    dispatch(ReceiveGetPricelists(await getPricelists(opts)));
  };
};

export const CHANGE_ENTRY_CREATELEVEL = 'CHANGE_ENTRY_CREATELEVEL';
export const ChangeEntryCreateLevel = (payload: EntryCreateLevel) => createAction(CHANGE_ENTRY_CREATELEVEL, payload);

export const CHANGE_SELECTED_LIST = 'CHANGE_SELECTED_LIST';
export const ChangeSelectedList = (payload: Pricelist) => createAction(CHANGE_SELECTED_LIST, payload);

export const CHANGE_IS_ADD_LIST_DIALOG_OPEN = 'CHANGE_IS_ADD_LIST_DIALOG_OPEN';
export const ChangeIsAddListDialogOpen = (payload: boolean) => createAction(CHANGE_IS_ADD_LIST_DIALOG_OPEN, payload);

export const CHANGE_IS_ADD_ENTRY_DIALOG_OPEN = 'CHANGE_IS_ADD_ENTRY_DIALOG_OPEN';
export const ChangeIsAddEntryDialogOpen = (payload: boolean) => createAction(CHANGE_IS_ADD_ENTRY_DIALOG_OPEN, payload);

export const PriceListsActions = {
  RequestCreatePricelist, ReceiveCreatePricelist,
  RequestUpdatePricelist, ReceiveUpdatePricelist,
  RequestGetPricelists, ReceiveGetPricelists,
  ChangeEntryCreateLevel,
  ChangeSelectedList,
  ChangeIsAddListDialogOpen, ChangeIsAddEntryDialogOpen
};

export type PriceListsActions = ActionsUnion<typeof PriceListsActions>;
