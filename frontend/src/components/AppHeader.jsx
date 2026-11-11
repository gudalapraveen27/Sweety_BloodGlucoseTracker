import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearCredentials } from '../features/auth/authSlice';

export default function AppHeader() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function signOut() {
    dispatch(clearCredentials());
    navigate('/login');
  }

  return (
    <header className="topbar">
      <Link to="/" className="brand" aria-label="Sweety home">
        <span className="brand-mark" aria-hidden="true">S</span>
        <span>Sweety</span>
      </Link>
      {user && (
        <div className="user-menu">
          <span className="welcome">{user.name}</span>
          <button className="text-button" onClick={signOut}>Log out</button>
        </div>
      )}
    </header>
  );
}
