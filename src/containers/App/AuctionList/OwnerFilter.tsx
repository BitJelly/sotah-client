import { connect, Dispatch } from 'react-redux';

import { OwnerFilter, StateProps, DispatchProps, OwnProps } from '@app/components/App/AuctionList/OwnerFilter';
import { StoreState } from '@app/types';
import { Actions } from '@app/actions';

const mapStateToProps = (state: StoreState): StateProps => {
  const { fetchOwnersLevel } = state.Auction;
  return { fetchOwnersLevel };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
  return {};
};

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(OwnerFilter);
