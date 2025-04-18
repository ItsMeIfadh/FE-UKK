import { Helmet } from 'react-helmet-async';
// sections
import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title> PPLG Creations: Dari Ide ke Inovasi, Semua Ada di Sini !</title>
      </Helmet>

      <HomeView />
    </>
  );
}
