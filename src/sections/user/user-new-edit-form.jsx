import PropTypes from 'prop-types';
import * as Yup from 'yup';
import MenuItem from '@mui/material/MenuItem';
import { useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
// utils
import { useQueryClient } from '@tanstack/react-query';
import { fData } from 'src/utils/format-number';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// assets
// import { countries } from 'src/assets/data';
// components
import Label from 'src/components/label';
// import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  // RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFSelect,
  // RHFAutocomplete,
} from 'src/components/hook-form';
import { useMutationCreateUser } from 'src/hooks/user/useMutationCreateUser';
import { useMutationUpdateUser } from 'src/hooks/user/useMutationUpdateUser';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ currentUser }) {
  // console.log(currentUser.username)
  console.log(currentUser?.username);

  // 'username' => 'required|string|max:255|unique:users',
  //           'email' => 'required|string|email|max:255|unique:users',
  //           'password' => 'required|string|min:8',
  //           'role' => 'required|in:admin,kelas,pengguna',
  //           'phone_number' => 'nullable|string|max:20',
  //           'is_active' => 'boolean',
  //           'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient();

  const { mutateAsync: createUser } = useMutationCreateUser({
    onSuccess: (data) => {
      console.log('Tambah User Berhasil', data);
      // enqueueSnackbar('Create user success!');
      router.push(paths.dashboard.user.list);
      queryClient.invalidateQueries(['fetch.all.users']);
    },
    onError: (error) => {
      console.error('Gagal Menambah User', error);
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  })

  const { mutateAsync: updateUser } = useMutationUpdateUser({
    onSuccess: (data) => {
      console.log('Edit User Berhasil', data);
      // enqueueSnackbar('Create user success!');
      router.push(paths.dashboard.user.list);
      queryClient.invalidateQueries(['fetch.all.users']);
    },
    onError: (error) => {
      console.error('Edit User Gagal', error);
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  })

  const NewUserSchema = Yup.object().shape({
    username: Yup.string().required('Username wajib diisi'),
    email: Yup.string().required('Email wajib diisi').email('Email harus valid'),
    password: currentUser
      ? Yup.string()
      : Yup.string().required('Password wajib diisi').min(8, 'Password minimal 8 karakter'),
    role: Yup.string().required('Role wajib diisi'),
    phone_number: Yup.string().nullable(),
    profile_photo: Yup.mixed().nullable(),
    is_active: Yup.boolean(),
  });
  

  const defaultValues = useMemo(() => ({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    password: '',
    role: currentUser?.role || 'pengguna',
    phone_number: currentUser?.phone_number || '',
    profile_photo: currentUser?.profile_photo_url || null,
    is_active: currentUser?.is_active ?? false,
    address: currentUser?.address || '',
  }), [currentUser]);


  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {

      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('email', data.email);
      // formData.append('password', data.password);
      formData.append('role', data.role);
      formData.append('is_active', data.is_active ? '1' : '0');
      formData.append('phone_number', data.phone_number);
      formData.append('address', data.address);
      if (data.password) {
        formData.append('password', data.password);
      }

      formData.append('Method', 'PUT');
      if (data.profile_photo instanceof File) {
        formData.append('profile_photo', data.profile_photo);
      }


      console.log(data)
      if (currentUser?.id) {
        await updateUser({ id: currentUser.id, data: formData });
      } else {
        await createUser(formData);
      }
      reset();
      enqueueSnackbar(currentUser ? 'Edit User Sukses!' : 'Tambah User Suksess!');
      router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const newFile = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        setValue('profile_photo', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={
                  (values.status === 'active' && 'success') ||
                  (values.status === 'banned' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="profile_photo"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

      

            {/* <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            /> */}


          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="username" label="Username" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phone_number" label="Nomor Telepon" />
              <RHFTextField
                name="password"
                label="Password"
                type="password"
                helperText={currentUser ? 'Kosongkan jika tidak ingin mengubah password' : ''}
              />

              <RHFSelect name="role" label="Role">
                <MenuItem value="kelas">Kelas</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="pengguna">Pengguna</MenuItem>
              </RHFSelect>


            </Box>
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="address" multiline rows={4} label="address" />
              <LoadingButton
                type="submit"
                variant="contained"
              >
                {currentUser ? 'Simpan Perubahan' : 'Tambah User'}
              </LoadingButton>

            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentUser: PropTypes.object,
};
