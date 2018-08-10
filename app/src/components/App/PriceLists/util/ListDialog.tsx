import * as React from "react";

import { Button, Classes, Dialog, HTMLTable, Intent } from "@blueprintjs/core";

import { DialogActions, DialogBody, ErrorList, PanelHeader } from "@app/components/util";
import { ItemPopoverContainer } from "@app/containers/util/ItemPopover";
import { CreateEntryFormFormContainer } from "@app/form-containers/App/PriceLists/util/CreateEntryForm";
import { ListFormFormContainer } from "@app/form-containers/App/PriceLists/util/ListForm";
import { IErrors, Item, ItemId, ItemsMap } from "@app/types/global";
import { IPricelistEntry, ListDialogStep, MutatePricelistLevel } from "@app/types/price-lists";

interface IOnCompleteOptions {
    name: string;
    entries: Array<{
        id?: number;
        item_id: number;
        quantity_modifier: number;
    }>;
    items: ItemsMap;
}

export interface IStateProps {
    items: ItemsMap;
}

export interface IOwnProps {
    isOpen: boolean;
    title: string;
    mutationErrors: IErrors;
    mutatePricelistLevel: MutatePricelistLevel;
    resetTrigger: number;
    defaultName?: string;
    defaultEntries?: IPricelistEntry[];

    onClose: () => void;
    onComplete: (opts: IOnCompleteOptions) => void;
}

export type Props = Readonly<IOwnProps & IStateProps>;

type State = Readonly<{
    listDialogStep: ListDialogStep;
    listName: string;
    entries: IPricelistEntry[];
    entriesItems: ItemsMap;
}>;

export class ListDialog extends React.Component<Props, State> {
    public state = {
        entries: [],
        entriesItems: {},
        listDialogStep: ListDialogStep.list,
        listName: "",
    };

    public componentDidMount() {
        const { defaultName, defaultEntries } = this.props;
        let listName = "";
        if (defaultName) {
            listName = defaultName;
        }
        let entries: IPricelistEntry[] = [];
        if (defaultEntries) {
            entries = defaultEntries;
        }

        this.setState({ listName, entries });
    }

    public componentDidUpdate(prevProps: Props) {
        const { resetTrigger, defaultName, defaultEntries } = this.props;

        if (prevProps.resetTrigger !== resetTrigger) {
            this.setState({
                entries: defaultEntries || [],
                entriesItems: {},
                listDialogStep: ListDialogStep.list,
                listName: defaultName || "",
            });
        }
    }

    public render() {
        const { isOpen, onClose, title } = this.props;

        return (
            <Dialog
                isOpen={isOpen}
                onClose={onClose}
                title={title}
                icon="manually-entered-data"
                canOutsideClickClose={false}
            >
                {this.renderListForm()}
                {this.renderCreateEntryForm()}
                {this.renderFinish()}
            </Dialog>
        );
    }

    private onNavClick(listDialogStep: ListDialogStep) {
        this.setState({ listDialogStep });
    }

    private renderNavHeader() {
        const { listDialogStep, entries } = this.state;

        switch (listDialogStep) {
            case ListDialogStep.list:
                return <PanelHeader title="List" />;
            case ListDialogStep.entry:
                return (
                    <PanelHeader
                        title="Entry"
                        prev={{ onClick: () => this.onNavClick(ListDialogStep.list), title: "List" }}
                        next={{
                            disabled: entries.length === 0,
                            onClick: () => this.onNavClick(ListDialogStep.finish),
                            title: "Finish",
                        }}
                    />
                );
            case ListDialogStep.finish:
                return (
                    <PanelHeader
                        title="Finish"
                        prev={{ onClick: () => this.onNavClick(ListDialogStep.entry), title: "Entry" }}
                    />
                );
            default:
                return;
        }
    }

    private renderNav() {
        return (
            <div className={Classes.PANEL_STACK_HEADER} style={{ marginBottom: "10px" }}>
                {this.renderNavHeader()}
            </div>
        );
    }

    private onListFormComplete(listName: string) {
        const listDialogStep = this.state.entries.length === 0 ? ListDialogStep.entry : ListDialogStep.finish;
        this.setState({ listDialogStep, listName });
    }

    private renderListForm() {
        const { defaultName } = this.props;
        const { listDialogStep, listName } = this.state;

        if (listDialogStep !== ListDialogStep.list) {
            return;
        }

        return (
            <ListFormFormContainer
                onComplete={v => this.onListFormComplete(v)}
                submitIcon="caret-right"
                submitText="Next"
                defaultName={listName || defaultName}
            >
                {this.renderNav()}
            </ListFormFormContainer>
        );
    }

    private onCreateEntryFormComplete(v: IPricelistEntry, item: Item) {
        const entriesItems = this.state.entriesItems;
        entriesItems[item.id] = item;
        this.setState({ entriesItems: { ...entriesItems } });

        this.setState({
            entries: [...this.state.entries, v],
            listDialogStep: ListDialogStep.finish,
        });
    }

    private renderCreateEntryForm() {
        const { listDialogStep } = this.state;

        if (listDialogStep !== ListDialogStep.entry) {
            return;
        }

        return (
            <CreateEntryFormFormContainer onComplete={(v, item) => this.onCreateEntryFormComplete(v, item)}>
                {this.renderNav()}
            </CreateEntryFormFormContainer>
        );
    }

    private removeEntryAtIndex(index: number) {
        const { entries } = this.state;

        this.setState({ entries: [...entries.splice(0, index), ...entries.splice(index + 1)] });
    }

    private getItem(id: ItemId) {
        const { items } = this.props;
        const { entriesItems } = this.state;

        if (id in items) {
            return items[id];
        }

        if (id in entriesItems) {
            return entriesItems[id];
        }

        return null;
    }

    private renderItemPopover(item: Item | null) {
        if (item === null) {
            return;
        }

        return <ItemPopoverContainer item={item} />;
    }

    private renderEntry(index: number, entry: IPricelistEntry) {
        return (
            <tr key={index}>
                <td>{this.renderItemPopover(this.getItem(entry.item_id))}</td>
                <td>x{entry.quantity_modifier}</td>
                <td style={{ textAlign: "center" }}>
                    <Button minimal={true} icon="delete" onClick={() => this.removeEntryAtIndex(index)} />
                </td>
            </tr>
        );
    }

    private onFinishClick() {
        const { listName: name, entries, entriesItems: items } = this.state;
        const { onComplete } = this.props;

        onComplete({ entries, name, items });
    }

    private renderEntries() {
        const { entries } = this.state;

        if (entries.length > 0) {
            return (
                <HTMLTable
                    className={`${Classes.HTML_TABLE} ${Classes.HTML_TABLE_BORDERED} ${
                        Classes.SMALL
                    } list-dialog-table`}
                >
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>{entries.map((v, i) => this.renderEntry(i, v))}</tbody>
                </HTMLTable>
            );
        }

        return <ErrorList errors={{ entries: "There must be >1 entries." }} />;
    }

    private renderFinish() {
        const { listDialogStep, listName, entries } = this.state;
        const { mutatePricelistLevel, mutationErrors } = this.props;

        if (listDialogStep !== ListDialogStep.finish) {
            return;
        }

        return (
            <>
                <DialogBody>
                    {this.renderNav()}
                    {this.renderEntries()}
                    <ErrorList errors={mutationErrors} />
                </DialogBody>
                <DialogActions>
                    <Button
                        text="Add More Entries"
                        intent={Intent.NONE}
                        onClick={() => this.setState({ listDialogStep: ListDialogStep.entry })}
                        icon="caret-left"
                    />
                    <Button
                        text={`Finish "${listName}"`}
                        intent={Intent.PRIMARY}
                        disabled={mutatePricelistLevel === MutatePricelistLevel.fetching || entries.length === 0}
                        onClick={() => this.onFinishClick()}
                        icon="edit"
                    />
                </DialogActions>
            </>
        );
    }
}
