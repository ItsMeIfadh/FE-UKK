import { Helmet } from 'react-helmet-async';
// sections
import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Helmet>
      <title>PPLG Creations | Showcase & Marketplace Karya Siswa SMKN 1 Ciomas</title>
      </Helmet>

      <HomeView />
    </>
  );
}
