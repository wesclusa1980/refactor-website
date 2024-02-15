import React, { useState, FC } from 'react';
import Modal from '../../../../components/Layout/Modal';
import Slider from 'react-slick'; // Import the Slider component

// Import slick carousel styles
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Images
import servIcon1 from '../../../../assets/images/services/serv-icon-1.svg';
import servIcon2 from '../../../../assets/images/services/serv-icon-2.svg';
import servIcon3 from '../../../../assets/images/services/serv-icon-3.svg';
import servIcon4 from '../../../../assets/images/services/serv-icon-4.svg';

// Data
import servicesData from '../../../../data/demo.json';
import { markdownToHTML } from '../../../../utils/converter';

type ServiceBox = {
  imageAltText: string;
  IndustryTitle: string;
  IndustryDesc: string;
  LinkDesc: string;
  ModalName: string;
  brand: number;
  programid: number;
  templateId: number;
  templateTierId: number;
  useCases: UseCase[]; 
};
interface UseCase {
  id: string;
  name: string;
}
// Define a type for the arrow props
interface ArrowProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

// Custom Next Arrow
// Custom Next Arrow
const NextArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <div
    className="slick-next custom-next-arrow"
    onClick={onClick}
    style={{ 
      cursor: "pointer", 
      color: "black", // Set arrow color to black
      fontSize: "24px", // Set a font size for larger arrows
      // Add more styles here as needed
    }}
  >
     <span>&#8594;</span>
  </div>
);

// Custom Prev Arrow
const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <div
    className="slick-prev custom-prev-arrow"
    onClick={onClick}
    style={{ 
      cursor: "pointer", 
      color: "black", // Set arrow color to black
      fontSize: "24px", // Set a font size for larger arrows
      // Add more styles here as needed
    }}
  >
    <span>&#8592;</span>
  </div>
);


const Industries: FC = () => {
  const [currentModalData, setCurrentModalData] = useState<ServiceBox | null>(null);

  const openModal = (industryData: ServiceBox) => {
    setCurrentModalData(industryData);
  };

  const closeModal = () => {
    setCurrentModalData(null);
  };

  const images: string[] = [servIcon1, servIcon2, servIcon3, servIcon4];

  // Configuration for the react-slick carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  return (
    <section id="services" className="section py-20">
      <div className="max-w-xl mx-auto mb-10">
        <h2 className="text-4xl font-bold mb-4">{servicesData.title}</h2>
        <div className="text-lg mb-8">{servicesData.description}</div>
        {servicesData.paragraphes.map((text: string, i: number) => (
          <p key={'p-' + i} className="mb-4" dangerouslySetInnerHTML={{ __html: markdownToHTML(text) }}></p>
        ))}
      </div>

      <div className="max-w-xl mx-auto">
        <Slider {...settings}>
          {servicesData.servicesBoxes.map((servBox: ServiceBox, i: number) => (
            <div key={'serv-box-' + i}>
              <img src={images[i % images.length]} alt={servBox.imageAltText} className="mx-auto" />
              <h4 className="text-xl font-medium mt-4 text-center">{servBox.IndustryTitle}</h4>
              <p className="text-center">{servBox.IndustryDesc}</p>
              <div className="text-center">
                <br></br>
              <button
                onClick={() => openModal(servBox)}
                className="text-white hover:underline bg-black border border-blue-500 hover:border-transparent rounded py-2 px-4"
              >
                {servBox.LinkDesc}
              </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {currentModalData && (
        <Modal
          showModal={Boolean(currentModalData)}
          industryData={currentModalData}
          closeModal={closeModal}
        />
      )}
    </section>
  );
};

export default Industries;
