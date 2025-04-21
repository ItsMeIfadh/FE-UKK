import { Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { ProductShopDetailsView } from 'src/sections/product/view';
import ProductDetailPage from './ProductDetailPage';

// ----------------------------------------------------------------------

export default function ProductShopDetailsPage() {

  return (
    <>
      <Helmet>
        <title> Product: Details</title>
      </Helmet>
      {/* <Typography>sahdjsahdj</Typography> */}
      <ProductShopDetailsView />
    </>
  );
}
