const backendUrl = `https://${window.location.hostname}`;

export const environment = {
  production: true,
  serverUrl: backendUrl,
  apiPath: '/api',
  socketPath: '/socket',
  defaultDesktopImage: 'resources/images/.desktop/default-desktop.jpg'
};
