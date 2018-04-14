import * as React from 'react';

import { FetchAuctionsLevel, Auction } from '../../types';

export type StateProps = {
  fetchAuctionsLevel: FetchAuctionsLevel
  auctions: Auction[]
};

export type DispatchProps = {};

export type OwnProps = {};

type Props = Readonly<StateProps & DispatchProps & OwnProps>;

export class AuctionList extends React.Component<Props> {
  renderAuction(auction: Auction, index: number) {
    return (
      <tr key={index}>
        <th>{auction.auc}</th>
        <th>{auction.ownerRealm}</th>
        <th>{auction.owner}</th>
        <th>{auction.bid}</th>
        <th>{auction.buyout}</th>
      </tr>
    );
  }

  renderAuctions() {
    const { auctions } = this.props;

    if (auctions.length === 0) {
      return 'No auctions found!';
    }
  
    return (
      <table className="pt-html-table">
        <thead>
          <tr>
            <th>Auc</th>
            <th>Realm</th>
            <th>Owner</th>
            <th>Bid</th>
            <th>Buyout</th>
          </tr>
        </thead>
        <tbody>
          {auctions.map((auction, index) => this.renderAuction(auction, index))}
        </tbody>
      </table>
    );
  }

  render() {
    switch (this.props.fetchAuctionsLevel) {
      case FetchAuctionsLevel.initial:
      case FetchAuctionsLevel.fetching:
        return <>Loading...</>;
      case FetchAuctionsLevel.failure:
        return <>Could not fetch auctions!</>;
      case FetchAuctionsLevel.success:
        return this.renderAuctions();
      default:
        return <>You should never see this!</>;
    }
  }
}
