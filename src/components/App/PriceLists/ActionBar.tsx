import * as React from 'react';
import {
  Button,
  Navbar,
  NavbarGroup,
  Alignment,
  ButtonGroup,
  Spinner,
  Intent
} from '@blueprintjs/core';

import { Region, Realm } from '@app/types/global';
import RegionToggle from '@app/containers/util/RegionToggle';
import RealmToggle from '@app/containers/util/RealmToggle';

export type StateProps = {
  currentRegion: Region | null
  currentRealm: Realm | null
  isAddListDialogOpen: boolean
};

export type DispatchProps = {
  changeIsAddListDialogOpen: (isDialogOpen: boolean) => void
};

export type OwnProps = {};

export type Props = Readonly<StateProps & DispatchProps & OwnProps>;

export class ActionBar extends React.Component<Props> {
  toggleDialog() {
    this.props.changeIsAddListDialogOpen(!this.props.isAddListDialogOpen);
  }

  renderButtons() {
    const { currentRegion, currentRealm } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return (
        <Spinner className="pt-small" intent={Intent.PRIMARY} />
      );
    }

    return (
      <Button
        icon="plus"
        onClick={() => this.toggleDialog()}
        text="List"
      />
    );
  }

  render() {
    return (
    <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
        {this.renderButtons()}
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
        <ButtonGroup>
            <RealmToggle />
            <RegionToggle />
        </ButtonGroup>
        </NavbarGroup>
    </Navbar>
    );
  }
}
