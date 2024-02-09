import React from 'react';
import linkedInLogo from '../assets/images/linkedin_button.png';
type LinkedInAuthButtonProps = {
  clientId: string;
  redirectUri: string;
  state: string;
  scope: string;
};

const LinkedInAuthButton: React.FC<LinkedInAuthButtonProps> = ({ clientId, redirectUri, state, scope }) => {
  const handleLinkedInAuth = () => {
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${scope}`;
  };

  return (
    <button onClick={handleLinkedInAuth} className="linkedin-login-btn">
        <img src={linkedInLogo} alt="LinkedIn Logo" />
    </button>
  );
};

export default LinkedInAuthButton;
