import * as React from 'react';
import { Dialog, NonIdealState, Button } from '@blueprintjs/core';

import { Profile } from '@app/types/global';
import { AuthLevel } from '@app/types/main';
import {
  PricelistEntry,
  UpdatePricelistLevel,
  Pricelist,
  UpdatePricelistRequestOptions
} from '@app/types/price-lists';
import CreateListDialog from '@app/containers/App/PriceLists/CreateListDialog';
import ListForm from '@app/containers/App/PriceLists/util/ListForm';
import CreateEntryForm from '@app/containers/App/PriceLists/util/CreateEntryForm';
import ActionBar from '@app/containers/App/PriceLists/ActionBar';
import Listing from '@app/containers/App/PriceLists/Listing';

import './PriceLists.scss';

export type StateProps = {
  isAddEntryDialogOpen: boolean
  authLevel: AuthLevel
  updatePricelistLevel: UpdatePricelistLevel
  selectedList: Pricelist | null
  profile: Profile | null
  isEditListDialogOpen: boolean
};

export type DispatchProps = {
  changeIsAddEntryDialogOpen: (isDialogOpen: boolean) => void
  updatePricelist: (opts: UpdatePricelistRequestOptions) => void
  changeIsLoginDialogOpen: (isLoginDialogOpen: boolean) => void
  changeIsEditListDialogOpen: (isDialogOpen: boolean) => void
};

export type OwnProps = {};

export type Props = Readonly<StateProps & DispatchProps & OwnProps>;

export class PriceLists extends React.Component<Props> {
  toggleEntryDialog() {
    this.props.changeIsAddEntryDialogOpen(!this.props.isAddEntryDialogOpen);
  }

  toggleEditListDialog() {
    this.props.changeIsEditListDialogOpen(!this.props.isEditListDialogOpen);
  }

  onCreateEntryFormComplete(entry: PricelistEntry) {
    const { selectedList, updatePricelist, profile } = this.props;
    updatePricelist({
      request: {
        token: profile!.token,
        pricelist: selectedList!,
        entries: [
          ...selectedList!.pricelist_entries!,
          entry
        ]
      },
      meta: { isAddEntryDialogOpen: false }
    });
  }

  onEditListFormComplete(name: string) {
    const { selectedList, updatePricelist, profile } = this.props;
    updatePricelist({
      request: {
        token: profile!.token,
        pricelist: { ...selectedList!, name },
        entries: selectedList!.pricelist_entries!
      },
      meta: { isEditListDialogOpen: false }
    });
  }

  render() {
    const {
      isAddEntryDialogOpen,
      authLevel,
      changeIsLoginDialogOpen,
      updatePricelistLevel,
      isEditListDialogOpen,
      selectedList
    } = this.props;

    if (authLevel !== AuthLevel.authenticated) {
      return (
        <NonIdealState
          title="Unauthenticated"
          description="Please log in to use price-lists."
          visual="list"
          action={<Button
            onClick={() => changeIsLoginDialogOpen(true)}
            type="button"
            icon="log-in"
            text="Login"
          />}
        />
      );
    }

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
          <CreateEntryForm
            onComplete={(v: PricelistEntry) => this.onCreateEntryFormComplete(v)}
            isSubmitDisabled={updatePricelistLevel === UpdatePricelistLevel.fetching}
          />
        </Dialog>
        <Dialog
          isOpen={isEditListDialogOpen}
          onClose={() => this.toggleEditListDialog()}
          title="Edit List"
          icon="manually-entered-data"
        >
          <ListForm
            onComplete={(name: string) => this.onEditListFormComplete(name)}
            defaultName={selectedList !== null ? selectedList.name : ''}
          />
        </Dialog>
        <ActionBar />
        <Listing />
      </>
    );
  }
}
