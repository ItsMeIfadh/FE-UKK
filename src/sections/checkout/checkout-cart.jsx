// @mui
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
// routes
// import { useQueryClient } from '@tanstack/react-query';
// import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import EmptyContent from 'src/components/empty-content';
//
import { useMutationPaymentProduct } from 'src/hooks/cart/useMutationCheckoutProduct';
import { useFetchAllCarts } from 'src/hooks/cart/useFetchAllCarts';
import { LoadingScreen } from 'src/components/loading-screen';
import { useCheckoutContext } from './context';
import CheckoutSummary from './checkout-summary';
import CheckoutCartProductList from './checkout-cart-product-list';

// ----------------------------------------------------------------------

export default function CheckoutCart() {

  const checkout = useCheckoutContext();
  const { data, isLoading, isFetching } = useFetchAllCarts()
  console.log(data?.cart)
  const empty = !data?.cart?.length;
  // const queryClient = useQueryClient()
  // const { enqueueSnackbar } = useSnackbar()
  const idProductMapped = data?.cart?.[0]?.product?.id
  const { mutate, isPending } = useMutationPaymentProduct({
    onSuccess: (response) => {
      const snapToken = response.snap_token;

      if (window.snap && snapToken) {
        window.snap.pay(snapToken, {
          onSuccess: (result) => {
            console.log('Pembayaran berhasil', result);
          },
          onPending: (result) => {
            console.log('Pembayaran pending', result);
          },
          onError: (result) => {
            console.error('Pembayaran error', result);
          },
          onClose: () => {
            console.log('Popup ditutup tanpa menyelesaikan pembayaran.');
          }
        });
      } else {
        console.error('Snap belum siap atau token tidak ada');
      }
    },
  }, idProductMapped)

  const handlePaymentMidtrans = () => {
    mutate()
  }
  // console.log(idProductMapped)
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (isLoading || isFetching) {
    return <LoadingScreen />
  }
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Cart
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;({checkout.totalItems} item)
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          {empty ? (
            <EmptyContent
              title="Cart is Empty!"
              description="Look like you have no items in your shopping cart."
              imgUrl="/assets/icons/empty/ic_cart.svg"
              sx={{ pt: 5, pb: 10 }}
            />
          ) : (
            <CheckoutCartProductList
              products={data.cart}
              onDelete={checkout.onDeleteCart}
              onIncreaseQuantity={checkout.onIncreaseQuantity}
              onDecreaseQuantity={checkout.onDecreaseQuantity}
            />
          )}
        </Card>

        <Button
          component={RouterLink}
          href={paths.product.root}
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Continue Shopping
        </Button>
      </Grid>

      <Grid xs={12} md={4}>
        <CheckoutSummary
          data={data}
          total={checkout.total}
          discount={checkout.discount}
          subTotal={checkout.subTotal}
          onApplyDiscount={checkout.onApplyDiscount}
        />

        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={empty}
          onClick={handlePaymentMidtrans}
        >
          {isPending ? 'Membayar' : 'Bayar Sekarang'}
        </Button>
      </Grid>
    </Grid>
  );
}
