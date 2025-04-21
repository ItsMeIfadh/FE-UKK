import { Helmet } from 'react-helmet-async';
// sections
import { ProductShopView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function ShopPage() {
  return (
    <>
      <Helmet>
        <title> WebKu: Projects</title>
      </Helmet>

      <ProductShopView />
    </>
  );
}
