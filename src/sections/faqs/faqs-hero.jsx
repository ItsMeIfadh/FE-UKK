import PropTypes from 'prop-types';
import { m } from 'framer-motion';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
// theme
import { bgGradient } from 'src/theme/css';
// components
import Iconify from 'src/components/iconify';
import { MotionContainer, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function FaqsHero() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.grey[900], 0.8),
          imgUrl: '/assets/images/faqs/hero.jpg',
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
            textAlign: { xs: '', md: 'unset' },
          }}
        >
          <div>
            <TextAnimate
              text="Penasaran?"
              sx={{ color: 'primary.main' }}
              variants={varFade().inRight}
            />
            <br />

            <Stack spacing={1} sx={{ color: 'common.white' }}>
              <Stack
                direction="row"
                spacing={2}
                display="inline-flex"
                sx={{
                  flexWrap: 'wrap',
                }}
              >
                <TextAnimate text="Yuk," />
                <TextAnimate text="kita" />
                <TextAnimate text="kupas" />
              </Stack>

              <TextAnimate
                text="tuntas!"
                sx={{
                  fontWeight: 'bold',
                }}
              />
            </Stack>

          </div>

          <m.div variants={varFade().in}>
            <TextField
              fullWidth
              placeholder="Butuh solusi? Cari aja di sini!"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mt: 5,
                maxWidth: 360,
                [`& .${outlinedInputClasses.root}`]: {
                  bgcolor: 'common.white',
                },
                [`& .${outlinedInputClasses.input}`]: {
                  typography: 'subtitle1',
                },
              }}
            />
          </m.div>
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
