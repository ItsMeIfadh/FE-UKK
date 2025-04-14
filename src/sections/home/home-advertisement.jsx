import { m } from 'framer-motion';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// theme
import { Typography } from '@mui/material';

import { bgGradient } from 'src/theme/css';
// routes
import { paths } from 'src/routes/paths';
// components
// import Iconify from 'src/components/iconify';
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function HomeAdvertisement() {
  const theme = useTheme();

  const renderDescription = (
    <Box
      sx={{
        textAlign: {
          xs: 'center',
          md: 'left',
        },
      }}
    >
<Typography
  component={m.div}
  variants={varFade().inDown}
  sx={{
    color: 'common.white',
    mb: 5,
    typography: {
      xs: 'h5',   // ukuran kecil di HP
      sm: 'h4',
      md: 'h2',   // ukuran besar di desktop
    },
    textAlign: 'center',
    fontWeight: 'bold',
  }}
>
  Jelajahi Inovasi Teknologi<br />
  dari Siswa PPLG SMKN 1 Ciomas
</Typography>


      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent={{ xs: 'center', md: 'flex-start' }}
        spacing={2}
      >
        <Button
          color="inherit"
          size="large"
          variant="contained"
          href={paths.projects} // ini tetap, kalau kamu memang mau navigasi
          sx={{
            color: 'grey.800',
            mx: 4, // padding horizontal
            py: 1.5, // padding vertical
            mt: 2, // margin top
            '&:hover': {
              transform: 'scale(1.05) translateY(-5px)',
              transition: 'transform 0.3s ease-in-out',
              bgcolor: 'white',
            },
            '&:not(:hover)': {
              transform: 'scale(1) translateY(0)',
              transition: 'transform 0.3s ease-in-out',
            },
            bgcolor: 'common.white',
          }}
        >
          Lihat Project
        </Button>

        {/* 
        <m.div variants={varFade().inRight}>
          <Button
            color="inherit"
            size="large"
            variant="outlined"
            target="_blank"
            rel="noopener"
            href={paths.freeUI}
            endIcon={<Iconify icon="eva:external-link-fill" width={16} sx={{ mr: 0.5 }} />}
            sx={{
              color: 'common.white',
              '&:hover': { borderColor: 'currentColor' },
            }}
          >
            Get Free Version
          </Button>
        </m.div> */}
      </Stack>
    </Box>
  );

  const renderImg = (
    <Stack component={m.div} variants={varFade().inUp} alignItems="center">
      <Box
        component={m.img}
        animate={{
          y: [-20, 0, -20],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        alt="rocket"
        src="/assets/images/home/rocket.webp"
        sx={{ maxWidth: 460 }}
      />
    </Stack>
  );

  return (
    <Container component={MotionViewport}>
      <Stack
        alignItems="center"
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          ...bgGradient({
            direction: '135deg',
            startColor: theme.palette.primary.main,
            endColor: theme.palette.primary.dark,
          }),
          borderRadius: 2,
          pb: { xs: 5, md: 0 },
        }}
      >
        {renderImg}

        {renderDescription}
      </Stack>
    </Container>
  );
}
