import * as HTTPStatus from 'http-status';

import { apiEndpoint } from './index';
import { RegionName, RealmSlug, Errors } from '@app/types/global';
import { Pricelist, PricelistEntry } from '@app/types/price-lists';

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
