import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import { useRouter } from 'src/routes/hooks';
// import { useRouter } from 'next/router';
import { AuthContext } from '../context/jwt';

export default function RoleBasedGuard({ roles, children }) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const currentRole = user?.role;

  useEffect(() => {
    if (typeof roles !== 'undefined' && !roles.includes(currentRole)) {
      router.replace('/403');
    }
  }, [roles, currentRole, router]);

  // Jika role belum dicek atau sedang redirect, jangan render apa-apa dulu
  if (typeof roles !== 'undefined' && !roles.includes(currentRole)) {
    return null;
  }

  return <>{children}</>;
}

RoleBasedGuard.propTypes = {
  children: PropTypes.node,
  roles: PropTypes.arrayOf(PropTypes.string),
};
