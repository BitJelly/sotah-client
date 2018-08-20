import { ExpansionName, IExpansion, IProfessionPricelist } from "@app/types/global";
import {
    DeletePricelistLevel,
    IExpansionProfessionPricelistMap,
    IPricelist,
    IPriceListsState,
} from "@app/types/price-lists";

export const getPricelistIndex = (pricelists: IPricelist[], id: number): number => {
    for (let i = 0; i < pricelists.length; i++) {
        const pricelist = pricelists[i];
        if (pricelist.id === id) {
            return i;
        }
    }

    return -1;
};

export const getProfessionPricelistIndex = (professionPricelists: IProfessionPricelist[], id: number): number => {
    for (let i = 0; i < professionPricelists.length; i++) {
        const professionPricelist = professionPricelists[i];
        if (professionPricelist.pricelist_id === id) {
            return i;
        }
    }

    return -1;
};

export const formatProfessionPricelists = (
    professionPricelists: IProfessionPricelist[],
): IExpansionProfessionPricelistMap => {
    return professionPricelists.reduce((result: IExpansionProfessionPricelistMap, v: IProfessionPricelist) => {
        if (!(v.expansion in result)) {
            result[v.expansion] = [];
        }

        result[v.expansion].push(v);

        return result;
    }, {});
};

export const getFirstExpansionPricelist = (
    expansion: IExpansion,
    pricelistMap: IExpansionProfessionPricelistMap,
): IPricelist | null => {
    if (!(expansion.name in pricelistMap)) {
        return null;
    }

    return pricelistMap[expansion.name][0].pricelist!;
};

export const getProfessionPricelist = (state: IPriceListsState, pricelist: IPricelist): IProfessionPricelist | null => {
    for (const expansionName of Object.keys(state.professionPricelists)) {
        const professionPricelists = state.professionPricelists[expansionName];
        for (const professionPricelist of professionPricelists) {
            if (professionPricelist.pricelist_id === pricelist.id) {
                return professionPricelist;
            }
        }
    }

    return null;
};

interface IDeleteSearchResult {
    index: number;
    expansion: ExpansionName;
}

export const handleDeleteProfessionPricelistSuccess = (
    state: IPriceListsState,
    pricelistId: number,
): IPriceListsState => {
    const stateProfessionPricelists = { ...state.professionPricelists };
    const searchResult: IDeleteSearchResult | null = Object.keys(stateProfessionPricelists).reduce(
        (result: IDeleteSearchResult | null, expansionName) => {
            const professionPricelists = stateProfessionPricelists[expansionName];
            for (let i = 0; i < professionPricelists.length; i++) {
                const professionPricelist = professionPricelists[i];
                if (professionPricelist.pricelist_id === pricelistId) {
                    return { index: Number(i), expansion: expansionName };
                }
            }

            return result;
        },
        null,
    );
    if (searchResult === null) {
        return { ...state, deletePricelistLevel: DeletePricelistLevel.failure };
    }

    const { expansion, index: deletedIndex } = searchResult;
    let onDeletePricelist = [
        ...stateProfessionPricelists[expansion].slice(0, deletedIndex),
        ...stateProfessionPricelists[expansion].slice(deletedIndex + 1),
    ];
    if (deletedIndex === 0) {
        onDeletePricelist = stateProfessionPricelists[expansion].slice(1);
    }
    stateProfessionPricelists[expansion] = onDeletePricelist;

    let onDeleteSelectedList: IPricelist | null = null;
    if (stateProfessionPricelists[expansion].length > 0) {
        const isLastDeleted = deletedIndex === onDeletePricelist.length;
        onDeleteSelectedList = isLastDeleted
            ? onDeletePricelist[deletedIndex - 1].pricelist!
            : onDeletePricelist[deletedIndex].pricelist!;
    }

    return {
        ...state,
        deletePricelistLevel: DeletePricelistLevel.success,
        isDeleteListDialogOpen: false,
        professionPricelists: stateProfessionPricelists,
        selectedList: onDeleteSelectedList,
    };
};
