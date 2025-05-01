import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { paths } from 'src/routes/paths';

import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from '../hooks'; // pastikan ada { user, authenticated } di context

export default function RoleGuard({ allowedRoles, children }) {
  const router = useRouter();
  const { user, authenticated } = useAuthContext();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!authenticated) {
      router.replace(`${paths.auth.jwt.login}?returnTo=${window.location.pathname}`);
    } else if (!allowedRoles.includes(user?.role)) {
      router.replace('/403'); // Halaman akses ditolak
    } else {
      setChecked(true);
    }
  }, [authenticated, user, allowedRoles, router]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}

RoleGuard.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
};
