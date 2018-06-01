import {
  Regions,
  Realms,
  Auction,
  ItemClasses,
  SubItemClasses
} from '@app/types/global';
import {
  AuctionState,
  FetchAuctionsLevel,
  FetchRegionLevel,
  FetchRealmLevel,
  QueryAuctionsLevel,
  defaultAuctionState,
  FetchItemClassesLevel
} from '@app/types/auction';
import {
  AuctionActions,
  REQUEST_REGIONS, RECEIVE_REGIONS,
  REGION_CHANGE,
  REQUEST_REALMS, RECEIVE_REALMS,
  REALM_CHANGE,
  REQUEST_AUCTIONS, RECEIVE_AUCTIONS,
  PAGE_CHANGE, COUNT_CHANGE, SORT_CHANGE,
  REQUEST_AUCTIONS_QUERY, RECEIVE_AUCTIONS_QUERY,
  ADD_AUCTIONS_QUERY, REMOVE_AUCTIONS_QUERY,
  REQUEST_ITEMCLASSES, RECEIVE_ITEMCLASSES
} from '@app/actions/auction';

type State = Readonly<AuctionState> | undefined;

export const auction = (state: State, action: AuctionActions): State => {
  if (state === undefined) {
    return defaultAuctionState;
  }

  switch (action.type) {
    case REQUEST_REGIONS:
      return { ...state, fetchRegionLevel: FetchRegionLevel.fetching };
    case RECEIVE_REGIONS:
      if (action.payload === null) {
        return { ...state, fetchRegionLevel: FetchRegionLevel.failure };
      }

      const currentRegion = action.payload[0];
      const regions: Regions = action.payload.reduce(
        (result, region) => { return { ...result, [region.name]: region }; },
        {}
      );

      return { ...state, fetchRegionLevel: FetchRegionLevel.success, regions, currentRegion };
    case REGION_CHANGE:
      return { ...state, currentRegion: action.payload, currentPage: defaultAuctionState.currentPage };
    case REQUEST_REALMS:
      return { ...state, fetchRealmLevel: FetchRealmLevel.fetching };
    case RECEIVE_REALMS:
      if (action.payload === null) {
        return { ...state, fetchRealmLevel: FetchRealmLevel.failure };
      }

      const currentRealm = action.payload[0];
      const realms: Realms = action.payload.reduce(
        (result, realm) => { return { ...result, [realm.slug]: realm }; },
        {}
      );

      return { ...state, fetchRealmLevel: FetchRealmLevel.success, realms, currentRealm };
    case REALM_CHANGE:
      return { ...state, currentRealm: action.payload, currentPage: defaultAuctionState.currentPage };
    case REQUEST_AUCTIONS:
      const fetchAuctionsLevel = state.fetchAuctionsLevel === FetchAuctionsLevel.initial
        ? FetchAuctionsLevel.fetching
        : FetchAuctionsLevel.refetching;
      return { ...state, fetchAuctionsLevel };
    case RECEIVE_AUCTIONS:
      if (action.payload === null) {
        return { ...state, fetchAuctionsLevel: FetchAuctionsLevel.failure };
      }

      let auctions: Auction[] = [];
      if (action.payload.auctions !== null) {
        auctions = action.payload.auctions;
      }

      return { ...state, fetchAuctionsLevel: FetchAuctionsLevel.success, totalResults: action.payload.total, auctions };
    case PAGE_CHANGE:
      return { ...state, currentPage: action.payload };
    case COUNT_CHANGE:
      return { ...state, auctionsPerPage: action.payload, currentPage: defaultAuctionState.currentPage };
    case SORT_CHANGE:
      const { sortDirection, sortKind } = action.payload;
      return { ...state, currentPage: defaultAuctionState.currentPage, sortDirection, sortKind };
    case REQUEST_AUCTIONS_QUERY:
      const queryAuctionsLevel = state.queryAuctionsLevel === QueryAuctionsLevel.initial
        ? QueryAuctionsLevel.fetching
        : QueryAuctionsLevel.refetching;
      return { ...state, queryAuctionsLevel };
    case RECEIVE_AUCTIONS_QUERY:
      if (action.payload === null) {
        return { ...state, queryAuctionsLevel: QueryAuctionsLevel.failure };
      }

      return {
        ...state,
        queryAuctionsLevel: QueryAuctionsLevel.success,
        queryAuctionResults: action.payload.items
      };
    case ADD_AUCTIONS_QUERY:
      return {
        ...state, selectedQueryAuctionResults: [
          ...state.selectedQueryAuctionResults,
          action.payload
        ]
      };
    case REMOVE_AUCTIONS_QUERY:
      const removedSelectedQueryAuctionResults = state
        .selectedQueryAuctionResults
        .filter((_result, i) => i !== action.payload);
      return { ...state, selectedQueryAuctionResults: removedSelectedQueryAuctionResults };
    case REQUEST_ITEMCLASSES:
      return { ...state, fetchItemClassesLevel: FetchItemClassesLevel.fetching };
    case RECEIVE_ITEMCLASSES:
      if (action.payload === null) {
        return { ...state, fetchItemClassesLevel: FetchItemClassesLevel.failure };
      }

      const itemClasses: ItemClasses = {};
      for (const itemClass of action.payload.classes) {
        const subClasses: SubItemClasses = {};
        for (const subItemClass of itemClass.subclasses) {
          subClasses[subItemClass.subclass] = subItemClass;
        }
        itemClasses[itemClass.class] = {
          class: itemClass.class,
          name: name,
          subClasses
        };
      }

      return { ...state, fetchItemClassesLevel: FetchItemClassesLevel.success, itemClasses };
    default:
      return state;
  }
};
