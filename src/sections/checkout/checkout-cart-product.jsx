import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// utils
// components
// import IncrementerButton from '../product/common/incrementer-button';
import { useQueryClient } from '@tanstack/react-query';
import { useMutationDeleteCard } from 'src/hooks/cart/useMutationDeleteCard';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ColorPreview } from 'src/components/color-utils';
//
import { fCurrency } from 'src/utils/format-number';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function CheckoutCartProduct({ row }) {
  const { product } = row
  const { name, images_url: coverUrl, available } = product;
  console.log(row)
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const { mutate, isPending } = useMutationDeleteCard({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carts'] })
      enqueueSnackbar('Cart Deleted', { variant: 'success' })
    }
  })

  const handleDeleteCart = () => {
    mutate(row?.cart_id)
  }
  return (
    <TableRow>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar variant="rounded" alt={name} src={coverUrl} sx={{ width: 64, height: 64, mr: 2 }} />

        <Stack spacing={0.5}>
          <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
            {product?.title}
          </Typography>

          {/* <Stack
            direction="row"
            alignItems="center"
            sx={{ typography: 'body2', color: 'text.secondary' }}
          >
            size: <Label sx={{ ml: 0.5 }}> {size} </Label>
            <Divider orientation="vertical" sx={{ mx: 1, height: 16 }} />
            <ColorPreview colors={colors} />
          </Stack> */}
        </Stack>
      </TableCell>

      <TableCell>{fCurrency(product?.price)}</TableCell>

      <TableCell>
        <Box sx={{ width: 88, textAlign: 'right' }}>

          <Typography variant="caption" component="div" sx={{ color: 'text.secondary', mt: 1 }}>
            {product?.category?.name}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="right">{fCurrency(product?.price)}</TableCell>

      <TableCell align="right" sx={{ px: 1 }}>
        <IconButton onClick={handleDeleteCart}>
          {isPending ? 'Deleting' : <Iconify icon="solar:trash-bin-trash-bold" />}
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

CheckoutCartProduct.propTypes = {
  row: PropTypes.object,
};
