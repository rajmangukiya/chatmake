import axios from "axios";
import { API } from "../config/API/api.config";
import { getCookie } from "./Cookie";

const defaultHeaders = {
  isAuth: true,
  AdditionalParams: {},
  isJsonRequest: true
};

export const getHttpOptions = (options = defaultHeaders) => {

  let token = localStorage.getItem('token');
  // token = token?.replace('%20', ' ');

  let headers = {
      Authorization: "",
      'Content-Type': "application/json",

  };

  if (options.hasOwnProperty('isAuth') && options.isAuth) {
      headers['Authorization'] = token;
  }

  if (options.hasOwnProperty('isJsonRequest') && options.isJsonRequest) {
      headers['Content-Type'] = 'application/json';
  }

  if (options.hasOwnProperty('AdditionalParams') && options.AdditionalParams) {
      headers = { ...headers, ...options.AdditionalParams };
  }

  return { headers }
}

export const authenticated = async () => {
  try {
    const token = localStorage.getItem('token');
    if(token) {
      const { data: { data } } = await axios.get(`${API.endpoint}/user/get-user`, getHttpOptions())
      return data;
    }
    return 0;
  } catch (error) {
    console.log(error);
    return 0;
  }
}