import { useCallback, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// routes
import { useParams } from 'react-router';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useFetchProductById } from 'src/hooks/product/useFetchProductById';
import CartIcon from '../common/cart-icon';
import { ProductDetailsSkeleton } from '../product-skeleton';
import ProductDetailsSummary from '../product-details-summary';
import ProductDetailsCarousel from '../product-details-carousel';
import ProductDetailsDescription from '../product-details-description';
import { useCheckoutContext } from '../../checkout/context';

const SUMMARY = [
  {
    title: '100% Original',
    description: 'Semua produk dijamin asli buatan siswa-siswi SMK berkualitas dan telah melalui proses kurasi.',
    icon: 'solar:verified-check-bold',
  },
  {
    title: '10 Day Replacement',
    description: 'Jika terjadi bug atau kesalahan fungsi, produk dapat diganti dalam waktu 10 hari.',
    icon: 'solar:clock-circle-bold',
  },
  {
    title: 'Year Warranty',
    description: 'Garansi dukungan teknis selama 3 bulan untuk semua produk yang tersedia.',
    icon: 'solar:shield-check-bold',
  },
];


export default function ProductShopDetailsView() {
  const { id } = useParams();
  const settings = useSettingsContext();
  const checkout = useCheckoutContext();

  const [currentTab, setCurrentTab] = useState('description');

  const { data, isLoading, error } = useFetchProductById(id);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleAddToCart = () => {
    // ganti ini dengan logika nyata jika kamu punya
    console.log('Add to cart clicked');
  };

  const handleGotoStep = (step) => {
    // ganti ini juga jika punya implementasi checkout step
    console.log('Go to step:', step);
  };

  const renderSkeleton = <ProductDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title="Product tidak ditemukan"
      action={
        <Button
          component={RouterLink}
          href={paths.product.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Kembali ke list produk
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderProduct = data && (
    <>
      <CustomBreadcrumbs
        links={[
          { name: 'Home', href: '/' },
          { name: 'Shop', href: paths.product.root },
          { name: data?.data?.title },
        ]}
        sx={{ mb: 5 }}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel product={data?.data} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          <ProductDetailsSummary
            product={data?.data}
            onAddCart={handleAddToCart}
            onGotoStep={handleGotoStep}
          />
        </Grid>
      </Grid>

      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{ my: 10 }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Card>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {[
            {
              value: 'description',
              label: 'Description',
            },
            {
              value: 'reviews',
              label: `Reviews (3)`,
            },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {currentTab === 'description' && (
          <ProductDetailsDescription description={data?.data?.description} />
        )}

        {/* Jika ingin menambahkan review, aktifkan ini */}
        {/* {currentTab === 'reviews' && (
          <ProductDetailsReview
            ratings={data?.data?.ratings}
            reviews={data?.data?.reviews}
            totalRatings={data?.data?.totalRatings}
            totalReviews={data?.data?.totalReviews}
          />
        )} */}
      </Card>
    </>
  );

  return (
    <Container
      // maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{ mt: 5, mb: 15 }}
    >
      <CartIcon totalItems={checkout.totalItems} />
      {isLoading && renderSkeleton}
      {error && renderError}
      {data && renderProduct}
    </Container>
  );
}
