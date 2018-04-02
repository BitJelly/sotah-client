import { connect, Dispatch } from 'react-redux';

import { RealmList, StateProps, DispatchProps, OwnProps } from '../../components/App/RealmList';
import { StoreState } from '../../types';
import { SotahClientAction } from '../../actions';

const mapStateToProps = (state: StoreState): StateProps => {
  const { fetchRealmLevel, realms } = state;
  return { fetchRealmLevel, realms };
};

const mapDispatchToProps = (dispatch: Dispatch<SotahClientAction>): DispatchProps => {
  return {};
};

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RealmList);
