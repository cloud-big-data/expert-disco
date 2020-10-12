import React, { useEffect, useReducer, useState } from 'react';
import { ButtonPrimary } from 'components/ui/Buttons';
import InputField from 'components/ui/InputField';
import { DangerText, Helper, Text } from 'components/ui/Typography';
import { Link } from 'react-router-dom';
import { UserContainer } from './styles';
import { IReducerAction } from 'types';
import skyvueFetch from 'services/skyvueFetch';


const loginFormReducer = (state: {
  email: {
    error: boolean;
    value: string;
  }
  password: {
    error: boolean;
    value: string;
  }
}, action: IReducerAction) => {
  const { type, payload } = action;
  switch (type) {
    case 'EMAIL':
      return {
        ...state,
        email: {
          value: payload.value,
          error: payload.error ?? false,
        }
      }
    case 'PASSWORD':
      return {
        ...state,
        password: {
          value: payload.value,
          error: payload.error ?? false,
        },
      }
    default:
      return state;
  }
}

const Login: React.FC = () => {
  const [badLogin, toggleBadLogin] = useState(false);
  const [formState, dispatchFormEvent] = useReducer(
    loginFormReducer,
    {
      email: {
        value: '',
        error: false,
      },
      password: {
        value: '',
        error: false,
      },
    }
  )

  useEffect(() => {
    const fetch = async () => {
      const res = skyvueFetch();
      const test = await res.get('/health_check');
      console.log(test);
    }

    fetch();
  })

  const onSubmit = () => {
    toggleBadLogin(false);
    if (formState.email.value === '') {
      dispatchFormEvent({
        type: "EMAIL",
        payload: {
          value: formState.email.value,
          error: true,
        }
      })
    }

    if (formState.password.value === '') {
      dispatchFormEvent({
        type: "PASSWORD",
        payload: {
          value: formState.password.value,
          error: true,
        }
      })
    }
  }
  
  return (
    <UserContainer>
      { badLogin && (
        <DangerText len="short" size="sm">
          There was a problem with your email or password. Please try again!
        </DangerText>
      )}
      <div className="input-group">
        <Text len="short" size="sm">Email:</Text>
        <InputField
          onChange={e => dispatchFormEvent({
            type: "EMAIL",
            payload: {
              value: e.target.value,
            }
          })}
          error={formState.email.error}
          value={formState.email.value}
        />
      </div>
      <div className="input-group">
        <Text len="short" size="sm">Password:</Text>
        <InputField
          onChange={e => dispatchFormEvent({
            type: "PASSWORD",
            payload: {
              value: e.target.value,
            }
          })}
          error={formState.password.error}
          value={formState.password.value}
          type="password"
        />
      </div>

      <div className="actions__container">
        <ButtonPrimary onClick={onSubmit} id="complete_form">
          Login
        </ButtonPrimary>
        
        <Helper>Not a user yet? <Link to="/signup">Create Account</Link></Helper>
      </div>
    </UserContainer>
  )
}

export default Login;