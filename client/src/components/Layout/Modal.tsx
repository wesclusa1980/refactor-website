import React, { useState, FC } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import LinkedInAuthButton from '../../utils/LinkedInAuthButton';
import './modal.css';

const isAppleMobileDevice = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);
const isAndroidMobileDevice = () => /Android/i.test(navigator.userAgent);

type IndustryData = {
  IndustryTitle: string;
  LinkDesc: string;
  ModalName: string;
  brand: number;
  programid: number;
  templateId: number;
  templateTierId?: number;
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
  downloadUrl?: string;
  qrCodeFrontendUrl?: string; 
};

const Modal: FC<ModalProps> = ({ showModal, industryData, closeModal }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
  });
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [serverState, setServerState] = useState<ServerState>({
    submitting: false,
    status: null,
  });

  const responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if ('profileObj' in response) {
      const { givenName, familyName, email } = response.profileObj;
      setFormData({ ...formData, firstName: givenName, lastName: familyName, email: email });
      setIsSignedIn(true);
    } else {
      console.error('Google Sign-In error:', response);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerState({ submitting: true, status: null });
  
    // Assuming you have an endpoint to issue the wallet and return a download URL
    const issueWalletData = {
      person: formData,
      templateTierId: industryData.templateTierId,
      brand: industryData.brand,
      templateId: industryData.templateId,
      programid: industryData.programid,
      // Add any additional data required by your backend
    };
  
    const baseURL = import.meta.env.VITE_REACT_APP_API_URL; // Ensure this is defined in your environment
  
    try {
      // Replace '/issue-wallet' with your actual endpoint
      const response = await axios.post(`${baseURL}/issue-wallet`, issueWalletData);
  
      if (response.data && response.data.downloadUrl) {
        // Success: Update state with download URL and any other relevant info
        setServerState({
          submitting: false,
          status: { ok: true, msg: 'Wallet issued successfully.' },
          downloadUrl: response.data.downloadUrl,
          qrCodeFrontendUrl: response.data.qrCodeFrontendUrl, // Assuming this is also part of the response
        });
      } else {
        // The response is missing expected data
        setServerState({
          submitting: false,
          status: { ok: false, msg: 'The response is missing the download URL.' },
        });
      }
    } catch (error) {
      // Error handling: Update state with error message
      setServerState({
        submitting: false,
        status: { ok: false, msg: error.response ? error.response.data.message : 'An error occurred while issuing the wallet.' },
      });
    }
  };
  

  return (
   <div className={`fixed inset-0  z-50 ${showModal ? 'flex overflow-auto' : 'hidden'} items-start pt-20 justify-center bg-black bg-opacity-50`}>
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-lg w-full m-4 relative overflow-auto max-h-screen">
        <button className="text-2xl absolute top-4 right-4 font-bold" onClick={closeModal}>&times;</button>

        {/* Render Google and LinkedIn buttons */}
        {!isSignedIn && (
  <div className="flex flex-col items-center justify-center mb-4">
    <h2 className="text-xl font-semibold mb-4">Sign in</h2>
    <div className="buttons-container"> {/* Use the container for buttons */}
      <GoogleLogin
        clientId="YOUR_GOOGLE_CLIENT_ID"
        buttonText="Sign in with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
        className="google-btn" /* Add class for styling */
      />
      <LinkedInAuthButton
        clientId={import.meta.env.VITE_LINKEDIN_CLIENT_ID}
        redirectUri={import.meta.env.VITE_LINKEDIN_REDIRECT_URI}
        state={import.meta.env.VITE_LINKEDIN_STATE}
        scope={import.meta.env.VITE_LINKEDIN_SCOPE}
       
      />
    </div>
    <hr className="my-4 w-full" />
  </div>
)}

        {/* Render form regardless of sign-in state */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Please enter your information</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input type="text" name="firstName" placeholder="First Name" required value={formData.firstName} onChange={handleInputChange} className="w-full border-b-2 border-gray-300 focus:border-black focus:outline-none py-2" />
            <input type="text" name="lastName" placeholder="Last Name" required value={formData.lastName} onChange={handleInputChange} className="w-full border-b-2 border-gray-300 focus:border-black focus:outline-none py-2" />
            <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleInputChange} className="w-full border-b-2 border-gray-300 focus:border-black focus:outline-none py-2" />
            <input type="text" name="company" placeholder="Company" required value={formData.company} onChange={handleInputChange} className="w-full border-b-2 border-gray-300 focus:border-black focus:outline-none py-2" />
            <button type="submit" disabled={serverState.submitting} className={`px-4 py-2 ${serverState.submitting ? 'bg-gray-600' : 'bg-gray-800'} text-white hover:bg-gray-700 focus:outline-none`}>
              {serverState.submitting ? 'Processing...' : "Submit"}
            </button>
          </form>
        </div>

        {serverState.downloadUrl && (
  <div className="text-center mt-6">
    <h2 className="text-2xl font-semibold mb-4">Your Wallet Pass</h2>
    {/* QR Code Display */}
    <div className="mb-4">
      <QRCode value={serverState.downloadUrl} size={256} level="H" includeMargin={true} />
      <p className="mt-2">Scan the QR code to download your wallet pass.</p>
    </div>

    {/* Conditional Download Button Display */}
    {isAppleMobileDevice() && (
      <a
        href={serverState.downloadUrl}
        className="inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors duration-200 ease-in-out"
        download="WalletPass.pkpass"
      >
        Download to Apple Wallet
      </a>
    )}
    {isAndroidMobileDevice() && (
      <a
        href={serverState.downloadUrl}
        className="inline-block px-6 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition-colors duration-200 ease-in-out"
        download="WalletPass.pkpass"
      >
        Download to Google Wallet
      </a>
    )}

    {/* Display QR Code Frontend URL if exists */}
    {serverState.qrCodeFrontendUrl && (
      <p className="mt-4">
        Alternatively, you can <a href={serverState.qrCodeFrontendUrl} className="text-blue-600 underline">click here</a> to view your pass.
      </p>
    )}
  </div>
)}


        {serverState.status && !serverState.status.ok && (
          <p className="text-center text-red-500">{serverState.status.msg}</p>
        )}
      </div>
    </div>
  );
};

export default Modal;
