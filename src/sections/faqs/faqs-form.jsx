import { m } from 'framer-motion';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
// 
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function FaqsForm() {
  return (
    <Stack component={MotionViewport} spacing={3}>
      <m.div variants={varFade().inUp}>
        <Typography variant="h4">Belum menemukan bantuan yang tepat?</Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField fullWidth label="Nama Anda" />
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField fullWidth label="Email Anda" />
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField fullWidth label="Subjek Pertanyaan" />
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField fullWidth label="Tipe Pertanyaan" select>
          <MenuItem value="teknis">Masalah Teknis</MenuItem>
          <MenuItem value="lisensi">Pertanyaan Lisensi</MenuItem>
          <MenuItem value="generalis">Pertanyaan Umum</MenuItem>
        </TextField>
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField fullWidth label="Pilih Software" select>
          <MenuItem value="software1">Software 1</MenuItem>
          <MenuItem value="software2">Software 2</MenuItem>
          <MenuItem value="software3">Software 3</MenuItem>
        </TextField>
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField fullWidth label="Tuliskan pesan atau pertanyaan Anda" multiline rows={4} />
      </m.div>

      <m.div variants={varFade().inUp}>
        <Button size="large" variant="contained">
          Kirim Sekarang
        </Button>
      </m.div>
    </Stack>
  );
}
