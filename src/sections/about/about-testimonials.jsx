import PropTypes from 'prop-types';
import { m } from 'framer-motion';
// @mui
import Masonry from '@mui/lab/Masonry';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// utils
import { fDate } from 'src/utils/format-time';
// _mock
import { _testimonials } from 'src/_mock';  // You can update this to fetch real testimonials data
// theme
import { bgBlur, bgGradient, hideScroll } from 'src/theme/css';
// components
import Iconify from 'src/components/iconify';
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function AboutTestimonials() {
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');

  const renderLink = (
    <Button color="primary" endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}>
      Baca lebih banyak testimoni
    </Button>
  );

  const renderDescription = (
    <Box
      sx={{
        maxWidth: { md: 700 },
        textAlign: { xs: 'center', md: 'unset' },
      }}
    >
      <m.div variants={varFade().inUp}>
        <Typography variant="overline" sx={{ color: 'common.white', opacity: 0.48 }}>
          Testimoni
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography variant="h2" sx={{ my:3, color: 'common.white' }}>
          Apa kata mereka tentang <br />
          PPLG Creations
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography sx={{ color: 'common.white' }}>
          Kami di PPLG Creations berkomitmen untuk memberikan karya terbaik yang bisa dinikmati oleh semua. 
          Mendengarkan umpan balik dari pengguna adalah bagian penting dari perkembangan kami.
        </Typography>
      </m.div>

      {!mdUp && (
        <Box
          component={m.div}
          variants={varFade().inUp}
          sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
        >
          {renderLink}
        </Box>
      )}
    </Box>
  );

  const renderContent = (
    <Box
      sx={{
        py: { md: 10 },
        height: { md: 1 },
        ...(mdUp && {
          ...hideScroll.y,
        }),
      }}
    >
      <Masonry spacing={3} columns={{ xs: 1, md: 2 }} sx={{ ml: 0 }}>
        {_testimonials.map((testimonial) => (
          <m.div key={testimonial.name} variants={varFade().inUp}>
            <TestimonialCard testimonial={testimonial} />
          </m.div>
        ))}
      </Masonry>
    </Box>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.grey[900], 0.9),
          imgUrl: '/assets/images/about/testimonials.jpg',  // You can replace with a more relevant image
        }),
        overflow: 'hidden',
        height: { md: 840 },
        py: { xs: 10, md: 0 },
      }}
    >
      <Container component={MotionViewport} sx={{ position: 'relative', height: 1 }}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent={{ xs: 'center', md: 'space-between' }}
          sx={{ height: 1 }}
        >
          <Grid xs={10} md={4}>
            {renderDescription}
          </Grid>

          <Grid
            xs={12}
            md={7}
            lg={6}
            alignItems="center"
            sx={{
              height: 1,
            }}
          >
            {renderContent}
          </Grid>
        </Grid>

        {mdUp && (
          <Box
            component={m.div}
            variants={varFade().inUp}
            sx={{ bottom: 60, position: 'absolute' }}
          >
            {renderLink}
          </Box>
        )}
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

function TestimonialCard({ testimonial, sx, ...other }) {
  const theme = useTheme();
  const { name, ratingNumber, postedDate, content, avatarUrl } = testimonial;

  return (
    <Stack
      spacing={3}
      sx={{
        ...bgBlur({
          color: theme.palette.common.white,
          opacity: 0.08,
        }),
        p: 3,
        borderRadius: 2,
        color: 'common.white',
        ...sx,
      }}
      {...other}
    >
      <Iconify icon="mingcute:quote-left-fill" width={40} sx={{ opacity: 0.48 }} />

      <Typography variant="body2">{content}</Typography>

      <Rating value={ratingNumber} readOnly size="small" />

      <Stack direction="row">
        <Avatar alt={name} src={avatarUrl} sx={{ mr: 2 }} />

        <ListItemText
          primary={name}
          secondary={fDate(postedDate)}
          primaryTypographyProps={{
            typography: 'subtitle2',
            mb: 0.5,
          }}
          secondaryTypographyProps={{
            typography: 'caption',
            color: 'inherit',
            sx: { opacity: 0.64 },
          }}
        />
      </Stack>
    </Stack>
  );
}

TestimonialCard.propTypes = {
  sx: PropTypes.object,
  testimonial: PropTypes.object,
};
