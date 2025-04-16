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
// import { register } from 'numeral';

// ----------------------------------------------------------------------

export default function AccountGeneral({ user: AuthUser }) {
  const { enqueueSnackbar } = useSnackbar();
  // console.log(AuthUser.email);
  // const { user } = useMockedUser();

  const UpdateUserSchema = Yup.object().shape({
    // username: Yup.string().required('Name is required'),
    // email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    // profile_photo: Yup.mixed().nullable().required('Avatar is required'),
    // phone_number: Yup.string().required('Phone number is required'),
    // address: Yup.string().required('Address is required'),
    // not required
    isPublic: Yup.boolean(),
  });


  const defaultValues = {
    username: AuthUser?.username || '',
    email: AuthUser?.email || '',
    profile_photo: AuthUser?.profile_photo || null,
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


  // useEffect(() => {
  //   if (AuthUser) {
  //     setValue('username', AuthUser.username || '');
  //     setValue('email', AuthUser.email || '');
  //     setValue('profile_photo', AuthUser.profile_photo || null);
  //     setValue('phone_number', AuthUser.phone_number || '');
  //     setValue('address', AuthUser.address || '');
  //     setValue('role', AuthUser.role || '');
  //   }
  // }, [AuthUser, setValue]);

  const { mutate, isPending } = useMutationProfileUser({
    onSuccess: () => {
      enqueueSnackbar('Tambah user success', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  })

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'profile_photo') {
        if (value && typeof value === 'object' && value instanceof File) {
          formData.append(key, value);
        }
      } else {
        formData.append(key, value);
      }
    });
    mutate(formData)
  }

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('profile_photo', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

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

            <Button variant="soft" color="error" sx={{ mt: 3 }}>
              Delete User
            </Button>
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
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
