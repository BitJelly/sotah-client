// region types
export type RegionName = string;

export type Region = {
  name: RegionName
  hostname: string
};

export type Regions = {
  [key: string]: Region
};

// item types
export type ItemId = number;

export type Item = {
  itemId: ItemId
  name: string
};

// owner types
export type OwnerName = string;

export type Owner = {
  name: OwnerName
};

// auction types
export type Auction = {
  item: number
  owner: OwnerName
  ownerRealm: string
  bid: number
  buyout: number
  quantity: number
  timeLeft: string
  aucList: number[]
};

// error types
export type Errors = {
  [key: string]: string
};

// realm types
export type RealmSlug = string;

export type Realm = {
  regionName: string
  type: string
  population: string
  queue: boolean
  status: boolean
  name: string
  slug: RealmSlug
  battlegroup: string
  locale: string
  timezone: string
  connected_realms: RealmSlug[]
};

export type Realms = {
  [key: string]: Realm
};

// user types
export type User = {
  id: number
  email: string
};

export type Profile = {
  user: User
  token: string
};
