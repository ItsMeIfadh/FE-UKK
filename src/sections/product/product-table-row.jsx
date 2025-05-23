import PropTypes from 'prop-types';
import { format, parse } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// utils
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';

import { fCurrency } from 'src/utils/format-number';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useMutationDeleteProduct } from 'src/hooks/product/useMutationDeleteProduct';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function ProductTableRow({
  row,
  selected,
  onSelectRow,
  // onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const {
    title,
    price,
    // publish,
    status,
    image_url,
    category,
    created_at,
    creator_name,
  } = row;
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useBoolean();
  const router = useRouter();
  const popover = usePopover();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutationDeleteProduct({
    onSuccess: () => {
      console.log('Produk berhasil dihapus, invalidate dimulai');
      queryClient.invalidateQueries(['chart.products']);
      enqueueSnackbar('product berhasil dihapus!');
      // router.push(paths.dashboard.product.root);
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    },

  })

  const handleDeleteProduct = () => {
    mutate(row.id);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={title}
            src={image_url}
            variant="rounded"
            sx={{ width: 64, height: 64, mr: 2 }}
          />

          <ListItemText
            disableTypography
            primary={
              <Link
                noWrap
                color="inherit"
                variant="subtitle2"
                onClick={onViewRow}
                sx={{ cursor: 'pointer' }}
              >
                {title}
              </Link>
            }
            secondary={
              <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
                {category?.name || 'Tidak ada kategori'}
              </Box>
            }
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={format(parse(created_at, 'dd-MM-yyyy HH:mm', new Date()), 'dd MMM yyyy')}
            secondary={format(parse(created_at, 'dd-MM-yyyy HH:mm', new Date()), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell align="left">{creator_name}</TableCell>

        <TableCell>{fCurrency(price)}</TableCell>

        <TableCell>
          {(() => {
            const getStatusColor = () => {
              if (status === 'published') return 'success';
              if (status === 'unpublished') return 'warning';
              return 'default';
            };

            return (
              <Label variant="soft" color={getStatusColor()}>
                {status === 'published' ? 'Dipublikasikan' : 'Tidak Dipublikasikan'}
              </Label>
            );
          })()}
        </TableCell>

        {/* <TableCell align="right"></TableCell> */}
        {/* <TableCell>
          <Label variant="soft" color={(publish === 'published' && 'info') || 'default'}>
            {publish}
          </Label>
        </TableCell> */}

        <TableCell align="right">
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Apa Anda yakin ingin menghapus produk ini?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteProduct}>
            {isPending ? 'Menghapus' : 'Hapus'}
          </Button>
        }
      />
    </>
  );
}

ProductTableRow.propTypes = {
  // onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
