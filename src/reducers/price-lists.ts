import {
  PriceListsState,
  CreatePricelistLevel,
  UpdatePricelistLevel,
  GetPricelistsLevel,
  defaultPriceListsState
} from '@app/types/price-lists';
import {
  REQUEST_CREATE_PRICELIST, RECEIVE_CREATE_PRICELIST,
  REQUEST_UPDATE_PRICELIST, RECEIVE_UPDATE_PRICELIST,
  REQUEST_GET_PRICELISTS, RECEIVE_GET_PRICELISTS,
  CHANGE_ENTRY_CREATELEVEL,
  CHANGE_SELECTED_LIST,
  CHANGE_IS_ADD_LIST_DIALOG_OPEN, CHANGE_IS_ADD_ENTRY_DIALOG_OPEN, CHANGE_IS_EDIT_LIST_DIALOG_OPEN,
  REQUEST_DELETE_PRICELIST, RECEIVE_DELETE_PRICELIST,
  PriceListsActions
} from '@app/actions/price-lists';

type State = Readonly<PriceListsState> | undefined;

export const priceLists = (state: State, action: PriceListsActions): State => {
  if (state === undefined) {
    return defaultPriceListsState;
  }

  switch (action.type) {
    case REQUEST_CREATE_PRICELIST:
      return { ...state, createPricelistLevel: CreatePricelistLevel.fetching };
    case RECEIVE_CREATE_PRICELIST:
      if (action.payload.errors !== null) {
        return {
          ...state,
          createPricelistLevel: CreatePricelistLevel.failure,
          createPricelistErrors: action.payload.errors
        };
      }

      return {
        ...state,
        createPricelistLevel: CreatePricelistLevel.success,
        createPricelistErrors: {},
        isAddListDialogOpen: false
      };
    case REQUEST_UPDATE_PRICELIST:
      return { ...state, updatePricelistLevel: UpdatePricelistLevel.fetching };
    case RECEIVE_UPDATE_PRICELIST:
      if (action.payload.response.errors !== null) {
        return {
          ...state,
          updatePricelistLevel: UpdatePricelistLevel.failure,
          updatePricelistErrors: action.payload.response.errors
        };
      }

      const { pricelists: receiveUpdatePricelists } = state;
      let replacedIndex = -1;
      for (let i = 0; i < receiveUpdatePricelists.length; i++) {
        const pricelist = receiveUpdatePricelists[i];
        if (pricelist.id === action.payload.response.data!.pricelist.id) {
          replacedIndex = i;

          break;
        }
      }

      const replacedPricelist = action.payload.response.data!.pricelist;
      replacedPricelist.pricelist_entries = action.payload.response.data!.entries;

      return {
        ...state,
        ...action.payload.meta,
        updatePricelistLevel: UpdatePricelistLevel.success,
        updatePricelistErrors: {},
        pricelists: [
          ...receiveUpdatePricelists.splice(0, replacedIndex),
          replacedPricelist,
          ...receiveUpdatePricelists.splice(replacedIndex + 1)
        ],
        selectedList: replacedPricelist
      };
    case REQUEST_DELETE_PRICELIST:
      return { ...state };
    case RECEIVE_DELETE_PRICELIST:
      return { ...state };
    case REQUEST_GET_PRICELISTS:
      return {
        ...state,
        getPricelistsLevel: GetPricelistsLevel.fetching
      };
    case RECEIVE_GET_PRICELISTS:
      return {
        ...state,
        pricelists: action.payload.pricelists,
        getPricelistsLevel: GetPricelistsLevel.success
      };
    case CHANGE_ENTRY_CREATELEVEL:
      return { ...state, entryCreateLevel: action.payload };
    case CHANGE_SELECTED_LIST:
      return { ...state, selectedList: action.payload };
    case CHANGE_IS_ADD_LIST_DIALOG_OPEN:
      return { ...state, isAddListDialogOpen: action.payload };
    case CHANGE_IS_EDIT_LIST_DIALOG_OPEN:
      return { ...state, isEditListDialogOpen: action.payload };
    case CHANGE_IS_ADD_ENTRY_DIALOG_OPEN:
      return { ...state, isAddEntryDialogOpen: action.payload };
    default:
      return state;
  }
};
