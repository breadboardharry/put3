const backendUrl = `http://${window.location.hostname}`;

export const environment = {
  production: true,
  serverUrl: backendUrl,
  apiPath: '/api',
  socketPath: '/socket',
  masterCode: [7, 5, 2, 1]
};
