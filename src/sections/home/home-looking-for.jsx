import { m } from 'framer-motion';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function HomeLookingFor() {
  const mdUp = useResponsive('up', 'md');

  const renderBtn = (
    <Button
      color="inherit"
      size="large"
      variant="outlined"
      // target="_blank"
      rel="noopener"
      href={paths.product.root}
      endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
    >
Lihat Karya Kami    </Button>
  );

  const renderDescription = (
    <Stack
      sx={{
        textAlign: {
          xs: 'center',
          md: 'left',
        },
      }}
    >
      <m.div variants={varFade().inDown}>
        <Typography
          variant="h2"
          sx={{
            mt: 3,
            mb: { md: 5 },
          }}
        >
          Kreativitas dari SMKN 1 Ciomas
        </Typography>
      </m.div>

      <m.div variants={varFade().inDown}>
        <Typography sx={{ color: 'text.secondary', mb: 3 }}>
          Website ini memamerkan berbagai produk digital karya siswa dan alumni SMKN 1 Ciomas, seperti aplikasi web, e-learning, e-commerce, dan masih banyak lagi.
          Temukan inspirasi, dukung talenta muda, dan jangan ragu untuk menjelajahi atau membeli karya mereka.
        </Typography>
      </m.div>

      {mdUp && <m.div variants={varFade().inDown}> {renderBtn} </m.div>}
    </Stack>
  );

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
      }}
    >
      <Grid container alignItems="center" justifyContent="space-between" spacing={{ xs: 5, md: 0 }}>
        <Grid xs={12} md={4}>
          {renderDescription}
        </Grid>

        <Grid xs={12} md={7}>
          <m.div variants={varFade().inUp}>
            <Image disabledEffect alt="rocket" src="/assets/images/home/zone_landing.webp" />
          </m.div>
        </Grid>

        {!mdUp && (
          <Grid xs={12} sx={{ textAlign: 'center' }}>
            {renderBtn}
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
