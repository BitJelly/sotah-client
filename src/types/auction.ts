import { Auction, Owner, Item, ItemClasses } from './global';

export type AuctionState = {
  fetchAuctionsLevel: FetchAuctionsLevel
  auctions: Auction[]
  currentPage: number
  auctionsPerPage: number
  totalResults: number,
  sortDirection: SortDirection
  sortKind: SortKind
  queryAuctionsLevel: QueryAuctionsLevel
  queryAuctionResults: QueryAuctionResult[]
  selectedQueryAuctionResults: QueryAuctionResult[],
  fetchItemClassesLevel: FetchItemClassesLevel,
  itemClasses: ItemClasses
};

export enum FetchAuctionsLevel { initial, fetching, refetching, success, failure }

export enum SortDirection { none, up, down }

export enum SortKind { none, item, quantity, bid, buyout, buyoutPer, auctions, owner }

export type SortChangeOptions = {
  sortKind: SortKind
  sortDirection: SortDirection
};

export enum FetchOwnersLevel { initial, fetching, refetching, success, failure }

export enum FetchItemsLevel { initial, fetching, refetching, success, failure }

export enum QueryAuctionsLevel { initial, fetching, refetching, success, failure }

export type QueryAuctionResult = {
  item: Item
  owner: Owner
  target: string
  rank: number
};

export enum FetchItemClassesLevel { initial, fetching, refetching, success, failure }

export const defaultAuctionState: AuctionState = {
  fetchAuctionsLevel: FetchAuctionsLevel.initial,
  auctions: [],
  currentPage: 0,
  auctionsPerPage: 10,
  totalResults: 0,
  sortDirection: SortDirection.none,
  sortKind: SortKind.none,
  queryAuctionsLevel: QueryAuctionsLevel.initial,
  queryAuctionResults: [],
  selectedQueryAuctionResults: [],
  fetchItemClassesLevel: FetchItemClassesLevel.initial,
  itemClasses: {}
};
