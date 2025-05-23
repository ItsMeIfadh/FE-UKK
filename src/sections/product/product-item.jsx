import PropTypes from 'prop-types';
// @mui
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { ColorPreview } from 'src/components/color-utils';
//
import { useCheckoutContext } from '../checkout/context';

// ----------------------------------------------------------------------

export default function ProductItem({ product }) {
  const { onAddToCart } = useCheckoutContext();

  const { id, title, status, image_url, price, colors, sizes, priceSale } = product;
  console.log(product)
  const linkTo = paths.product.details(id);

  const available = status === "published" ? true : false;

  const handleAddCart = async () => {
    const newProduct = {
      id,
      title,
      image_url,
      price,
      colors: [colors[0]],
      size: sizes[0],
      quantity: 1,
    };
    try {
      onAddToCart(newProduct);
    } catch (error) {
      console.error(error);
    }
  };

  const renderLabels = (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ position: 'absolute', zIndex: 9, top: 16, right: 16 }}
    >

      <Label variant="filled" color={available ? 'info' : 'error'}>
        {available ? 'Tersedia' : 'Tidak Tersedia'}
      </Label>
    </Stack>
  );

  const renderImg = (
    <Box sx={{ position: 'relative', p: 1 }}>
      {!!available && (
        <Fab
          color="warning"
          size="medium"
          className="add-cart-btn"
          onClick={handleAddCart}
          sx={{
            right: 16,
            bottom: 16,
            zIndex: 9,
            opacity: 0,
            position: 'absolute',
            transition: (theme) =>
              theme.transitions.create('all', {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
          }}
        >
          <Iconify icon="solar:cart-plus-bold" width={24} />
        </Fab>
      )}

      <Tooltip title={!available && 'unpublished'} placement="bottom-end">
        <Image
          alt={title}
          src={image_url}
          ratio="1/1"
          sx={{
            borderRadius: 1.5,
            ...(!available && {
              opacity: 0.48,
              filter: 'grayscale(1)',
            }),
          }}
        />
      </Tooltip>
    </Box>
  );


  const renderContent = (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2 }}>
      <Link component={RouterLink} href={linkTo} color="inherit" variant="subtitle2" noWrap>
        {title}

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* <ColorPreview colors={colors} /> */}

          <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
            {priceSale && (
              <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                {fCurrency(priceSale)}
              </Box>
            )}

            <Box component="span">{fCurrency(price)}</Box>
          </Stack>
        </Stack>
      </Link>
    </Stack>
  );

  return (
    <Card
      sx={{
        // maxWidth: 300, // Batasi ukuran maksimal kartu
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
      }}
    >
      {renderLabels}
      {/* <Box sx={{ position: 'relative', p: 1 }}> */}


      {renderImg}
      {/* </Box> */}

      {renderContent}
    </Card>

  );
}

ProductItem.propTypes = {
  product: PropTypes.object,
};
