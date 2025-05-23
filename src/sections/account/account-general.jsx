import * as Yup from 'yup';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// utils
import { fData } from 'src/utils/format-number';
// assets
import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import { useMutationProfileUser } from 'src/hooks/user/useMutationProfileUser';
import { useFetchByIdUser } from 'src/hooks/user/useFetchByIdUser';
import { LoadingScreen } from 'src/components/loading-screen';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from 'src/auth/hooks';
// import { register } from 'numeral';

// ----------------------------------------------------------------------

export default function AccountGeneral({ user: AuthUser }) {
  const { enqueueSnackbar } = useSnackbar();
  // console.log(AuthUser.email);
  // const { user } = useMockedUser();
  const queryClient = useQueryClient();
  const { initialize } = useAuthContext();


  const { data: userLogeddin, isLoading, isFetching } = useFetchByIdUser(AuthUser?.id)

  const UpdateUserSchema = Yup.object().shape({
    isPublic: Yup.boolean(), // contoh validasi, bisa kamu tambahkan lainnya
  });



  const defaultValues = {
    username: AuthUser?.username || '',
    email: AuthUser?.email || '',
    profile_photo: typeof AuthUser?.profile_photo === 'string'
      ? AuthUser.profile_photo.replace(/\\\//g, '/')
      : AuthUser?.profile_photo || null,
    phone_number: AuthUser?.phone_number || '',
    address: AuthUser?.address || '',
    role: AuthUser?.role || '',
  };



  // console.log(AuthUser)

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = methods;


  useEffect(() => {
    if (userLogeddin) {
      setValue('username', userLogeddin.username || '');
      setValue('email', userLogeddin.email || '');
      setValue('profile_photo', userLogeddin.profile_photo_url || null);
      setValue('phone_number', userLogeddin.phone_number || '');
      setValue('address', userLogeddin.address || '');
      setValue('role', userLogeddin.role || '');
    }
  }, [userLogeddin, setValue]);

  const { mutate, isPending } = useMutationProfileUser({
    onSuccess: async () => {
      queryClient.invalidateQueries(['fetch.user.by.id', AuthUser?.id]);
      enqueueSnackbar('Profil berhasil diperbarui', { variant: 'success' });
      await initialize();

    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  })



  const onSubmit = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      // Lewatin role agar tidak dikirim
      if (key === 'role') return;

      if (key === 'profile_photo') {
        if (value && typeof value === 'object' && value instanceof File) {
          formData.append(key, value);
        }
      } else {
        formData.append(key, value);
      }
    });

    // Debug lagi kalau perlu
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    formData.append('_method', 'PUT'); // tambahkan method ke formData
    mutate(formData);
  };




  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file), // agar bisa tampilkan preview gambar
      });

      if (file) {
        setValue('profile_photo', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  // console.log(data)
  if (isLoading || isFetching) {
    return <LoadingScreen />;
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
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
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            {/* <Button variant="soft" color="error" sx={{ mt: 3 }}>
              Hapus Akun
            </Button> */}
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
              <RHFTextField name="username" label="username" />
              <RHFTextField name="email" label="email" />
              <RHFTextField name="phone_number" label="Nomor Telepon" />

              {/* Role - disabled field */}
              <TextField
                label="role"
                value={AuthUser?.role || ''}
                fullWidth
                disabled
              />
            </Box>


            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="address" multiline rows={4} label="address" />

              <LoadingButton type="submit" variant="contained" loading={isPending}>
                Simpan Perubahan
              </LoadingButton>

            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
