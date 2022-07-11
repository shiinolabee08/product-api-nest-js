import * as os from 'os';

export function createCognitoContextData(request) {
  const HttpHeaders = [];

  // loop through the header values and assign then to HttpHeaders
  for (const [key, value] of Object.entries(request.headers)) {
    HttpHeaders.push({
      headerName: key,
      headerValue: value,
    });
  }

  // this data is being required by cognito.
  return {
    HttpHeaders,
    IpAddress: request.connection.remoteAddress,
    ServerName: os.hostname(),
    ServerPath: '/auth/login',
  };
}
