import { Helmet } from 'react-helmet-async';
// sections
import { OverviewAppView } from 'src/sections/overview/app/view';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> PPLG Creators: Admin Dashboard</title>
      </Helmet>

      <OverviewAppView />
    </>
  );
}
