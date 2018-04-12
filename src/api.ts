import * as HTTPStatus from 'http-status';
import { Region, Realm, User, Errors } from './types';

export const apiEndpoint = 'http://localhost:8080';

export const getPing = async (): Promise<boolean> => {
  try {
    await fetch(`${apiEndpoint}/ping`);
    return true;
  } catch (err) {
    return false;
  }
};

export const getRegions = async (): Promise<Region[]> => {
  return await (await fetch(`${apiEndpoint}/regions`)).json();
};

export const getStatus = async (regionName: string): Promise<Realm[] | null> => {
  const res = await fetch(`${apiEndpoint}/status/${regionName}`);
  if (res.status !== HTTPStatus.OK) {
    return null;
  }

  return (await res.json()).realms;
};

export type RegisterUserResponse = {
  profile: {
    user: User
    token: string
  } | null
  errors: Errors | null
};

export const registerUser = async (email: string, password: string): Promise<RegisterUserResponse> => {
  const res = await fetch(`${apiEndpoint}/users`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: new Headers({ 'content-type': 'application/json' })
  });
  if (res.status === HTTPStatus.BAD_REQUEST) {
    return {
      profile: null,
      errors: await res.json()
    };
  }

  return { profile: await res.json(), errors: null };
};

export type LoginUserResponse = RegisterUserResponse;

export const loginUser = async (email: string, password: string): Promise<LoginUserResponse> => {
  const res = await fetch(`${apiEndpoint}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: new Headers({ 'content-type': 'application/json' })
  });
  if (res.status === HTTPStatus.BAD_REQUEST) {
    return {
      profile: null,
      errors: await res.json()
    };
  }

  return { profile: await res.json(), errors: null };
};
