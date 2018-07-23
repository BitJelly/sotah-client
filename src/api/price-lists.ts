import * as HTTPStatus from 'http-status';

import { apiEndpoint } from './index';
import { RegionName, RealmSlug, ItemId, Errors } from '@app/types/global';

export type Pricelist = {
  id: number
  user_id: number
  name: string
  region: RegionName
  realm: RealmSlug
};

export type PricelistEntry = {
  id?: number
  pricelist_id: number
  item_id: ItemId
  quantity_modifier: number
};

export type CreatePricelistRequest = {
  pricelist: {
    name: string
    region: RegionName
    realm: RealmSlug
  }
  entries: {
    item_id: number
    quantity_modifier: number
  }[]
};

export type CreatePricelistResponse = {
  errors: Errors | null
  data: {
    pricelist: Pricelist
    entries: PricelistEntry[]
  } | null
};

export const createPriceList = async (request: CreatePricelistRequest): Promise<CreatePricelistResponse | null> => {
  const res = await fetch(`${apiEndpoint}/user/pricelists`, {
    method: 'POST',
    body: JSON.stringify(request),
    headers: new Headers({ 'content-type': 'application/json' })
  });
  if (res.status !== HTTPStatus.OK) {
    return { errors: await res.json(), data: null };
  }

  return { errors: null, data: await res.json() };
};