import React from 'react';
import { Auth0Provider, AppState } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

interface Auth0ProviderWithConfigProps {
  children: React.ReactNode;
}

export const isAuth0Configured = (): boolean => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  return Boolean(domain && clientId && !domain.startsWith('your-') && !domain.includes('example'));
};

export const Auth0ProviderWithConfig: React.FC<Auth0ProviderWithConfigProps> = ({ children }) => {
  const rawDomain = (import.meta.env.VITE_AUTH0_DOMAIN || '').trim();
  const domain = rawDomain.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'example.us.auth0.com';
  const clientId = (import.meta.env.VITE_AUTH0_CLIENT_ID || '').trim() || 'placeholder-client-id';
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE?.trim();
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: AppState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
        scope: 'openid profile email',
        ...(audience ? { audience } : {})
      }}
      cacheLocation="localstorage"
      onRedirectCallback={onRedirectCallback}
      skipRedirectCallback={!isAuth0Configured()}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithConfig;
