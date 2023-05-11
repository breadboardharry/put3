const backendUrl = `http://${window.location.hostname}`;

export const environment = {
  production: true,
  serverUrl: backendUrl,
  apiPath: '/api',
  socketPath: '/socket',
  defaultDesktopImage: 'assets/images/default-desktop-background.jpg'
};
