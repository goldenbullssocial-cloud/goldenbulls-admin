import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};



export const uploadAlgoBotImage = async (image) => {
  const token = getAuthToken();

  try {
    const response = await axios.post(`${API_BASE_URL}/strategies/upload`, image, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating algo bot:', error);
    throw error;
  }
};

export const createAlgoBot = async (botData) => {
  const token = getAuthToken();
  try {
    const response = await axios.post(`${API_BASE_URL}/strategies/add`, botData, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating algo bot:', error);
    throw error;
  }
};

export const createAlgoBotPlan = async (id, botData) => {
  const token = getAuthToken();
  try {
    const response = await axios.post(`${API_BASE_URL}/strategyPlan/add/${id}`, botData, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating algo bot:', error);
    throw error;
  }
};

export const updateAlgoBotPlan = async (id, botData) => {
  const token = getAuthToken();

  try {
    const response = await axios.put(`${API_BASE_URL}/strategyPlan/edit/${id}`, botData, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating algo bot:', error);
    throw error;
  }
};

export const deleteAlgoBotPlan = async (id) => {
  const token = getAuthToken();
  try {
    const response = await axios.delete(`${API_BASE_URL}/strategyPlan/delete/${id}`, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting algo bot:', error);
    throw error;
  }
};


export const updateAlgoBot = async (id, botData) => {
  const token = getAuthToken();

  try {
    const response = await axios.put(`${API_BASE_URL}/strategies/edit/${id}`, botData, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating algo bot:', error);
    throw error;
  }
};

export const getAllAlgoBots = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/strategies?${params?.page ? `page=${params.page}` : ''}&${params?.limit ? `limit=${params.limit}` : ''}&${params?.search ? `search=${params.search}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching algo bots:', error);
    throw error;
  }
};


export const deleteAlgoBot = async (id) => {
  const token = getAuthToken();
  try {
    const response = await axios.delete(`${API_BASE_URL}/strategies/delete/${id}`, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting algo bot:', error);
    throw error;
  }
};


//algobots-category api
export const getAllCategory = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching algo bots:', error);
    throw error;
  }
};

export const getCategoryDropdown = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/dropdown`);
    return response.data;
  } catch (error) {
    console.error('Error fetching algo bots:', error);
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  const token = getAuthToken();

  try {
    const response = await axios.post(`${API_BASE_URL}/categories/add`, categoryData, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id, categoryData) => {
  const token = getAuthToken();

  try {
    const response = await axios.put(`${API_BASE_URL}/categories/edit/${id}`, categoryData, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  const token = getAuthToken();

  try {
    const response = await axios.delete(`${API_BASE_URL}/categories/delete/${id}`, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

//get all company
export const getAllCompany = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/botProvider/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching algo bots:', error);
    throw error;
  }
};

export const createCompany = async (companyData) => {
  const token = getAuthToken();

  try {
    const response = await axios.post(`${API_BASE_URL}/botProvider/add`, companyData, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCompany = async (id, companyData) => {
  const token = getAuthToken();

  try {
    const response = await axios.put(`${API_BASE_URL}/botProvider/edit/${id}`, companyData, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCompany = async (id) => {
  const token = getAuthToken();

  try {
    const response = await axios.delete(`${API_BASE_URL}/botProvider/delete/${id}`, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

//Bot Provider API
export const getBotProviderDropDown = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/botProvider/dropdown`);
    return response.data;
  } catch (error) {
    console.error('Error fetching algo bots:', error);
    throw error;
  }
};

//Langugage dropdown api
export const getLanguageDropDown = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/languages-dropdown`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bots:', error);
    throw error;
  }
};

//Bot API
export const getAllBots = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bot/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bots:', error);
    throw error;
  }
};

export const getBotDropDown = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bot/dropdown`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bots:', error);
    throw error;
  }
};

export const createBot = async (botData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/bot/add`, botData, {
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating bot:', error);
    throw error;
  }
};

export const updateBot = async (id, botData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/bot/edit/${id}`, botData, {
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating bot:', error);
    throw error;
  }
};

export const deleteBot = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/bot/delete/${id}`, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting bot:', error);
    throw error;
  }
};

//coupon api
