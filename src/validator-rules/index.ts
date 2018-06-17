import * as Yup from 'yup';

export const UserRules = {
  email: Yup.string().email('Invalid email address').required('Email is required!'),
  password: Yup.string().required('Password is required!')
};

export const PriceListRules = {
  name: Yup.string().required('Name is required'),
  quantity: Yup.number().integer().moreThan(0, 'Quantity must be greater than zero').required('Quantity is required')
};
