import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
// _mock
import { _faqs } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';

export default function FaqsList() {
  return (
    <div>
      {_faqs.map((accordion) => (
        <Accordion 
          key={accordion.id}
          sx={{
            mb: 2,
            '& .MuiAccordionSummary-root': {
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 1, sm: 2 },
            },
            '& .MuiAccordionDetails-root': {
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 1, sm: 2 },
            },
          }}
        >
          <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: {
                  xs: '1rem',
                  sm: '1.1rem',
                  md: '1.25rem',
                },
                fontWeight: '',
              }}
            >
              {accordion.heading}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography
              sx={{
                fontSize: {
                  xs: '0.875rem',
                  sm: '1rem',
                },
              }}
            >
              {accordion.detail}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
