/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Declare each of your environment variables as a string.
    readonly VITE_REACT_APP_API_URL: string;
    readonly VITE_REACT_APP_LINKEDIN_CLIENT_ID: string;
    readonly VITE_REACT_APP_LINKEDIN_REDIRECT_URI: string;
    readonly VITE_REACT_APP_LINKEDIN_STATE: string;
    readonly VITE_REACT_APP_LINKEDIN_SCOPE: string;
    // ... add other environment variables as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  