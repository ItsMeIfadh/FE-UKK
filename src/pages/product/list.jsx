import { Helmet } from 'react-helmet-async';
// sections
import { ProductShopView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function ShopPage() {
  return (
    <>
      <Helmet>
        <title> PPLG Creations: Projects</title>
      </Helmet>

      <ProductShopView />
    </>
  );
}
