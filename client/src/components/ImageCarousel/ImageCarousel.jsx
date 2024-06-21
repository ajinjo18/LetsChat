import Carousel from 'react-bootstrap/Carousel';
import { baseUrl } from '../../utils/baseUrl';

const  ImageCarousel = ({ images }) => {

  return (
    <Carousel>
    {images.map((image, index) => (
      <Carousel.Item key={index}>
        <div style={{ overflow: 'hidden', width: '100%', height: '100%', padding:'10px' }}>
          <img
            src={`${baseUrl}/img/${image}`}
            alt={`Slide ${index + 1}`}
            style={{ maxWidth: '100%', maxHeight: '100%', minHeight: '100%', borderRadius: '10px' }}
          />
        </div>
      </Carousel.Item>
    ))}
  </Carousel>
  );
}

export default ImageCarousel;
