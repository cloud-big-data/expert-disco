import { ButtonPrimary } from 'components/ui/Buttons';
import React, { useContext, useReducer, useState } from 'react';
import InputField from 'components/ui/InputField';
import { Helper, DangerText } from 'components/ui/Typography';
import { Link, useHistory } from 'react-router-dom';
import { IReducerAction } from 'types';
import * as EmailValidator from 'email-validator';
import skyvueFetch from 'services/skyvueFetch';
import userContext from 'contexts/userContext';
import parseJWT from 'lib/parseJWT';
import { formErrors } from './user_actions_utils';
import { UserContainer } from './styles';

interface ISignupFormState {
  firstName: {
    error: boolean;
    value: string;
  };
  lastName: {
    error: boolean;
    value: string;
  };
  email: {
    error: boolean;
    value: string;
    invalid?: true;
  };
  password: {
    error: boolean;
    value: string;
  };
  phone?: {
    error: boolean;
    value: number;
  };
}

const signUpFormReducer = (state: ISignupFormState, action: IReducerAction<any>) => {
  const { type, payload } = action;
  switch (type) {
    case 'FIRST_NAME':
      return {
        ...state,
        firstName: {
          error: payload.error ?? false,
          value: payload.value,
        },
      };
    case 'LAST_NAME':
      return {
        ...state,
        lastName: {
          error: payload.error ?? false,
          value: payload.value,
        },
      };
    case 'EMAIL':
      return {
        ...state,
        email: {
          error: payload.error ?? false,
          value: payload.value,
        },
      };
    case 'PASSWORD':
      return {
        ...state,
        password: {
          error: payload.error ?? false,
          value: payload.value,
        },
      };
    case 'PHONE':
      return {
        ...state,
        phone: {
          error: payload.error ?? false,
          value: payload.value,
        },
      };
    default:
      return state;
  }
};

const initialState = {
  firstName: {
    error: false,
    value: '',
  },
  lastName: {
    error: false,
    value: '',
  },
  email: {
    error: false,
    value: '',
  },
  password: {
    error: false,
    value: '',
  },
  phone: {
    error: false,
    value: undefined,
  },
};

const SignUp: React.FC = () => {
  const UserContext = useContext(userContext);
  const history = useHistory();
  const [accountExists, toggleAccountExists] = useState(false);
  const [error, toggleError] = useState(false);
  const [formState, dispatchFormEvent] = useReducer(signUpFormReducer, initialState);

  const tryCreateAccount = async () => {
    const { error, ...res } = await skyvueFetch().post('/auth/user/create', {
      email: formState.email.value,
      password: formState.password.value,
      firstName: formState.firstName.value,
      lastName: formState.lastName.value,
      phone: formState.phone?.value,
    });

    if (res.status === 409) {
      toggleAccountExists(true);
      return;
    }
    if (error && res.status >= 400) {
      toggleError(true);
      return;
    }

    const decodedToken = parseJWT(res.accessToken);
    UserContext.setUserContextValue({
      accessToken: res.accessToken,
      userId: decodedToken.userId,
    });

    localStorage.setItem('refreshToken', res.refreshToken);
    history.push('/home');
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toggleAccountExists(false);
    toggleError(false);
    if (formState.firstName.value === '') {
      dispatchFormEvent({
        type: 'FIRST_NAME',
        payload: {
          value: formState.firstName.value,
          error: true,
        },
      });
    }

    if (formState.lastName.value === '') {
      dispatchFormEvent({
        type: 'LAST_NAME',
        payload: {
          value: formState.lastName.value,
          error: true,
        },
      });
    }

    if (formState.email.value === '') {
      dispatchFormEvent({
        type: 'EMAIL',
        payload: {
          value: formState.email.value,
          error: true,
        },
      });
    }

    if (!EmailValidator.validate(formState.email.value)) {
      dispatchFormEvent({
        type: 'EMAIL',
        payload: {
          value: formState.email.value,
          error: true,
          invalid: true,
        },
      });
    }

    if (formState.password.value === '') {
      dispatchFormEvent({
        type: 'PASSWORD',
        payload: {
          value: formState.password.value,
          error: true,
        },
      });
    }

    const errors = formErrors(formState);
    const fieldsWithErrors = Object.keys(errors).filter(
      (x: any) => errors[x] === true,
    );

    if (fieldsWithErrors.length === 0) {
      tryCreateAccount();
    }
  };

  const errors = formErrors(formState);
  const fieldsWithErrors = Object.keys(errors).filter(
    (x: any) => errors[x] === true,
  );

  return (
    <UserContainer>
      {accountExists && (
        <DangerText len="short" size="sm">
          An account already exists with this user name. Try{' '}
          <Link to="login">logging in.</Link>
        </DangerText>
      )}
      {error && (
        <DangerText len="short" size="sm">
          There was an error when attempting to create your account. Please try again
          later.
        </DangerText>
      )}
      {fieldsWithErrors.length > 0 && (
        <>
          <DangerText len="short" size="lg">
            Please fix the following fields before continuing:
          </DangerText>
          <ul>
            {fieldsWithErrors.map(x => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </>
      )}
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <InputField
            label="First name"
            name="firstname"
            onChange={e =>
              dispatchFormEvent({
                type: 'FIRST_NAME',
                payload: {
                  value: e.target.value,
                  error: false,
                },
              })
            }
            value={formState.firstName.value}
            error={formState.firstName.error}
          />
        </div>
        <div className="input-group">
          <InputField
            label="Last name"
            name="lastname"
            onChange={e =>
              dispatchFormEvent({
                type: 'LAST_NAME',
                payload: {
                  value: e.target.value,
                  error: false,
                },
              })
            }
            value={formState.lastName.value}
            error={formState.lastName.error}
          />
        </div>
        <div className="input-group">
          <InputField
            label="Email"
            name="email"
            onChange={e =>
              dispatchFormEvent({
                type: 'EMAIL',
                payload: {
                  value: e.target.value,
                  error: false,
                },
              })
            }
            type="email"
            value={formState.email.value}
            error={formState.email.error}
          />
        </div>
        <div className="input-group">
          <InputField
            label="Password"
            name="new-password"
            onChange={e =>
              dispatchFormEvent({
                type: 'PASSWORD',
                payload: {
                  value: e.target.value,
                  error: false,
                },
              })
            }
            value={formState.password.value}
            error={formState.password.error}
            type="password"
          />
        </div>
        <div className="input-group">
          <InputField
            label="Phone number (optional)"
            name="phone"
            onChange={e =>
              dispatchFormEvent({
                type: 'PHONE',
                payload: {
                  value: e.target.value,
                  error: false,
                },
              })
            }
            value={formState.phone?.value ?? ''}
            error={formState.phone?.error}
          />
        </div>

        <div className="actions__container">
          <ButtonPrimary
            disabled={
              !formState.email.value ||
              !formState.password.value ||
              !formState.firstName.value ||
              !formState.lastName.value
            }
            id="complete_form"
          >
            Create Account
          </ButtonPrimary>
          <Helper>
            Already have an account?{' '}
            <strong>
              <Link to="/login">Customer Login</Link>
            </strong>
          </Helper>
        </div>
      </form>
    </UserContainer>
  );
};

export default SignUp;
