import PropTypes from 'prop-types';
import { m } from 'framer-motion';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
// theme
import { bgGradient } from 'src/theme/css';
//
import { MotionContainer, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------
const CONTACTS = [
  {
    country: 'SMKN 1 Ciomas',
    address: 'Jl. Raya Laladon No.88, Ciomas, Bogor, Jawa Barat',
    // phoneNumber: '08xx-xxxx-xxxx',
  },
  { 
    country: 'Instagram',
    address: '@pplgcreations',
    phoneNumber: '-',
  },
  {
    country: 'WhatsApp',
    address: 'Hubungi kami langsung via WhatsApp',
    phoneNumber: '0821-2244-0455',
  },
  {
    country: 'Email',
    address: 'pplgcreations@gmail.com',
    phoneNumber: '-',
  },
];

// ----------------------------------------------------------------------

export default function ContactHero() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.grey[900], 0.8),
          imgUrl: '/assets/images/contact/hero.jpg',
        }),
        height: { md: 560 },
        py: { xs: 10, md: 0 },
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Container component={MotionContainer}>
        <Box
          sx={{
            bottom: { md: 80 },
            position: { md: 'absolute' },
            textAlign: { xs: 'center', md: 'unset' },
          }}
        >
<TextAnimate
  text="Dimana"
  variants={varFade().inRight}
  sx={{
    color: 'primary.main',
    typography: {
      xs: 'h1',    // Lebih besar di tampilan HP
      sm: 'h2',    // Ukuran di tablet lebih besar
      md: 'h1',    // Ukuran lebih besar lagi di laptop
    },
    fontWeight: 'bold',
    // textAlign: 'left', // Justify ke kiri
  }}
/>

<br />

<Stack
  spacing={2}
  display="inline-flex"
  direction="row"
  sx={{
    color: 'common.white',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',  // Menyesuaikan justify ke kiri
  }}
>
  <TextAnimate
    text="kamu"
    sx={{
      typography: {
        xs: 'h1',   // Ukuran lebih besar untuk HP
        sm: 'h1',   // Ukuran lebih besar di tablet
        md: 'h1',   // Ukuran lebih besar di laptop
      },
      textAlign: 'center',  // Justify ke kiri
    }}
  />
  <TextAnimate
    text="bisa"
    sx={{
      typography: {
        xs: 'h1',   // Ukuran lebih besar untuk HP
        sm: 'h1',   // Ukuran lebih besar di tablet
        md: 'h1',   // Ukuran lebih besar di laptop
      },
      textAlign: 'center',  // Justify ke kiri
    }}
  />
  <TextAnimate
    text="temukan"
    sx={{
      typography: {
        xs: 'h1',   // Ukuran lebih besar untuk HP
        sm: 'h1',   // Ukuran lebih besar di tablet
        md: 'h1',   // Ukuran lebih besar di laptop
      },
      textAlign: 'center',  // Justify ke kiri
    }}
  />
  <TextAnimate
    text="kami?"
    sx={{
      typography: {
        xs: 'h1',   // Ukuran lebih besar untuk HP
        sm: 'h1',   // Ukuran lebih besar di tablet
        md: 'h1',   // Ukuran lebih besar di laptop
      },
      textAlign: 'center',  // Justify ke kiri
    }}
  />
</Stack>


          <Stack
            spacing={5}
            alignItems={{ xs: 'center', md: 'unset' }}
            direction={{ xs: 'column', md: 'row' }}
            sx={{ mt: 5, color: 'common.white' }}
          >
            {CONTACTS.map((contact) => (
              <Stack key={contact.country} sx={{ maxWidth: 180 }}>
                <m.div variants={varFade().in}>
                  <Typography variant="h6" gutterBottom>
                    {contact.country}
                  </Typography>
                </m.div>

                <m.div variants={varFade().inRight}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {contact.address}
                  </Typography>
                  {contact.phoneNumber !== '-' && (
                    <Typography variant="body2" sx={{ opacity: 0.6 }}>
                      {contact.phoneNumber}
                    </Typography>
                  )}
                </m.div>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

function TextAnimate({ text, variants, sx, ...other }) {
  return (
    <Box
      component={m.div}
      sx={{
        typography: 'h1',
        overflow: 'hidden',
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      {text.split('').map((letter, index) => (
        <m.span key={index} variants={variants || varFade().inUp}>
          {letter}
        </m.span>
      ))}
    </Box>
  );
}

TextAnimate.propTypes = {
  sx: PropTypes.object,
  text: PropTypes.string,
  variants: PropTypes.object,
};
