import PropTypes from 'prop-types';
import { useEffect, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// utils
import { fShortenNumber, fCurrency } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ColorPicker } from 'src/components/color-utils';
import FormProvider, { RHFSelect } from 'src/components/hook-form';
//
import IncrementerButton from './common/incrementer-button';
import { useMutationAddToCart } from 'src/hooks/cart/useMuatationAddToCart';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function ProductDetailsSummary({
  items,
  product,
  onAddCart,
  onGotoStep,
  disabledActions,
  ...other
}) {
  const router = useRouter();

  const {
    id,
    title: name,
    sizes,
    price,
    image: coverUrl,
    url,
    newLabel,
    available,
    priceSale,
    saleLabel,
    totalRatings,
    totalReviews,
    inventoryType,
    subDescription,
  } = product;

  const existProduct = !!items?.length && items.map((item) => item.id).includes(id);

  const isMaxQuantity =
    !!items?.length &&
    items.filter((item) => item.id === id).map((item) => item.quantity)[0] >= available;

  const defaultValues = {
    id,
    name,
    coverUrl,
    available,
    price,
    url: url[0],
    // size: sizes[4],
    quantity: available < 1 ? 0 : 1,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, control, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!existProduct) {
        onAddCart?.({
          ...data,
          colors: [values.colors],
          subTotal: data.price * data.quantity,
        });
      }
      onGotoStep?.(0);
      router.push(paths.product.checkout);
    } catch (error) {
      console.error(error);
    }
  });
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const { mutate: handleAddCart, isPending } = useMutationAddToCart({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carts'] })
      enqueueSnackbar('Cart Ditambahkan', { variant: 'success' })
    }
  },

    product?.id)

  const renderPrice = (
    <Box sx={{ typography: 'h5' }}>
      {priceSale && (
        <Box
          component="span"
          sx={{
            color: 'text.disabled',
            textDecoration: 'line-through',
            mr: 0.5,
          }}
        >
          {fCurrency(priceSale)}
        </Box>
      )}

      {fCurrency(price)}
    </Box>
  );

  const renderShare = (
    <Stack direction="row" spacing={3} justifyContent="center">
      <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Iconify icon="mingcute:add-line" width={16} sx={{ mr: 1 }} />
        Compare
      </Link>

      <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Iconify icon="solar:heart-bold" width={16} sx={{ mr: 1 }} />
        Favorite
      </Link>

      <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Iconify icon="solar:share-bold" width={16} sx={{ mr: 1 }} />
        Share
      </Link>
    </Stack>
  );

  const renderCategories = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Categories
      </Typography>

      <Typography>{product?.category?.name}</Typography>
    </Stack>
  );

  const renderSizeOptions = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Dibuat Oleh
      </Typography>

      <Link color="textPrimary">
        {product?.creator_name}
      </Link>
    </Stack>
  );

  const renderActions = (
    <Stack direction="row" spacing={2}>
      <Button
        fullWidth
        disabled={isMaxQuantity || disabledActions}
        size="large"
        color="warning"
        variant="contained"
        startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
        onClick={handleAddCart}
        sx={{ whiteSpace: 'nowrap' }}
      >
        {isPending ? 'Menambahkan to cart...' : 'Tambah ke Cart'}
      </Button>

      <Button
        fullWidth
        size="large"
        variant="contained"
        onClick={() => window.open(url, '_blank')}
      >
        Lihat Demo Website
      </Button>
    </Stack>
  );

  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {subDescription}
    </Typography>
  );

  console.log(product)

  // const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
  //   <Stack direction="row" alignItems="center" spacing={1}>
  //     {newLabel.enabled && <Label color="info">{newLabel.content}</Label>}
  //     {saleLabel.enabled && <Label color="error">{saleLabel.content}</Label>}
  //   </Stack>
  // );

  const renderInventoryType = (
    <Box
      component="span"
      sx={{
        typography: 'overline',
        color:
          (inventoryType === 'out of stock' && 'error.main') ||
          (inventoryType === 'low stock' && 'warning.main') ||
          'success.main',
      }}
    >
      {inventoryType}
    </Box>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start">
          {/* {renderLabels} */}

          {renderInventoryType}

          <Typography variant="h5">{name}</Typography>

          {/* {renderRating} */}

          {renderPrice}

          {renderSubDescription}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderCategories}

        {renderSizeOptions}



        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderActions}

        {renderShare}
      </Stack>
    </FormProvider>
  );
}

ProductDetailsSummary.propTypes = {
  items: PropTypes.array,
  disabledActions: PropTypes.bool,
  onAddCart: PropTypes.func,
  onGotoStep: PropTypes.func,
  product: PropTypes.object,
};
