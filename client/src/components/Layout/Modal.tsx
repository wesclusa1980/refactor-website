import React, { useEffect, useState, FC } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from '@leecheuk/react-google-login';
import LinkedInAuthButton from '../../utils/LinkedInAuthButton';
import servicesData from '../../data/demo.json'; 
import './modal.css';
import googleIcon from '../../assets/images/google.png';
import linkedinIcon from '../../assets/images/linkedin.png';

const isAppleMobileDevice = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);
const isAndroidMobileDevice = () => /Android/i.test(navigator.userAgent);
type SimulationData = {
  id: number | string;
  name: string;
  image: string;
  description: string;
  simulationApiEndpoint: string;
  explanation: string; // Add this line to include the explanation property
};


type IndustryDataExtended = IndustryData & {
  useCases: (UseCase & SimulationData)[]; // Extend useCases with SimulationData
};
type ModalPropsExtended = Omit<ModalProps, 'industryData'> & {
  industryData: IndustryDataExtended;
};

type UseCase = {
  id: string;
  name: string;
  explanation: string;
  simulationApiEndpoint: string;
  points?: number; // Optionally include points
};

type IndustryData = {
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

type ModalProps = {
  showModal: boolean;
  closeModal: () => void;
  industryData: IndustryData; // Ensure this matches the type you intend to pass
};

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  selectedIndustry?: IndustryData;
  selectedUseCase?: string;
};

type ServerState = {
  submitting: boolean;
  status: { ok: boolean; msg: string } | null;
  downloadUrl?: string;
  qrCodeFrontendUrl?: string; 
};

const Modal: FC<ModalProps> = ({ showModal, closeModal, industryData }) => {
  console.log(industryData);
  const [tempSelectedUseCase, setTempSelectedUseCase] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    selectedIndustry: undefined, // Initialize without a selected industry
    selectedUseCase: '',
  });
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const selectedUseCaseObj = industryData.useCases.find(uc => uc.id === formData.selectedUseCase);
  const [serverState, setServerState] = useState<ServerState>({
    submitting: false,
    status: null,
  });
  useEffect(() => {
    if (industryData) {
      setFormData({ ...formData, selectedIndustry: industryData });
      // Ensure we reset to step 1 whenever the modal is opened
      setCurrentStep(1);
      // Also reset the temporary selected use case
      setTempSelectedUseCase(null);
    }
  }, [industryData]);
  const handleUseCaseChange = (useCaseId: string) => {
    // Just store the selected use case id temporarily
    setTempSelectedUseCase(useCaseId);
  };

  const goToNextStep = () => {
    // When "Next" is clicked, set the selected use case and move to step 2
    if (tempSelectedUseCase) {
      setFormData({ ...formData, selectedUseCase: tempSelectedUseCase });
      setCurrentStep(2);
    } else {
      // Optionally handle the case where no use case has been selected
      alert('Please select a use case before proceeding.');
    }
  };
  const handleIndustrySelection = (industry: IndustryData) => {
    setFormData({ ...formData, selectedIndustry: industry });
    setCurrentStep(industry.useCases && industry.useCases.length > 0 ? 2 : 3);
  };

  const handleUseCaseSelection = (useCaseId: string) => {
    setFormData({ ...formData, selectedUseCase: useCaseId });
    setCurrentStep(3);
  };
  const handleLinkedInLogin = () => {
    // Assuming you're using OAuth 2.0 Implicit Grant Flow
    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${import.meta.env.VITE_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_LINKEDIN_REDIRECT_URI)}&state=${import.meta.env.VITE_LINKEDIN_STATE}&scope=${encodeURIComponent(import.meta.env.VITE_LINKEDIN_SCOPE)}`;
  
    // Redirect to LinkedIn Authorization URL
    window.location.href = linkedInAuthUrl;
  };
  // Handle Simulation Step
  const handleSimulation = async () => {
    if (!simulationData) return; // Check if simulationData is available

    setIsLoading(true); // Show loading indicator
    try {
      // Call the simulation API endpoint
      const response = await axios.post(simulationData.simulationApiEndpoint, {
        // Your request payload here, adjust as needed
      });

      setIsLoading(false); // Hide loading indicator

      // Process response as needed
      console.log("Simulation response:", response.data);
      
      // Optionally, move to a next step or show a message based on the simulation response
    } catch (error) {
      setIsLoading(false); // Hide loading indicator on error
      console.error("Simulation error:", error);
      // Handle error case, e.g., show an error message
    }
  };

  // Handle selecting a use case to include setting simulation data
  const handleUseCaseSelectionExtended = (useCaseId: string) => {
    const selectedUseCase = industryData.useCases.find(uc => uc.id === useCaseId);
    if (selectedUseCase) {
      setFormData({ ...formData, selectedUseCase: useCaseId });
      setSimulationData({
        id: selectedUseCase.id, // Assuming `id` is a number, adjust as necessary
        name: selectedUseCase.name,
        image: "", // Provide actual image URL or path
        description: selectedUseCase.explanation,
        simulationApiEndpoint: selectedUseCase.simulationApiEndpoint,
        explanation: selectedUseCase.explanation // Ensure `explanation` is defined in your use case objects
      });
      setCurrentStep(4); // Move to the simulation step
    }
  };
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
  const { firstName, lastName, email, company, selectedIndustry, selectedUseCase } = formData;
  
  const simulateUseCase = async () => {
    if (!formData.selectedIndustry || !formData.selectedUseCase) {
        console.error('Missing data for simulation');
        return;
    }
    
    const selectedUseCaseData = formData.selectedIndustry.useCases.find(useCase => useCase.id === formData.selectedUseCase);
    if (!selectedUseCaseData) {
        console.error('Selected use case data not found');
        return;
    }

    const payload = {
        brand: formData.selectedIndustry.brand,
        programid: formData.selectedIndustry.programid,
        templateId: formData.selectedIndustry.templateId,
        templateTierId: formData.selectedIndustry.templateTierId,
        email: formData.email,
        person: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
        },
        passdata: {
            metaData: {
                useCaseId: formData.selectedUseCase,
            },
            points: selectedUseCaseData.points ? selectedUseCaseData.points : undefined,
        },
    };

    try {
        setIsLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/update-wallet`, payload);
        setIsLoading(false);
        console.log('Simulation successful:', response.data);

        // If the API call is successful, move to step 4
        setCurrentStep(4);

        // Optionally, update any state or show a message based on response.data if needed
    } catch (error) {
        setIsLoading(false);
        console.error('Error during simulation:', error);
        // Optionally, handle the error, e.g., show an error message
    }
};


  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Start loading
    setServerState({ submitting: true, status: null });
  
    const { firstName, lastName, email, company, selectedIndustry, selectedUseCase } = formData;
  
    if (!selectedIndustry || !selectedUseCase) {
      console.error('Submission error: No industry or use case selected');
      setServerState({ submitting: false, status: { ok: false, msg: 'No industry or use case selected' } });
      setIsLoading(false);
      return;
    }
  
    const issueWalletData = {
      brand: selectedIndustry.brand,
      programId: selectedIndustry.programid,
      templateId: selectedIndustry.templateId,
      person: {
        firstName,
        lastName,
        email,
      },
      passdata: {
        metaData: {
          useCaseId: selectedUseCase,
        },
        profileImage: ""
      },
    };
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/issue-wallet`, issueWalletData);
      setIsLoading(false); // Stop loading
      if (response.data && response.data.downloadUrl && response.data.passId) {
        const { downloadUrl, qrCodeFrontendUrl, passId } = response.data;
  
        // Create a JSON object
        const cookieValue = JSON.stringify({
          passId,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
  
        // Store JSON string in cookie, ensure it's encoded
        document.cookie = `pandaCookie=${encodeURIComponent(cookieValue)};path=/;max-age=3600`;
  
        setCurrentStep(3);
        setServerState({
          submitting: false,
          status: { ok: true, msg: 'Wallet issued successfully.' },
          downloadUrl,
          qrCodeFrontendUrl,
        });
      } else {
        setServerState({
          submitting: false,
          status: { ok: false, msg: 'The response is missing the download URL or passId.' },
        });
      }
    } catch (error) {
      setIsLoading(false);
      setServerState({
        submitting: false,
        status: { ok: false, msg: error.response ? error.response.data.message : 'An error occurred while issuing the wallet.' },
      });
    }
  };
  
  
  return (
    <div className={`fixed inset-0 z-50 ${showModal ? 'flex overflow-auto' : 'hidden'} items-start pt-20 justify-center bg-black bg-opacity-50`}>
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-lg w-full m-4 relative overflow-auto max-h-screen">
        <button className="text-2xl absolute top-4 right-4 font-bold" onClick={closeModal}>&times;</button>
  
        {currentStep === 1 && formData.selectedIndustry && (
          <div>
            <h2 className="text-xl font-semibold mb-4">You chose {formData.selectedIndustry.IndustryTitle}</h2>
            <h2 className="text-xl font-semibold mb-4">Please select a use case:</h2>
            {industryData.useCases.map((useCase, index) => (
              <div key={index} className="flex items-center mb-4">
                <input
                  id={`useCase-${useCase.id}`}
                  type="radio"
                  name="useCase"
                  value={useCase.id}
                  onChange={() => handleUseCaseChange(useCase.id)}
                  checked={tempSelectedUseCase === useCase.id}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600"
                />
                <label htmlFor={`useCase-${useCase.id}`} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {useCase.name}
                </label>
              </div>
            ))}
            <button
              onClick={goToNextStep}
              className="mt-4 px-10 py-2 w-full mx-auto bg-black text-white rounded"
            >
              Next
            </button>
          </div>
        )}
  
        {currentStep === 2 && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6">Sign in</h2>
            <div className="flex justify-center gap-4 mb-4">
              {/* Google Sign in */}
              <div className="rounded-full shadow-lg p-2 bg-white border border-gray-300 cursor-pointer">
                <GoogleLogin
                  clientId="886122045832-2j1aes3naf824rs6a4o2gg78r5hne2r8.apps.googleusercontent.com"
                  render={renderProps => (
                    <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="focus:outline-none">
                      <img src={googleIcon} alt="Google sign-in" className="w-8 h-8"/>
                    </button>
                  )}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={'single_host_origin'}
                />
              </div>
  
              {/* LinkedIn Sign in */}
              <div className="flex justify-center items-center">
                <button
                  onClick={handleLinkedInLogin}
                  className="rounded-full shadow-lg p-2 bg-white border border-gray-300 cursor-pointer focus:outline-none"
                  aria-label="Sign in with LinkedIn"
                >
                  <img src={linkedinIcon} alt="LinkedIn sign-in" className="w-8 h-8"/>
                </button>
              </div>
            </div>
            <hr className="my-4" />
            <p>or</p>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="border border-gray-300 p-2 rounded"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="border border-gray-300 p-2 rounded"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="border border-gray-300 p-2 rounded"
                />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company"
                  className="border border-gray-300 p-2 rounded"
                />
                <button
                  type="submit"
                  className="bg-black text-white font-semibold rounded py-2 hover:bg-blue-600 transition-colors duration-200 ease-in-out"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
  
        {currentStep === 3 && (
          <div className="text-center mt-6">
            <h2 className="text-2xl font-semibold mb-4">Your Wallet Pass</h2>
            <div className="flex justify-center mb-4">
              <QRCode value={`https://wallet-pass-sandbox.bambumeta.software${serverState.downloadUrl}`} size={256} level="H" includeMargin={true} />
            </div>
            <p className="mt-2 mb-4">Scan the QR code to download your wallet pass.</p>
            <button
              onClick={simulateUseCase}
              className="mt-4 w-full px-4 py-2 bg-black text-white rounded hover:bg-black transition-colors duration-200 ease-in-out"
            >
              Simulate {industryData.useCases.find(uc => uc.id === formData.selectedUseCase)?.name} Use Case
            </button>

          </div>
        )}
  
        {serverState.downloadUrl && (
          <div className="text-center mt-6">
            {isAppleMobileDevice() && (
              <a
                href={`https://wallet-pass-sandbox.bambumeta.software${serverState.downloadUrl}`}
                className="inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors duration-200 ease-in-out"
                download="WalletPass.pkpass"
              >
                Download to Apple Wallet
              </a>
            )}
            {isAndroidMobileDevice() && (
              <a
                href={`https://wallet-pass-sandbox.bambumeta.software${serverState.downloadUrl}`}
                className="inline-block px-6 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition-colors duration-200 ease-in-out"
                download="WalletPass.pkpass"
              >
                Download to Google Wallet
              </a>
            )}
          </div>
        )}
  
        {currentStep === 4 && (
          <div className="text-center mt-6">
          <h2 className="text-2xl font-semibold mb-4">{selectedUseCaseObj?.name}</h2>
          <p>{selectedUseCaseObj?.explanation || "Select a use case to see its explanation."}</p>
          <button
            onClick={handleSimulation}
            className="mt-4 w-full px-4 py-2 bg-black text-white rounded hover:bg-black transition-colors duration-200 ease-in-out"
          >
            View Other Use Cases
          </button>
        </div>
        )}
      </div>
    </div>
  );  
};

export default Modal;
