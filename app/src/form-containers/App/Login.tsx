import { withFormik, WithFormikConfig } from 'formik';
import * as Yup from 'yup';

import { FormValues, Login } from '@app/components/App/Login';
import { loginUser } from '@app/api/user';
import { IProfile } from '@app/types/global';
import { UserRules } from '@app/validator-rules';

interface FormProps {
  isLoggedIn: boolean;
  isLoginDialogOpen: boolean;
  onUserLogin: (payload: IProfile) => void;
  changeIsLoginDialogOpen: (isLoginDialogOpen: boolean) => void;
}

const config: WithFormikConfig<FormProps, FormValues> = {
  mapPropsToValues: (_: FormProps) => {
    return {
      email: '',
      password: ''
    };
  },
  validationSchema: Yup.object().shape({
    email: UserRules.email,
    password: UserRules.password
  }),
  handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
    const { profile, errors } = await loginUser(values.email, values.password);
    if (errors !== null) {
      setErrors(errors);
      setSubmitting(false);

      return;
    }

    setSubmitting(false);
    props.onUserLogin(profile!);
  }
};

export default withFormik(config)(Login);
