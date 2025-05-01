import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios, { endpoints } from 'src/utils/axios';
//
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INITIAL':
      return {
        loading: false,
        user: action.payload.user,
      };
    case 'LOGIN':
    case 'REGISTER':
      return {
        ...state,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

const STORAGE_KEY = 'accessToken';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await axios.get(endpoints.auth.me);
        const user = response?.data?.user || null;

        dispatch({
          type: 'INITIAL',
          payload: {
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(
    async (email, password) => {
      try {
        const data = { email, password };

        const response = await axios.post(endpoints.auth.login, data);
        const { token: access_token } = response.data;

        setSession(access_token);

        // Get user data
        const userResponse = await axios.get(endpoints.auth.me);
        const user = userResponse?.data?.user || null;

        dispatch({
          type: 'LOGIN',
          payload: {
            user,
          },
        });

        return user; // Return user data for redirection based on role
      } catch (error) {
        throw error;
      }
    },
    []
  );

  // REGISTER
  const register = useCallback(
    async (email, password, firstName, lastName) => {
      const data = { email, password, firstName, lastName };

      const response = await axios.post(endpoints.auth.register, data);
      const { accessToken } = response.data;

      sessionStorage.setItem(STORAGE_KEY, accessToken);

      await initialize(); // Fetch complete user data
    },
    [initialize]
  );

  // LOGOUT
  const logout = useCallback(async () => {
    try {
      await axios.post(endpoints.auth.logout); // API endpoint logout
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setSession(null);
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  // STATUS
  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
      register,
      logout,
      initialize,
    }),
    [login, logout, register, state.user, status, initialize]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};