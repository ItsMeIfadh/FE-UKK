import { _mock } from 'src/_mock';

// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// const { user } = useMockedUser();

// TO:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export function useMockedUser() {
  const user = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: 'Arfan',
    email: 'arfan@gmail.com',
    password: 'password',
    photoURL: _mock.image.avatar(24),
    phoneNumber: '+62 82155668899',
    country: 'Indonesia',
    address: 'Komp Goodyear',
    state: 'Jawa Barat',
    city: 'Bogor',
    zipCode: '94116',
    about: 'Saya ingin menjadi seorang programmer',
    role: 'admin',
    isPublic: true,
  };

  return { user };
}
