import { ButtonPrimary } from 'components/ui/Buttons';
import InputField from 'components/ui/InputField';
import { Helper, Text } from 'components/ui/Typography';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as EmailValidator from 'email-validator';
import skyvueFetch from 'services/skyvueFetch';
import { UserContainer } from './styles';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [showConfirmation, toggleShowConfirmation] = useState(false);

  const onSubmit = async () => {
    if (!EmailValidator.validate(email) || email === '') {
      setError(true);
      return;
    }
    setError(false);

    await skyvueFetch().post('/auth/user/forgot_password', { email });
    toggleShowConfirmation(true);
    setTimeout(() => {
      toggleShowConfirmation(false);
    }, 10000);
  };

  return (
    <UserContainer>
      <Text size="lg" len="short">
        Enter the email associated with your account. If an account exists, we'll
        send you an email with a link to reset your password.
      </Text>

      <div className="input-group">
        {showConfirmation && (
          <Helper>
            Check your email for your reset link. It will be valid for 15 minutes.
          </Helper>
        )}
        <InputField
          onChange={e => setEmail(e.target.value)}
          error={error}
          value={email}
          type="email"
          placeholder="email@email.com"
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

export default ForgotPassword;
