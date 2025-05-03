interface Config {
  auth0: {
    domain: string;
    clientId: string;
    audience: string;
  };
  api: {
    url: string;
  };
}

if (!process.env.REACT_APP_AUTH0_DOMAIN) {
  throw new Error('REACT_APP_AUTH0_DOMAIN не определен');
}

if (!process.env.REACT_APP_AUTH0_CLIENT_ID) {
  throw new Error('REACT_APP_AUTH0_CLIENT_ID не определен');
}

if (!process.env.REACT_APP_AUTH0_AUDIENCE) {
  throw new Error('REACT_APP_AUTH0_AUDIENCE не определен');
}

if (!process.env.REACT_APP_API_URL) {
  throw new Error('REACT_APP_API_URL не определен');
}

export const config: Config = {
  auth0: {
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  },
  api: {
    url: process.env.REACT_APP_API_URL,
  },
};
