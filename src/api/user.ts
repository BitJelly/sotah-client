import * as HTTPStatus from 'http-status';

import { apiEndpoint } from './index';
import { User, Errors } from '../types/global';

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

export type ReloadUserResponse = {
  user: User | null
  error: string | null
};

export const reloadUser = async (token: string): Promise<ReloadUserResponse> => {
  const res = await fetch(`${apiEndpoint}/user`, {
    method: 'GET',
    headers: new Headers({
      'content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
  });
  if (res.status === HTTPStatus.UNAUTHORIZED) {
    return {
      user: null,
      error: 'Unauthorized'
    };
  }

  return { user: await res.json(), error: null };
};
