import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _userList } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useFetchByIdUser } from 'src/hooks/user/useFetchByIdUser';
import UserNewEditForm from '../user-new-edit-form';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function UserEditView({ id }) {
  const settings = useSettingsContext();

  // const currentUser = _userList.find((user) => user.id === id);

  const { data, isLoading } = useFetchByIdUser(id)

  
if (isLoading) return <LoadingScreen/>;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'User',
            href: paths.dashboard.user.root,
          },
          { name: data?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm currentUser={data} />
    </Container>
  );
}

UserEditView.propTypes = {
  id: PropTypes.string,
};
