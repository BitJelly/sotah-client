import * as React from 'react';
import { Dialog } from '@blueprintjs/core';

import { PricelistEntry } from '@app/types/price-lists';
import CreateListDialog from '@app/containers/App/PriceLists/CreateListDialog';
import CreateEntryForm from '@app/containers/App/PriceLists/CreateEntryForm';
import ActionBar from '@app/containers/App/PriceLists/ActionBar';
import Listing from '@app/containers/App/PriceLists/Listing';

import './PriceLists.scss';

export type StateProps = {
  isAddEntryDialogOpen: boolean
};

export type DispatchProps = {
  changeIsAddEntryDialogOpen: (isDialogOpen: boolean) => void
  createEntry: (entry: PricelistEntry) => void
};

export type OwnProps = {};

export type Props = Readonly<StateProps & DispatchProps & OwnProps>;

export class PriceLists extends React.Component<Props> {
  toggleEntryDialog() {
    this.props.changeIsAddEntryDialogOpen(!this.props.isAddEntryDialogOpen);
  }

  onCreateEntryFormComplete(entry: PricelistEntry) {
    this.props.createEntry(entry);
  }

  render() {
    const { isAddEntryDialogOpen } = this.props;

    return (
      <>
        <CreateListDialog />
        <Dialog
          isOpen={isAddEntryDialogOpen}
          onClose={() => this.toggleEntryDialog()}
          title="New Entry"
          icon="manually-entered-data"
          canOutsideClickClose={false}
        >
          <CreateEntryForm onComplete={(v: PricelistEntry) => this.onCreateEntryFormComplete(v)} />
        </Dialog>
        <ActionBar />
        <Listing />
      </>
    );
  }
}
