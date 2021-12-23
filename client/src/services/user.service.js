import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://prueba-tecnica-llloyola.herokuapp.com/api/test/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const object = {
    getPublicContent,
    getUserBoard,
};

export default object;