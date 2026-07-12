import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api",

  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("token");

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }
    }

    /*
     * Pour un FormData, ne surtout pas imposer
     * application/json ou multipart/form-data.
     *
     * Le navigateur doit générer lui-même la
     * boundary multipart.
     */
    if (config.data instanceof FormData) {
      delete config.headers[
        "Content-Type"
      ];
    } else if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] =
        "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default api;