import { connect, Dispatch } from "react-redux";

import { Actions } from "@app/actions";
import {
    ChangeSelectedExpansion,
    ChangeSelectedList,
    ChangeSelectedProfession,
    FetchGetPricelists,
    FetchGetProfessionPricelists,
    ResetProfessionsSelections,
} from "@app/actions/price-lists";
import { IGetPricelistsOptions, IGetProfessionPricelistsRequestOptions } from "@app/api/price-lists";
import { IDispatchProps, IStateProps, PricelistTree } from "@app/components/App/PriceLists/PricelistTree";
import { IStoreState } from "@app/types";
import { IProfession } from "@app/types/global";
import { IPricelist, ISelectExpansionPayload } from "@app/types/price-lists";

const mapStateToProps = (state: IStoreState): IStateProps => {
    const {
        currentRealm,
        professions,
        currentRegion,
        expansions,
        authLevel,
        fetchUserPreferencesLevel,
        profile,
    } = state.Main;
    const {
        pricelists,
        selectedList,
        selectedProfession,
        getProfessionPricelistsLevel,
        professionPricelists,
        selectedExpansion,
        items,
    } = state.PriceLists;
    return {
        authLevel,
        currentRealm,
        currentRegion,
        expansions,
        fetchUserPreferencesLevel,
        getProfessionPricelistsLevel,
        items,
        pricelists,
        professionPricelists,
        professions,
        profile,
        selectedExpansion,
        selectedList,
        selectedProfession,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>): IDispatchProps => {
    return {
        changeSelectedExpansion: (v: ISelectExpansionPayload) => dispatch(ChangeSelectedExpansion(v)),
        changeSelectedList: (selectedList: IPricelist) => dispatch(ChangeSelectedList(selectedList)),
        changeSelectedProfession: (profession: IProfession) => dispatch(ChangeSelectedProfession(profession)),
        refreshPricelists: (opts: IGetPricelistsOptions) => dispatch(FetchGetPricelists(opts)),
        refreshProfessionPricelists: (opts: IGetProfessionPricelistsRequestOptions) =>
            dispatch(FetchGetProfessionPricelists(opts)),
        resetProfessionsSelections: () => dispatch(ResetProfessionsSelections()),
    };
};

export const PricelistTreeContainer = connect<IStateProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(PricelistTree);
