import React, { useState, FC } from 'react';
import Modal from '../../../../components/Layout/Modal';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import servIcon1 from '../../../../assets/images/services/serv-icon-1.svg';
import servIcon2 from '../../../../assets/images/services/serv-icon-2.svg';
import servIcon3 from '../../../../assets/images/services/serv-icon-3.svg';
import servIcon4 from '../../../../assets/images/services/serv-icon-4.svg';
import servicesData from '../../../../data/demo.json';
import { markdownToHTML } from '../../../../utils/converter';

interface UseCase {
  id: string;
  name: string;
  explanation?: string;
  simulationApiEndpoint?: string;
}

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

interface ArrowProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const NextArrow: FC<ArrowProps> = ({ onClick }) => (
  <div className="slick-next custom-next-arrow" onClick={onClick}>
    <span>&#8594;</span>
  </div>
);

const PrevArrow: FC<ArrowProps> = ({ onClick }) => (
  <div className="slick-prev custom-prev-arrow" onClick={onClick}>
    <span>&#8592;</span>
  </div>
);

const Industries: FC = () => {
  const [currentModalData, setCurrentModalData] = useState<ServiceBox | null>(null);

  const openModal = (industryData: ServiceBox) => setCurrentModalData(industryData);
  const closeModal = () => setCurrentModalData(null);

  const images = [servIcon1, servIcon2, servIcon3, servIcon4];

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
        {servicesData.paragraphes.map((text, i) => (
          <p key={`p-${i}`} className="mb-4" dangerouslySetInnerHTML={{ __html: markdownToHTML(text) }}></p>
        ))}
      </div>

      <div className="max-w-xl mx-auto">
        <Slider {...settings}>
          {servicesData.servicesBoxes.map((servBox, i) => (
            <div key={`serv-box-${i}`}>
              <img src={images[i % images.length]} alt={servBox.imageAltText} className="mx-auto" />
              <h4 className="text-xl font-medium mt-4 text-center">{servBox.IndustryTitle}</h4>
              <p className="text-center">{servBox.IndustryDesc}</p>
              <div className="text-center mt-4">
                <button
                  onClick={() => openModal(servBox)}
                  className="text-white bg-black border border-blue-500 hover:border-transparent rounded py-2 px-4 hover:bg-blue-500 transition duration-300 ease-in-out"
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
          closeModal={closeModal}
          industryData={currentModalData} // Ensure ModalProps accepts ServiceBox type for industryData
        />
      )}
    </section>
  );
};

export default Industries;
