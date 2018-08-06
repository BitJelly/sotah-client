import * as React from 'react';
import { Button, Menu, MenuItem, Spinner, Intent } from '@blueprintjs/core';
import {
  Select,
  ItemPredicate,
  ItemListRenderer,
  IItemListRendererProps,
  ItemRenderer,
  IItemRendererProps
} from '@blueprintjs/select';

import { IRegion, IRealms, IRealm, IUserPreferences, IProfile } from '@app/types/global';
import { FetchRealmLevel, AuthLevel } from '@app/types/main';
import { ICreatePreferencesRequestBody, UpdatePreferencesRequestBody } from '@app/api/user';
import { didRealmChange } from '@app/util';

const RealmToggleSelect = Select.ofType<IRealm>();

export type StateProps = {
  realms: IRealms
  currentRealm: IRealm | null
  fetchRealmLevel: FetchRealmLevel
  userPreferences: IUserPreferences | null
  authLevel: AuthLevel
  profile: IProfile | null
  currentRegion: IRegion | null
};

export type DispatchProps = {
  onRealmChange: (realm: IRealm) => void
  createUserPreferences: (token: string, body: ICreatePreferencesRequestBody) => void
  updateUserPreferences: (token: string, body: UpdatePreferencesRequestBody) => void
};

export type OwnProps = {};

type Props = Readonly<StateProps & DispatchProps & OwnProps>;

export class RealmToggle extends React.Component<Props> {
  componentDidUpdate(prevProps: Props) {
    const {
      currentRealm,
      authLevel,
      userPreferences,
      profile,
      createUserPreferences,
      updateUserPreferences,
      currentRegion
    } = this.props;

    if (authLevel === AuthLevel.authenticated && currentRealm !== null && currentRegion !== null) {
      let persistUserPreferences = createUserPreferences;
      if (userPreferences !== null) {
        persistUserPreferences = updateUserPreferences;
      }

      if (didRealmChange(prevProps.currentRealm, currentRealm)) {
        persistUserPreferences(profile!.token, {
          current_region: currentRegion.name,
          current_realm: currentRealm.slug
        });
      }
    }
  }

  itemPredicate: ItemPredicate<IRealm> = (query: string, item: IRealm) => {
    query = query.toLowerCase();
    return item.name.toLowerCase().indexOf(query) >= 0
      || item.battlegroup.toLowerCase().indexOf(query) >= 0;
  }

  itemRenderer: ItemRenderer<IRealm> = (realm: IRealm, { handleClick, modifiers, index }: IItemRendererProps) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }

    const { currentRealm } = this.props;
    const intent = currentRealm !== null && realm.slug === currentRealm.slug
      ? Intent.PRIMARY
      : Intent.NONE;

    return (
      <MenuItem
        key={index}
        intent={intent}
        className={modifiers.active ? 'pt-active' : ''}
        label={realm.battlegroup}
        onClick={handleClick}
        text={realm.name}
      />
    );
  }

  itemListRenderer: ItemListRenderer<IRealm> =  (params: IItemListRendererProps<IRealm>) => {
    const { items, itemsParentRef, renderItem } = params;
    const renderedItems = items.map(renderItem).filter((renderedItem) => renderedItem !== null);
    return (
      <Menu ulRef={itemsParentRef}>
        <li>
          <h6>Select Realm</h6>
        </li>
        {renderedItems}
      </Menu>
    );
  }

  render() {
    const { realms, onRealmChange, currentRealm, fetchRealmLevel } = this.props;

    switch (fetchRealmLevel) {
      case FetchRealmLevel.success:
        const items = Object.keys(realms).map((realmName) => realms[realmName]);
        let highlightedRealm = items[0];
        if (currentRealm !== null) {
          highlightedRealm = currentRealm;
        }

        return (
          <RealmToggleSelect
            items={items}
            itemRenderer={this.itemRenderer}
            itemListRenderer={this.itemListRenderer}
            itemPredicate={this.itemPredicate}
            onItemSelect={(realm: IRealm) => onRealmChange(realm)}
            resetOnSelect={true}
            resetOnClose={true}
          >
            <Button text={highlightedRealm.name} rightIcon="double-caret-vertical" />
          </RealmToggleSelect>
        );
      case FetchRealmLevel.failure:
        return <Spinner className="pt-small" intent={Intent.DANGER} value={1} />;
      case FetchRealmLevel.initial:
        return <Spinner className="pt-small" intent={Intent.NONE} value={1} />;
      case FetchRealmLevel.fetching:
      default:
        return <Spinner className="pt-small" intent={Intent.PRIMARY} />;
    }
  }
}
