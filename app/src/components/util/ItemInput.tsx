import * as React from "react";

import { Button, Classes, H6, Menu, MenuItem } from "@blueprintjs/core";
import {
    IItemListRendererProps,
    IItemRendererProps,
    ItemListRenderer,
    ItemPredicate,
    ItemRenderer,
    Suggest,
} from "@blueprintjs/select";
import { debounce } from "lodash";

import { getItems } from "@app/api/data";
import { IQueryItemResult, Item } from "@app/types/global";
import { getItemIconUrl, getItemTextValue, qualityToColorClass } from "@app/util";

const ItemSuggest = Suggest.ofType<IQueryItemResult>();

type Props = Readonly<{
    autoFocus?: boolean;
    onSelect(item: Item): void;
}>;

type State = Readonly<{
    timerId: NodeJS.Timer | null;
    results: IQueryItemResult[];
}>;

export class ItemInput extends React.Component<Props, State> {
    public state: State = {
        results: [],
        timerId: null,
    };

    private debouncedTriggerQuery = debounce((filterValue: string) => this.triggerQuery(filterValue), 0.25 * 1000);

    public componentDidMount() {
        this.triggerQuery("");
    }

    public renderItemAsItemRendererText(item: Item) {
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

    public renderItemRendererTextContent(item: Item) {
        if (item.id === 0) {
            return "n/a";
        }

        return this.renderItemAsItemRendererText(item);
    }

    public renderItemRendererText(item: Item) {
        return <span className="item-input-menu-item">{this.renderItemRendererTextContent(item)}</span>;
    }

    public itemRenderer: ItemRenderer<IQueryItemResult> = (
        result: IQueryItemResult,
        { handleClick, modifiers, index }: IItemRendererProps,
    ) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }

        let className = modifiers.active ? Classes.ACTIVE : "";
        const { item } = result;

        let label = "n/a";
        if (item.name !== "") {
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
    };

    public resolveResultTextValue(result: IQueryItemResult): string {
        if (result.item.id === 0) {
            return "n/a";
        }

        return getItemTextValue(result.item);
    }

    public onItemSelect(result: IQueryItemResult) {
        this.props.onSelect(result.item);
    }

    public async triggerQuery(filterValue: string) {
        const res = await getItems(filterValue);
        if (res === null) {
            return;
        }

        this.setState({ results: res.items });
    }

    public renderClearButton() {
        return <Button icon="cross" className={Classes.MINIMAL} onClick={() => this.triggerQuery("")} />;
    }

    public itemPredicate: ItemPredicate<IQueryItemResult> = (_: string, result: IQueryItemResult) => {
        return result.rank > -1;
    };

    public itemListRenderer: ItemListRenderer<IQueryItemResult> = (
        params: IItemListRendererProps<IQueryItemResult>,
    ) => {
        const { items, itemsParentRef, renderItem } = params;
        const renderedItems = items.map(renderItem).filter(renderedItem => renderedItem !== null);
        if (renderedItems.length === 0) {
            return (
                <Menu ulRef={itemsParentRef}>
                    <li>
                        <H6>Queried Results</H6>
                    </li>
                    <li>
                        <em>No results found.</em>
                    </li>
                </Menu>
            );
        }

        return (
            <Menu ulRef={itemsParentRef} className="item-input-menu">
                <li>
                    <H6>Queried Results</H6>
                </li>
                {renderedItems}
            </Menu>
        );
    };

    public render() {
        const { autoFocus, onSelect } = this.props;
        const { results } = this.state;

        return (
            <ItemSuggest
                inputValueRenderer={this.resolveResultTextValue}
                itemRenderer={this.itemRenderer}
                items={results}
                onItemSelect={v => onSelect(v.item)}
                closeOnSelect={true}
                onQueryChange={this.debouncedTriggerQuery}
                inputProps={{
                    autoFocus,
                    className: Classes.FILL,
                    leftIcon: "search",
                    rightElement: this.renderClearButton(),
                    type: "search",
                }}
                itemPredicate={this.itemPredicate}
                itemListRenderer={this.itemListRenderer}
            />
        );
    }
}
