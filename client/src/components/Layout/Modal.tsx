import React, { useState, FC } from 'react';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import axios from 'axios';
import QRCode from 'qrcode.react';
import './modal.css';
import IndustryData from '../../data/demo.json';

// Utility functions to check the device type
const isAppleMobileDevice = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);
const isAndroidMobileDevice = () => /Android/i.test(navigator.userAgent);
// Types
type IndustryData = {
  IndustryTitle: string;
  LinkDesc: string;
  ModalName: string;
  brand: string;
  programid: string;
  templateId: string;
  templateTierId?: string;
};

type ModalProps = {
  showModal: boolean;
  industryData: IndustryData;
  closeModal: () => void;
};

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
};

type ServerState = {
  submitting: boolean;
  status: { ok: boolean; msg: string } | null;
};

const Modal: FC<ModalProps> = ({ showModal, industryData, closeModal }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
  });
  const [showUseCasesButton, setShowUseCasesButton] = useState<boolean>(false); // New state to control button display
  const [serverState, setServerState] = useState<ServerState>({
    submitting: false,
    status: null,
  });
  const [walletLink, setWalletLink] = useState<string>('');
  const [showQRCode, setShowQRCode] = useState<boolean>(false); // State to control QR code display

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const goToUseCases = () => {
    // Set a flag
    localStorage.setItem('scrollToUseCases', 'true');
    // Close the modal
    closeModal(); 
    // Refresh the page
    window.location.reload();
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerState({ submitting: true, status: null });

    const templateTierId = industryData.templateTierId;
    const brand = industryData.brand;
    const programid = industryData.programid
    const templateId = industryData.templateId
    const issueWalletData = { 
      person: formData, 
      templateTierId, 
      brand,
      templateId,
      programid,
      passdata: {
        metaData: {
          memberTier: "New" 
        },
        points: "10"
      }
    };
    
    const baseURL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';
    try {
      const walletResponse = await axios.post(`${baseURL}/issue-wallet`, issueWalletData);
      if (walletResponse.data && walletResponse.data.downloadUrl) {
        const fullUrl = `https://wallet-pass-sandbox.bambumeta.software${walletResponse.data.downloadUrl}`;
        const { firstName, lastName, email, company } = formData;
        const passId = walletResponse.data.passId; 
        setShowQRCode(true); // Set flag to show QR code
        setShowUseCasesButton(true);
        // Set the pandaCookie here with the received data
        document.cookie = `pandaCookie=${encodeURIComponent(JSON.stringify({
        firstName,
        lastName,
        email,
        company,
        passId
      }))};path=/;max-age=31536000;Secure`;

        // Check if the user is on a mobile device
        if (isAppleMobileDevice() || isAndroidMobileDevice()) {
          window.location.href = fullUrl;
        } else {
          setWalletLink(fullUrl);
        }
      } else {
        console.log('No download URL received in response');
        setServerState({
          submitting: false,
          status: { ok: false, msg: 'No download URL received' },
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setServerState({
        submitting: false,
        status: { ok: false, msg: error.response ? error.response.data.message : error.message },
      });
    }
  };

  const modalDisplayStyle = showModal ? { display: 'block' } : { display: 'none' };

  return (
    <div className={`fixed inset-0 z-50 ${showModal ? 'flex' : 'hidden'} items-start pt-20 justify-center bg-black bg-opacity-50`}>
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-lg w-full m-4 relative">
        
        {/* Close Button */}
        <button className="text-2xl absolute top-4 right-4 font-bold" onClick={closeModal}>&times;</button>
        
        {/* Conditional Content: Form or QR Code */}
        {showQRCode ? (
          <div className="flex flex-col items-center justify-center h-full">
            <QRCode value={walletLink} size={256} level={"H"} includeMargin={true} />
            <p className="mt-4">Scan the QR code to download your wallet pass.</p>
            {showUseCasesButton && (
              <button onClick={goToUseCases} className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 focus:outline-none relative">Go to Use Cases</button>
            )}
          </div>
        ) : (
          // Render the form when showQRCode is false
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6">Tell us about yourself</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* First Name Input */}
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full border-b-2 border-gray-300 focus:border-black focus:outline-none py-2"
              />
              {/* Last Name Input */}
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full border-b-2 border-gray-300 focus:border-black focus:outline-none py-2"
              />
              {/* Email Input */}
              <input
                type="email" // Changed to type="email" for proper validation
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border-b-2 border-gray-300 focus:border-black focus:outline-none py-2"
              />
              {/* Company Input */}
              <input
                type="text"
                name="company"
                placeholder="Company"
                required
                value={formData.company}
                onChange={handleInputChange}
                className="w-full border-b-2 border-gray-300 focus:border-black focus:outline-none py-2"
              />
              
              {/* Industry Selection Confirmation */}
              <p className="text-sm mt-4">
                You selected <strong>{industryData.IndustryTitle}</strong> as your industry.
              </p>

              
              {/* Form Buttons */}
              <div className="flex items-center justify-center space-x-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-800 hover:bg-gray-100 focus:outline-none"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={serverState.submitting}
                  className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 focus:outline-none relative"
                >
                  {serverState.submitting ? (
                    <div className="spinner" /> // Your spinner element
                  ) : (
                    "Submit"
                  )}
                </button>

              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );  
};

export default Modal;
