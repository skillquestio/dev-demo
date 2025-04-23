const dataUrl = process.env.BUBBLE_API_URL;
const axios = require("axios");

const wfUrl = dataUrl.replace("/obj", "/wf");

const login = async (email, password) => {
  const { data } = await axios.post(`${wfUrl}/login`, {
    email,
    password,
  });

  return data;
};

const handleAxiosError = (error) => {
  if (error.response) {
    // Server responded with a status code outside the 2xx range
    console.error("Response error:", error.response.data);
    throw new Error(`Request failed with status code ${error.response.status}`);
  } else if (error.request) {
    // Request was made but no response received
    console.error("No response received:", error.request);
    throw new Error("No response received from the server");
  } else {
    // Something else happened while setting up the request
    console.error("Error setting up request:", error.message);
    throw new Error(`Error in request setup: ${error.message}`);
  }
};

const post = async (name, postData, token) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      throw new Error("API or user token is required for posting data");
    }
    const { data } = await axios.post(`${dataUrl}/${name}`, postData, {
      headers,
    });
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
};

const get = async (name, token, queryParams = {}) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const { data } = await axios.get(`${dataUrl}/${name}`, {
      headers,
      params: queryParams,
    });
    return data.response;
  } catch (error) {
    handleAxiosError(error);
  }
};

module.exports = {
  login,
  get,
  post,
};
