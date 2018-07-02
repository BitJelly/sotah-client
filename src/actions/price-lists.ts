import { PriceList, PriceListEntry, ListCreateLevel, EntryCreateLevel, PriceListOpts } from '@app/types/price-lists';

import { createAction, ActionsUnion } from './helpers';

export const CREATE_PRICELIST = 'CREATE_PRICELIST';
export const CreateList = (payload: PriceListOpts) => createAction(CREATE_PRICELIST, payload);

export const CHANGE_LIST_CREATELEVEL = 'CHANGE_LIST_CREATELEVEL';
export const ChangeListCreateLevel = (payload: ListCreateLevel) => createAction(CHANGE_LIST_CREATELEVEL, payload);

export const CREATE_PRICELIST_ENTRY = 'CREATE_PRICELIST_ENTRY';
export const CreateEntry = (payload: PriceListEntry) => createAction(CREATE_PRICELIST_ENTRY, payload);

export const CHANGE_ENTRY_CREATELEVEL = 'CHANGE_ENTRY_CREATELEVEL';
export const ChangeEntryCreateLevel = (payload: EntryCreateLevel) => createAction(CHANGE_ENTRY_CREATELEVEL, payload);

export const CHANGE_SELECTED_LIST = 'CHANGE_SELECTED_LIST';
export const ChangeSelectedList = (payload: PriceList) => createAction(CHANGE_SELECTED_LIST, payload);

export const PriceListsActions = {
  CreateList, ChangeListCreateLevel,
  CreateEntry, ChangeEntryCreateLevel,
  ChangeSelectedList
};

export type PriceListsActions = ActionsUnion<typeof PriceListsActions>;
