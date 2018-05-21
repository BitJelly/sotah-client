import * as React from 'react';
import { ButtonGroup, Spinner, Intent, Navbar, NavbarGroup, Alignment, NavbarDivider } from '@blueprintjs/core';

import RegionToggle from '@app/containers/App/AuctionList/RegionToggle';
import RealmToggle from '@app/containers/App/AuctionList/RealmToggle';
import CountToggle from '@app/containers/App/AuctionList/CountToggle';
import SortToggle from '@app/containers/App/AuctionList/SortToggle';
import QueryAuctionsFilter from '@app/containers/App/AuctionList/QueryAuctionsFilter';
import { Auction, Region, Realm } from '@app/types/global';
import { FetchPingLevel } from '@app/types/main';
import {
  FetchRegionLevel,
  FetchRealmLevel,
  FetchAuctionsLevel,
  SortKind,
  SortDirection,
  QueryAuctionsLevel,
  QueryAuctionResult
} from '@app/types/auction';
import { GetAuctionsOptions, QueryAuctionsOptions } from '@app/api/data';
import { Currency, Pagination } from '../util';

type ListAuction = Auction | null;

export type StateProps = {
  fetchPingLevel: FetchPingLevel
  fetchRegionLevel: FetchRegionLevel
  currentRegion: Region | null
  fetchRealmLevel: FetchRealmLevel
  currentRealm: Realm | null
  fetchAuctionsLevel: FetchAuctionsLevel
  auctions: ListAuction[]
  currentPage: number
  auctionsPerPage: number
  totalResults: number
  sortKind: SortKind
  sortDirection: SortDirection
  queryAuctionsLevel: QueryAuctionsLevel
  selectedQueryAuctionResults: QueryAuctionResult[]
};

export type DispatchProps = {
  refreshRegions: () => void
  refreshRealms: (region: Region) => void
  refreshAuctions: (opts: GetAuctionsOptions) => void
  setCurrentPage: (page: number) => void
  refreshAuctionsQuery: (opts: QueryAuctionsOptions) => void
};

export type OwnProps = {};

type Props = Readonly<StateProps & DispatchProps & OwnProps>;

export class AuctionList extends React.Component<Props> {
  didRegionChange(prevRegion: Region | null, currentRegion: Region): boolean {
    if (prevRegion === null) {
      return true;
    }

    if (prevRegion.name === currentRegion.name) {
      return false;
    }

    return true;
  }

  didRealmChange(prevRealm: Realm | null, currentRealm: Realm): boolean {
    if (prevRealm === null) {
      return true;
    }

    if (prevRealm.regionName === currentRealm.regionName && prevRealm.slug === currentRealm.slug) {
      return false;
    }

    return true;
  }

  componentDidMount() {
    const {
      fetchPingLevel,
      fetchRegionLevel
    } = this.props;

    if (fetchPingLevel === FetchPingLevel.success && fetchRegionLevel === FetchRegionLevel.initial) {
      this.props.refreshRegions();

      return;
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {
      fetchRealmLevel,
      fetchAuctionsLevel,
      currentRegion,
      currentRealm,
      currentPage,
      auctionsPerPage,
      sortDirection,
      sortKind,
      selectedQueryAuctionResults
    } = this.props;

    if (currentRegion !== null) {
      const shouldRefreshRealms = fetchRealmLevel === FetchRealmLevel.initial
        || fetchRealmLevel === FetchRealmLevel.success
        && this.didRegionChange(prevProps.currentRegion, currentRegion);
      if (shouldRefreshRealms) {
        this.props.refreshRealms(currentRegion);
      }
    }

    if (currentRegion !== null && currentRealm !== null) {
      const didPageChange = currentPage !== prevProps.currentPage;
      const didCountChange = auctionsPerPage !== prevProps.auctionsPerPage;
      const didSortChange = prevProps.sortDirection !== sortDirection
        || prevProps.sortKind !== this.props.sortKind;
      const didSqaResultsChange = prevProps.selectedQueryAuctionResults.length
        !== selectedQueryAuctionResults.length;
      const shouldRefreshAuctions = fetchAuctionsLevel === FetchAuctionsLevel.initial
        || fetchAuctionsLevel === FetchAuctionsLevel.success
        && (this.didRealmChange(prevProps.currentRealm, currentRealm)
          || didPageChange
          || didCountChange
          || didSortChange
          || didSqaResultsChange);

      if (shouldRefreshAuctions) {
        this.props.refreshAuctions({
          regionName: currentRegion.name,
          realmSlug: currentRealm.slug,
          page: currentPage,
          count: auctionsPerPage,
          sortDirection,
          sortKind
        });
      }

      const shouldRefreshAuctionsQuery = this.didRealmChange(prevProps.currentRealm, currentRealm);
      if (shouldRefreshAuctionsQuery) {
        this.props.refreshAuctionsQuery({
          regionName: currentRegion.name,
          realmSlug: currentRealm.slug,
          query: ''
        });
      }
    }
  }

  renderRefetchingSpinner() {
    const { fetchAuctionsLevel } = this.props;
    if (fetchAuctionsLevel !== FetchAuctionsLevel.refetching) {
      return null;
    }

    return (
      <Spinner className="pt-small" intent={Intent.PRIMARY} />
    );
  }

  renderAuction(auction: Auction | null, index: number) {
    if (auction === null) {
      return (
        <tr key={index}>
          <td>---</td>
          <td>---</td>
          <td>---</td>
          <td>---</td>
          <td>---</td>
          <td>---</td>
        </tr>
      );
    }

    return (
      <tr key={index}>
        <td>{auction.item}</td>
        <td>{auction.quantity}</td>
        <td><Currency amount={auction.bid} /></td>
        <td><Currency amount={auction.buyout} /></td>
        <td>{auction.aucList.length}</td>
        <td>{auction.owner}</td>
      </tr>
    );
  }

  renderAuctionTable() {
    const { auctions } = this.props;

    if (auctions.length === 0) {
      return (
        <p style={{marginTop: '10px'}}><em>No auctions found!</em></p>
      );
    }

    return (
      <table className="pt-html-table pt-html-table-bordered pt-small auction-list">
        <thead>
          <tr>
            <th><SortToggle label="Item" sortKind={SortKind.item} /></th>
            <th><SortToggle label="Quantity" sortKind={SortKind.quantity} /></th>
            <th><SortToggle label="Bid" sortKind={SortKind.bid} /></th>
            <th><SortToggle label="Buyout" sortKind={SortKind.buyout} /></th>
            <th><SortToggle label="Auctions" sortKind={SortKind.auctions} /></th>
            <th><SortToggle label="Owner" sortKind={SortKind.owner} /></th>
          </tr>
        </thead>
        <tbody>
          {auctions.map((auction, index) => this.renderAuction(auction, index))}
        </tbody>
      </table>
    );
  }

  renderAuctions() {
    const { auctions, totalResults, auctionsPerPage, currentPage } = this.props;

    let pageCount = 0;
    if (totalResults > 0) {
      if (auctionsPerPage === 10 && auctions.length < auctionsPerPage) {
        for (let i = auctions.length; i < auctionsPerPage; i++) {
          auctions[i] = null;
        }
      }

      pageCount = (totalResults / auctionsPerPage) - 1;
      const remainder = totalResults % auctionsPerPage;
      if (remainder > 0) {
        pageCount = (totalResults - remainder) / auctionsPerPage;
      }
    }

    return (
      <>
        <Navbar>
          <NavbarGroup align={Alignment.LEFT}>
            <QueryAuctionsFilter />
          </NavbarGroup>
        </Navbar>
        <Navbar>
          <NavbarGroup align={Alignment.LEFT}>
            <CountToggle />
            <NavbarDivider />
            <Pagination
              pageCount={pageCount}
              currentPage={currentPage}
              pagesShown={5}
              onPageChange={(page) => this.props.setCurrentPage(page)}
            />
            {this.renderRefetchingSpinner()}
          </NavbarGroup>
          <NavbarGroup align={Alignment.RIGHT}>
            <ButtonGroup>
              <RealmToggle />
              <RegionToggle />
            </ButtonGroup>
          </NavbarGroup>
        </Navbar>
        {this.renderAuctionTable()}
      </>
    );
  }

  render() {
    switch (this.props.fetchAuctionsLevel) {
      case FetchAuctionsLevel.initial:
      case FetchAuctionsLevel.fetching:
        return <>Loading...</>;
      case FetchAuctionsLevel.failure:
        return <>Could not fetch auctions!</>;
      case FetchAuctionsLevel.refetching:
      case FetchAuctionsLevel.success:
        return this.renderAuctions();
      default:
        return <>You should never see this!</>;
    }
  }
}
