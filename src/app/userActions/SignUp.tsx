import React, { useContext, useReducer, useState } from 'react';
import { ButtonPrimary } from 'components/ui/Buttons';
import InputField from 'components/ui/InputField';
import { Helper, Text, DangerText } from 'components/ui/Typography';
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
  const [formState, dispatchFormEvent] = useReducer(signUpFormReducer, initialState);

  const tryCreateAccount = async () => {
    const { error, ...res } = await skyvueFetch().post('/auth/user/create', {
      email: formState.email.value,
      password: formState.password.value,
      firstName: formState.firstName.value,
      lastName: formState.lastName.value,
      phone: formState.phone?.value,
    });

    if (error) {
      toggleAccountExists(true);
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

  const onSubmit = () => {
    toggleAccountExists(false);
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

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
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

      <div className="input-group">
        <Text len="short" size="sm">
          First Name:
        </Text>
        <InputField
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
          onKeyDown={onKeyDown}
        />
      </div>
      <div className="input-group">
        <Text len="short" size="sm">
          Last Name:
        </Text>
        <InputField
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
          onKeyDown={onKeyDown}
        />
      </div>
      <div className="input-group">
        <Text len="short" size="sm">
          Email:
        </Text>
        <InputField
          onChange={e =>
            dispatchFormEvent({
              type: 'EMAIL',
              payload: {
                value: e.target.value,
                error: false,
              },
            })
          }
          value={formState.email.value}
          error={formState.email.error}
          onKeyDown={onKeyDown}
        />
      </div>
      <div className="input-group">
        <Text len="short" size="sm">
          Password:
        </Text>
        <InputField
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
          onKeyDown={onKeyDown}
        />
      </div>
      <div className="input-group">
        <Text len="short" size="sm">
          Phone Number (optional):
        </Text>
        <InputField
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
          onKeyDown={onKeyDown}
        />
      </div>

      <div className="actions__container">
        <ButtonPrimary onClick={onSubmit} id="complete_form">
          Create Account
        </ButtonPrimary>

        <Helper>
          Already have an account? <Link to="/login">Customer Login</Link>
        </Helper>
      </div>
    </UserContainer>
  );
};

export default SignUp;
