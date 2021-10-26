import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/";

const getEntries = () => {
  return axios.get(API_URL + "entries", { headers: authHeader() });
};

const updateEntry = (data) => {
  return axios.post(API_URL + "update-entry", {
    _id: data._id,
    name: data.name,
    about_brand: data.about_brand,
    about_product: data.about_product,
    brand_image: data.brand_image ?? "",
    product_image: data.product_image ?? ""
  }, { headers: authHeader() });
};

const createEntry = (data) => {
  return axios.post(API_URL + "create-entry", {
    name: data.name,
    about_brand: data.about_brand,
    about_product: data.about_product,
    brand_image: data.brand_image ?? "",
    product_image: data.product_image ?? ""
  }, { headers: authHeader() });
};

const deleteEntry = (data) => {
  return axios.post(API_URL + "delete-entry", {
    _id: data
  }, { headers: authHeader() });
};

const uploadImage = (data) => {
  
  return axios.post(API_URL + "image", data, {headers: { 'content-type': 'multipart/form-data;' }});
};


export default {
  getEntries,
  updateEntry,
  createEntry,
  deleteEntry,
  uploadImage
};