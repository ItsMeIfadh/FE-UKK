import PropTypes from 'prop-types';
import { useEffect } from 'react';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
// theme
import { bgGradient } from 'src/theme/css';
// components
import Image from 'src/components/image';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import Carousel, { CarouselArrowIndex, useCarousel } from 'src/components/carousel';

// ----------------------------------------------------------------------

const THUMB_SIZE = 64;

const StyledThumbnailsContainer = styled('div')(({ length, theme }) => ({
  position: 'relative',
  margin: theme.spacing(0, 'auto'),
  '& .slick-slide': {
    lineHeight: 0,
  },

  ...(length === 1 && {
    maxWidth: THUMB_SIZE * 1 + 16,
  }),

  ...(length === 2 && {
    maxWidth: THUMB_SIZE * 2 + 32,
  }),

  ...((length === 3 || length === 4) && {
    maxWidth: THUMB_SIZE * 3 + 48,
  }),

  ...(length >= 5 && {
    maxWidth: THUMB_SIZE * 6,
  }),

  ...(length > 3 && {
    '&:before, &:after': {
      ...bgGradient({
        direction: 'to left',
        startColor: `${alpha(theme.palette.background.default, 0)} 0%`,
        endColor: `${theme.palette.background.default} 100%`,
      }),
      top: 0,
      zIndex: 9,
      content: "''",
      height: '100%',
      position: 'absolute',
      width: (THUMB_SIZE * 2) / 3,
    },
    '&:after': {
      right: 0,
      transform: 'scaleX(-1)',
    },
  }),
}));

// ----------------------------------------------------------------------

export default function ProductDetailsCarousel({ product }) {
  const theme = useTheme();

  const slides = [product.image]; // ubah jadi array agar kompatibel
  console.log(product.image);


  const lightbox = useLightBox(slides);

  const carouselLarge = useCarousel({
    rtl: false,
    draggable: false,
    adaptiveHeight: true,
  });

  const carouselThumb = useCarousel({
    rtl: false,
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    variableWidth: true,
    centerPadding: '0px',
    slidesToShow: 1,
  });

  useEffect(() => {
    carouselLarge.onSetNav();
    carouselThumb.onSetNav();
  }, [carouselLarge, carouselThumb]);

  useEffect(() => {
    if (lightbox.open) {
      carouselLarge.onTogo(lightbox.selected);
    }
  }, [carouselLarge, lightbox.open, lightbox.selected]);

  const renderLargeImg = (
    <Box
      sx={{
        mb: 3,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Carousel
        {...carouselLarge.carouselSettings}
        asNavFor={carouselThumb.nav}
        ref={carouselLarge.carouselRef}
      >
        <Image
          key="amoled"
          alt={slides[0]}
          src={slides[0]}
          ratio="1/1"
          onClick={() => lightbox.onOpen(slides[0])}
          sx={{ cursor: 'zoom-in' }}
        />
      </Carousel>

      <CarouselArrowIndex
        index={carouselLarge.currentIndex}
        total={slides.length}
        onNext={carouselThumb.onNext}
        onPrev={carouselThumb.onPrev}
      />
    </Box>
  );


  // const renderLargeImg = (
  //   <Box
  //     sx={{
  //       mb: 3,
  //       borderRadius: 2,
  //       overflow: 'hidden',
  //       position: 'relative',
  //     }}
  //   >
  //     <Carousel
  //       {...carouselLarge.carouselSettings}
  //       asNavFor={carouselThumb.nav}
  //       ref={carouselLarge.carouselRef}
  //     >
  //       <Image
  //         alt="product-image"
  //         src={slides[0]} // ✅ fix
  //         ratio="1/1"
  //         onClick={() => lightbox.onOpen(0)} // karena cuma 1 gambar, index 0
  //         sx={{ cursor: 'zoom-in' }}
  //       />
  //     </Carousel>

  //     <CarouselArrowIndex
  //       index={carouselLarge.currentIndex}
  //       total={1}
  //       onNext={carouselThumb.onNext}
  //       onPrev={carouselThumb.onPrev}
  //     />
  //   </Box>
  // );


  const renderThumbnails = (
    <StyledThumbnailsContainer length={1}>
      <Carousel
        {...carouselThumb.carouselSettings}
        asNavFor={carouselLarge.nav}
        ref={carouselThumb.carouselRef}
      >
        <Box sx={{ px: 0.5 }}>
          <Avatar
            alt="o"
            src={slides[0]} // ✅ fix
            variant="rounded"
            sx={{
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              border: `solid 2.5px ${theme.palette.primary.main}`,
              cursor: 'pointer',
            }}
          />
        </Box>
      </Carousel>
    </StyledThumbnailsContainer>
  );


  return (
    <Box
      sx={{
        '& .slick-slide': {
          float: theme.direction === 'rtl' ? 'right' : 'left',
        },
      }}
    >
      {renderLargeImg}

      {renderThumbnails}

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
        onGetCurrentIndex={(index) => lightbox.setSelected(index)}
      />
    </Box>
  );
}

ProductDetailsCarousel.propTypes = {
  product: PropTypes.object,
};
