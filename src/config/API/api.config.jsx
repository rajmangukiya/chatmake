import API_LOCAL from './api-local.jsx';
import API_PROD from './api-prod.jsx';
const hostname = window.location.hostname;
const port = window.location.port;
let isLocalApi =  +port >= 3000;

// export const API = (hostname === 'localhost' && isLocalApi) ? API_LOCAL : API_PROD
// export const API = API_PROD;
export const API = API_LOCAL;