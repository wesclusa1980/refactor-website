import React, { useState, FC } from 'react';
import Modal from '../../../../components/Layout/Modal';

// Images
import servIcon1 from '../../../../assets/images/services/serv-icon-1.svg';
import servIcon2 from '../../../../assets/images/services/serv-icon-2.svg';
import servIcon3 from '../../../../assets/images/services/serv-icon-3.svg';
import servIcon4 from '../../../../assets/images/services/serv-icon-4.svg';

// Data
import servicesData from '../../../../data/demo.json';
import { markdownToHTML } from '../../../../utils/converter';

// Define the ServiceBox type
type ServiceBox = {
  imageAltText: string;
  IndustryTitle: string;
  IndustryDesc: string;
  LinkDesc: string;
  ModalName: string;
};

const Industries: FC = () => {
  // State to track which modal is open
  const [currentModalData, setCurrentModalData] = useState<ServiceBox | null>(null);

  // Function to open the modal with the given industry data
  const openModal = (industryData: ServiceBox) => {
    setCurrentModalData(industryData);
  };

  // Function to close the modal
  const closeModal = () => {
    setCurrentModalData(null);
  };

  const images: string[] = [servIcon1, servIcon2, servIcon3, servIcon4];

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
      <div className="flex flex-wrap -mx-4">
        {servicesData.servicesBoxes.map((servBox: ServiceBox, i: number) => (
          <div className="w-full sm:w-1/2 px-4 mb-8" key={'serv-box-' + i}>
            <img src={images[i]} alt={servBox.imageAltText} className="mx-auto" />
            <h4 className="text-xl font-medium mt-4 text-center">{servBox.IndustryTitle}</h4>
            <p className="text-center">{servBox.IndustryDesc}</p>
            <div className="text-center">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openModal(servBox);
                }}
                className="text-blue-600 hover:underline"
              >
                {servBox.LinkDesc}
              </a>
            </div>
          </div>
        ))}
      </div>
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
