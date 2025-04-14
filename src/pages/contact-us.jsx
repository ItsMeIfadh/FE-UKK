import { Helmet } from 'react-helmet-async';
// sections
import { ContactView } from 'src/sections/contact/view';

// ----------------------------------------------------------------------

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title> PPLG Creations: Contact us</title>
      </Helmet>

      <ContactView />
    </>
  );
}
