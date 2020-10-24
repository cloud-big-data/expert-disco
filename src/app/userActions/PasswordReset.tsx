import React, { useEffect, useState } from 'react';
import { ButtonPrimary } from 'components/ui/Buttons';
import InputField from 'components/ui/InputField';
import { DangerText, Helper, Text } from 'components/ui/Typography';
import { Link, useHistory, useParams } from 'react-router-dom';
import skyvueFetch from 'services/skyvueFetch';
import { UserContainer } from './styles';

const PasswordReset: React.FC = () => {
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [tokenExpired, toggleTokenExpired] = useState(false);
  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    const checkTokenValidity = async () => {
      const res = await skyvueFetch().post('/auth/user/forgot_password_validity', {
        token,
      });
      if (res?.error === 'token_expired') {
        toggleTokenExpired(true);
      }
    };
    checkTokenValidity();
  }, [token]);

  const onSubmit = async () => {
    if (password === '' || confirmPassword === '') {
      setError("Passwords can't be blank");
      return;
    }

    if (password !== confirmPassword) {
      setError('Password do not match');
      return;
    }

    const res = await skyvueFetch().post('/auth/user/change_password', {
      token,
      password,
      confirmPassword,
    });

    if (res.error) {
      switch (res.error) {
        case 'Passwords do not match':
          setError('Passwords do not match');
          return;
        case 'TokenExpiredError':
          toggleTokenExpired(true);
          return;
        default:
          return;
      }
    }

    toggleTokenExpired(false);
    setError('');

    history.push('/login');
  };

  return (
    <UserContainer>
      {error !== '' && (
        <DangerText len="short" size="sm">
          {error}
        </DangerText>
      )}
      {tokenExpired && (
        <DangerText len="short" size="sm">
          This link has expired. Please{' '}
          <Link to="/forgot_password">request a new link.</Link>
        </DangerText>
      )}
      <div className="input-group">
        <Text len="short" size="sm">
          New password:
        </Text>
        <InputField
          onChange={e => setPassword(e.target.value)}
          error={error !== ''}
          value={password}
          type="password"
          onKeyDown={e => {
            if (e.key === 'Enter') onSubmit();
          }}
        />
      </div>
      <div className="input-group">
        <Text len="short" size="sm">
          Confirm your new password:
        </Text>
        <InputField
          onChange={e => setConfirmPassword(e.target.value)}
          error={error !== ''}
          value={confirmPassword}
          type="password"
          onKeyDown={e => {
            if (e.key === 'Enter') onSubmit();
          }}
        />
      </div>

      <div className="actions__container">
        <ButtonPrimary onClick={onSubmit}>Reset my password</ButtonPrimary>
        <Helper>
          <Link to="/forgot_password">Customer Login</Link>
        </Helper>
      </div>
    </UserContainer>
  );
};

export default PasswordReset;
