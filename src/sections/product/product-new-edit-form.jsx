import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import {
  _tags,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';
import { useMutationCreateProduct } from 'src/hooks/product/useMutationCreateProduct';
import { useFetchAllCategory } from 'src/hooks/kategori/useFetchAllCategory';
import { LoadingScreen } from 'src/components/loading-screen';
import { useMutationUpdateProduct } from 'src/hooks/product';

// ----------------------------------------------------------------------

export default function ProductNewEditForm({ currentProduct = '' }) {
  // console.log(currentProduct)

  const { data: detailProduct } = currentProduct
  // console.log(detailProduct?.id)
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const { data, isLoading, isFetching, isError } = useFetchAllCategory();
  // console.log(data)

  const { mutateAsync: createProduct } = useMutationCreateProduct({
    onSuccess: () => {
      enqueueSnackbar('Create product success!');
      router.push(paths.dashboard.product.root);
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    },

  });
  const { mutate: updateMutation } = useMutationUpdateProduct({
    onSuccess: () => {
      enqueueSnackbar('Create product success!');
      router.push(paths.dashboard.product.root);
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

  const NewProductSchema = Yup.object().shape({
    title: Yup.string().required('Judul wajib diisi'),
    description: Yup.string().required('Deskripsi wajib diisi'),
    url: Yup.string().required('URL website wajib diisi'),
    video_url: Yup.string().required('URL video wajib diisi'),
    image: Yup.mixed()
      .required('Gambar wajib diunggah'),
    category_id: Yup.string().required('Kategori wajib di isi'),
    price: Yup.number().typeError('Harga harus berupa angka').moreThan(0, 'Harga tidak boleh 0'),
    status: Yup.string()
      .oneOf(['published', 'unpublished'], 'Status tidak valid')  // Mengubah validasi status ke 'active' atau 'inactive'
      .required('Status wajib diisi'),
  });




  const defaultValues = useMemo(() => ({
    title: detailProduct?.title || '',
    description: detailProduct?.description || '',
    url: detailProduct?.url || '',
    video_url: detailProduct?.video_url || '',
    image: detailProduct?.images_url ? [detailProduct.images_url] : [],
    category_id: detailProduct?.category?.id || '',
    price: detailProduct?.price || 0,
    status: detailProduct?.status === 'draft' ? 'inactive' : detailProduct?.status || 'active',
  }), [detailProduct]);



  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  useEffect(() => {
    if (includeTaxes) {
      setValue('taxes', 0);
    } else {
      setValue('taxes', currentProduct?.taxes || 0);
    }
  }, [currentProduct?.taxes, includeTaxes, setValue]);



  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
    try {
      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('url', data.url);
      formData.append('video_url', data.video_url);


      if (data.category_id && data.category_id.length) {
        formData.append('category_id', data.category_id[0].toString());
      }

      // Set status menjadi 'active' atau 'inactive'
      formData.append('status', data.status === 'draft' ? 'inactive' : data.status);
      if (data.image && data.image.length && data.image[0] instanceof File) {
        formData.append('image', data.image[0]);
      }

      if (detailProduct?.id) {
        formData.append('_method', 'PUT');
        updateMutation({ id: detailProduct?.id, data: formData });
      } else {
        await createProduct(formData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });


  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFile = acceptedFiles[0]; // Ambil satu file saja (karena 1 gambar)

      const previewFile = Object.assign(newFile, {
        preview: URL.createObjectURL(newFile),
      });

      setValue('image', [previewFile], { shouldValidate: true }); // Replace gambar lama
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.image && values.image.filter((file) => file !== inputFile);
      setValue('image', filtered);
    },
    [setValue, values.image]
  );


  const handleRemoveAllFiles = useCallback(() => {
    setValue('image', []);
  }, [setValue]);


  const handleChangeIncludeTaxes = useCallback((event) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Detail
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Judul, deskripsi singkat, gambar...
          </Typography>
        </Grid>

      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="title" label="Nama Website" />

            <RHFTextField name="description" label="Deskripsi" multiline rows={4} />

            {/* <Stack spacing={1.5}>
              <Typography variant="subtitle2">Content</Typography>
              <RHFEditor simple name="description" />
            </Stack> */}

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Gambar</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="image"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Informasi Tambahan
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Kategori, URL website, dan URL video demo...
          </Typography>
        </Grid>

      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="url" label="Link Website" />

              <RHFTextField name="video_url" label="Link Youtube Website" />

              {/* <RHFTextField
                name="quantity"
                label="Quantity"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              /> */}

              <RHFSelect native name="category_id" label="Kategori" InputLabelProps={{ shrink: true }}>
                <option value={``}>- Pilih Kategori -</option>
                {data?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect native name="status" label="Status" InputLabelProps={{ shrink: true }}>
                <option value={``} selected>- Status -</option>
                <option value='published'>
                  Publish
                </option>
                <option value='unpublished'>
                  Unpublish
                </option>
              </RHFSelect>



              {/* <RHFMultiSelect
                checkbox
                name="colors"
                label="Colors"
                options={PRODUCT_COLOR_NAME_OPTIONS}
              /> */}

              {/* <RHFMultiSelect checkbox name="sizes" label="Sizes" options={PRODUCT_SIZE_OPTIONS} /> */}
            </Box>
            {/* 
            <RHFAutocomplete
              name="tags"
              label="Tags"
              placeholder="+ Tags"
              multiple
              freeSolo
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            /> */}

            {/* <Stack spacing={1}>
              <Typography variant="subtitle2">Gender</Typography>
              <RHFMultiCheckbox row name="gender" spacing={2} options={PRODUCT_GENDER_OPTIONS} />
            </Stack> */}

            <Divider sx={{ borderStyle: 'dashed' }} />

            {/* <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="saleLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="saleLabel.content"
                label="Sale Label"
                fullWidth
                disabled={!values.saleLabel.enabled}
              />
            </Stack> */}

            {/* <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="newLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="newLabel.content"
                label="New Label"
                fullWidth
                disabled={!values.newLabel.enabled}
              />
            </Stack> */}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Pengaturan Harga
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Input terkait harga website
          </Typography>
        </Grid>

      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Pricing" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="price"
              label="Harga"
              placeholder="000000"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      Rp
                    </Box>
                  </InputAdornment>
                ),
              }}
            />


          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>

        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentProduct ? 'Tambah Produk' : 'Simpan Perubahan'}
        </LoadingButton>
      </Grid>
    </>
  );

  if (isLoading || isFetching) {
    return <LoadingScreen />;
  }
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderPricing}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

ProductNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
};
