const backendUrl = `http://${window.location.hostname}`;

export const environment = {
  production: true,
  serverUrl: backendUrl,
  apiPath: '/api',
  socketPath: '/socket',
  defaultWallpaper: 'assets/images/default-desktop-background.jpg'
};
