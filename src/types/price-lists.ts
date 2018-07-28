import { UpdatePricelistRequest, UpdatePricelistResponse } from '@app/api/price-lists';
import { RegionName, RealmSlug, ItemId, Errors } from './global';

export type PriceListsState = {
  pricelists: Pricelist[]
  createPricelistLevel: CreatePricelistLevel
  createPricelistErrors: Errors
  updatePricelistLevel: UpdatePricelistLevel
  updatePricelistErrors: Errors
  entryCreateLevel: EntryCreateLevel
  selectedList: Pricelist | null
  isAddListDialogOpen: boolean
  isEditListDialogOpen: boolean
  isDeleteListDialogOpen: boolean
  isAddEntryDialogOpen: boolean
  getPricelistsLevel: GetPricelistsLevel
};

export enum CreateListStep { list, entry, finish }
export enum CreateListCompletion { initial, list, entry }
export enum EntryCreateLevel { initial, success, failure }
export enum CreatePricelistLevel { initial, fetching, success, failure }
export enum UpdatePricelistLevel { initial, fetching, success, failure }
export enum GetPriceListLevel { initial, success, failure }
export enum GetPricelistsLevel { initial, fetching, success, failure }

export type Pricelist = {
  id: number
  user_id: number
  name: string
  region: RegionName
  realm: RealmSlug
  pricelist_entries?: PricelistEntry[]
};

export type PricelistEntry = {
  id?: number
  pricelist_id?: number
  item_id: ItemId
  quantity_modifier: number
};

type UpdatePricelistMeta = {
  isAddEntryDialogOpen?: boolean
  isEditListDialogOpen?: boolean
};

export type UpdatePricelistRequestOptions = {
  request: UpdatePricelistRequest
  meta: UpdatePricelistMeta
};

export type UpdatePricelistResponseOptions = {
  response: UpdatePricelistResponse
  meta: UpdatePricelistMeta
};

export const defaultPriceListsState: PriceListsState = {
  pricelists: [],
  createPricelistLevel: CreatePricelistLevel.initial,
  createPricelistErrors: {},
  updatePricelistLevel: UpdatePricelistLevel.initial,
  updatePricelistErrors: {},
  entryCreateLevel: EntryCreateLevel.initial,
  selectedList: null,
  isAddListDialogOpen: false,
  isEditListDialogOpen: false,
  isDeleteListDialogOpen: false,
  isAddEntryDialogOpen: false,
  getPricelistsLevel: GetPricelistsLevel.initial
};