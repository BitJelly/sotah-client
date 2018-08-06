import * as React from 'react';

import { Menu, MenuItem, Button } from '@blueprintjs/core';
import {
  Suggest,
  ItemPredicate,
  ItemListRenderer,
  IItemListRendererProps,
  ItemRenderer,
  IItemRendererProps
} from '@blueprintjs/select';

import { Item, IQueryItemResult } from '@app/types/global';
import { getItems } from '@app/api/data';
import { qualityToColorClass, getItemIconUrl, getItemTextValue } from '@app/util';

const ItemSuggest = Suggest.ofType<IQueryItemResult>();

type Props = Readonly<{
  autoFocus?: boolean
  onSelect(item: Item): void
}>;

type State = Readonly<{
  timerId: NodeJS.Timer | null
  filterValue: string
  results: IQueryItemResult[]
}>;

export class ItemInput extends React.Component<Props, State> {
  state: State = {
    timerId: null,
    filterValue: '',
    results: []
  };

  componentDidMount() {
    this.triggerQuery();
  }

  renderItemAsItemRendererText(item: Item) {
    const itemText = getItemTextValue(item);
    const itemIconUrl = getItemIconUrl(item);

    if (itemIconUrl === null) {
      return itemText;
    }

    return (
      <>
        <img src={itemIconUrl} className="item-icon" /> {itemText}
      </>
    );
  }

  renderItemRendererTextContent(item: Item) {
    if (item.id === 0) {
      return 'n/a';
    }

    return this.renderItemAsItemRendererText(item);
  }

  renderItemRendererText(item: Item) {
    return (
      <span className="item-input-menu-item">{this.renderItemRendererTextContent(item)}</span>
    );
  }

  itemRenderer: ItemRenderer<IQueryItemResult> = (
    result: IQueryItemResult,
    { handleClick, modifiers, index }: IItemRendererProps
  ) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }

    let className = modifiers.active ? 'pt-active' : '';
    const { item } = result;

    let label = 'n/a';
    if (item.name !== '') {
      label = `#${item.id}`;
      className = `${className} ${qualityToColorClass(item.quality)}`;
    }

    return (
      <MenuItem
        key={index}
        className={className}
        onClick={handleClick}
        text={this.renderItemRendererText(item)}
        label={label}
      />
    );
  }

  resolveResultTextValue(result: IQueryItemResult): string {
    if (result.item.id === 0) {
      return 'n/a';
    }

    return getItemTextValue(result.item);
  }

  onItemSelect(result: IQueryItemResult) {
    this.props.onSelect(result.item);
  }

  async triggerQuery() {
    const res = await getItems(this.state.filterValue);
    if (res === null) {
      return;
    }

    this.setState({ results: res.items });
  }

  onFilterChange(filterValue: string) {
    const { timerId } = this.state;

    if (timerId !== null) {
      clearTimeout(timerId);
    }

    const newTimerId = setTimeout(
      () => {
        (async () => {
          this.triggerQuery();
        })();
      },
      0.25 * 1000
    );
    this.setState({ filterValue, timerId: newTimerId });
  }

  renderClearButton() {
    const { filterValue } = this.state;
    if (filterValue === null || filterValue === '') {
      return;
    }

    return (
      <Button
        icon="cross"
        className="pt-minimal"
        onClick={() => {
          this.setState({ filterValue: '' }, () => this.triggerQuery());
        }}
      />
    );
  }

  itemPredicate: ItemPredicate<IQueryItemResult> = (_: string, result: IQueryItemResult) => {
    return result.rank > -1;
  }

  itemListRenderer: ItemListRenderer<IQueryItemResult> = (params: IItemListRendererProps<IQueryItemResult>) => {
    const { items, itemsParentRef, renderItem } = params;
    const renderedItems = items.map(renderItem).filter((renderedItem) => renderedItem !== null);
    if (renderedItems.length === 0) {
      return (
        <Menu ulRef={itemsParentRef}>
          <li>
            <h6>Queried Results</h6>
          </li>
          <li><em>No results found.</em></li>
        </Menu>
      );
    }

    return (
      <Menu ulRef={itemsParentRef} className="item-input-menu">
        <li>
          <h6>Queried Results</h6>
        </li>
        {renderedItems}
      </Menu>
    );
  }

  render() {
    const { autoFocus } = this.props;
    const { results, filterValue } = this.state;

    return (
      <ItemSuggest
        inputValueRenderer={(v) => this.resolveResultTextValue(v)}
        itemRenderer={this.itemRenderer}
        items={results}
        onItemSelect={(result: IQueryItemResult) => { this.onItemSelect(result); }}
        closeOnSelect={true}
        inputProps={{
          value: filterValue,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => this.onFilterChange(e.target.value),
          type: 'search',
          leftIcon: 'search',
          rightElement: this.renderClearButton(),
          className: 'pt-fill',
          autoFocus: autoFocus
        }}
        itemPredicate={this.itemPredicate}
        itemListRenderer={this.itemListRenderer}
      />
    );
  }
}