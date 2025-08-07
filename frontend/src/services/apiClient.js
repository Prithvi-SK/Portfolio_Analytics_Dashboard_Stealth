import axios from "axios";


// standard api client to handle getand post request
// Base url handled by vite proxy and docker
const apiClient = axios.create({
  baseURL: "/",
});


// Request interceptor
apiClient.interceptors.request.use(
  (config)=>{
    const token=localStorage.getItem("token");
    if (token){
      config.headers["Authorization"]=`Bearer ${token}`;
    }
    return config;
  }, 
  (error)=>Promise.reject(error)
);


// Response intercetptor
apiClient.interceptors.response.use(
  (response)=>response,
  (error)=>{
    if (error.response && error.response.status==401){
      localStorage.removeItem("token");
      window.location.href="/";
    }
    return Promise.reject(error);
  }
);


export default apiClient;


// GET request wrapper
export const get = async (url, config = {}) => {
  try {
    const response = await apiClient.get(url, config);
    console.log(response)
    return { 
      data: response.data, 
      error: null 
    };
  } 
  catch (error) {
    console.log("Error fetching data from",url)
    console.error(`Error fetching data from ${url}:`, error);
    return {
      data: null,
      error: error.response
        ? {
          status: error.response.status,
          statusText: error.response.statusText,
          message: error.response.data || error.message,
        }
        : error,
    };
  }
};

// POST request wrapper
export const post = async (url, data, config = {}) => {
  try {
    const response = await apiClient.post(url, data, config);
    console.log(response)
    return { 
      data: response.data, 
      error: null 
    };
  } 
  catch (error) {
    console.log("Error posting data to",url)
    console.error(`Error posting data to ${url}:`, error);
    return {
      data: null,
      error: error.response
        ? {
          status: error.response.status,
          statusText: error.response.statusText,
          message: error.response.data || error.message,
        }
        : error,
    };
  }
};
