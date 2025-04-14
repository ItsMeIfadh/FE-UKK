import { m } from 'framer-motion';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// components
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function ContactForm() {
  return (
    <Stack component={MotionViewport} spacing={5}>
      <m.div variants={varFade().inUp}>
        <Typography variant="h3">
          Jangan ragu untuk menghubungi kami. Kami terbuka untuk semua masukanmu!
        </Typography>
      </m.div>

      <Stack spacing={3}>
        <m.div variants={varFade().inUp}>
          <TextField fullWidth label="Nama Lengkap" />
        </m.div>

        <m.div variants={varFade().inUp}>
          <TextField fullWidth label="Alamat Email" />
        </m.div>

        <m.div variants={varFade().inUp}>
          <TextField fullWidth label="Subjek Pesan" />
        </m.div>

        <m.div variants={varFade().inUp}>
          <TextField fullWidth label="Tulis pesan kamu di sini..." multiline rows={4} />
        </m.div>
      </Stack>

      <m.div variants={varFade().inUp}>
        <Button size="large" variant="contained">
          Kirim Pesan
        </Button>
      </m.div>
    </Stack>
  );
}
