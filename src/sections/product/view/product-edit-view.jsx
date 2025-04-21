import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// api
import { useGetProduct } from 'src/api/product';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ProductNewEditForm from '../product-new-edit-form';
import { useFetchProductById } from 'src/hooks/product/useFetchProductById';
import { LoadingScreen } from 'src/components/loading-screen';
import { useParams } from 'react-router';

// ----------------------------------------------------------------------

export default function ProductEditView() {
  const settings = useSettingsContext();
  const { id } = useParams();
  const { data: currentProduct, isLoading, isFetching } = useFetchProductById(id);
  // console.log(currentProduct)
  if (isLoading || isFetching) {
    return <LoadingScreen />; // You can replace this with a loading spinner or skeleton component
  }
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Product',
            href: paths.dashboard.product.root,
          },
          { name: currentProduct?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductNewEditForm currentProduct={currentProduct} />
    </Container>
  );
}

ProductEditView.propTypes = {
  id: PropTypes.string,
};
