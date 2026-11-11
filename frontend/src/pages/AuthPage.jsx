import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation, useRegisterMutation } from '../services/api';
import AppHeader from '../components/AppHeader';
import { setCredentials } from '../features/auth/authSlice';

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [login, loginState] = useLoginMutation();
  const [register, registerState] = useRegisterMutation();
  const isLoading = loginState.isLoading || registerState.isLoading;
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (token) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      let credentials;
      if (isRegister) {
        credentials = await register({ name, email, password }).unwrap();
      } else {
        credentials = await login({ email, password }).unwrap();
      }
      dispatch(setCredentials(credentials));
      navigate('/');
    } catch (requestError) {
      setError(requestError.data?.message || 'We could not complete your request. Please try again.');
    }
  }

  return (
    <>
      <AppHeader />
      <main className="auth-page">
        <div className="auth-art" aria-hidden="true">
          <span className="art-sun" />
          <span className="art-caption">Better insight.<br />More confident care.</span>
          <span className="art-heart">♡</span>
        </div>
        <section className="auth-card">
          <p className="eyebrow">{isRegister ? 'CREATE YOUR ACCOUNT' : 'SECURE ACCOUNT ACCESS'}</p>
          <h1>{isRegister ? 'Start tracking today.' : 'Welcome back.'}</h1>
          <p className="auth-subtitle">{isRegister ? 'Keep your glucose readings organized and easy to review.' : 'Sign in to review your glucose history and daily summaries.'}</p>
          <form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <label htmlFor="name">Your name</label>
                <input id="name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} />
              </>
            )}
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <label htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={isRegister ? 8 : undefined} />
            {isRegister && <p className="helper-text">Choose a password with at least 8 characters.</p>}
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button button-primary full-button auth-submit" disabled={isLoading}>{isLoading ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}</button>
          </form>
          <p className="auth-switch">
            {isRegister ? 'Already registered?' : 'New to Sweety?'}{' '}
            <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link>
          </p>
        </section>
      </main>
    </>
  );
}
