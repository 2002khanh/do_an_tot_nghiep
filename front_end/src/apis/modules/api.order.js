import axiosAPI from "../api.main";

export const getOrderByUser = async () => {
  return await axiosAPI.get("/order/user");
};

export const getAllOrder = async (params) => {
  return await axiosAPI.get("/order", {
    params: params,
  });
};

export const getOrderByOrderId = async (orderId) => {
  return await axiosAPI.get(`/order/${orderId}`);
};

export const getOrderByOrderIdOfAdmin = async (orderId) => {
  return await axiosAPI.get(`/order/admin/${orderId}`);
};

export const createOrder = async (data) => {
  return await axiosAPI.post(`/order`, data);
};

export const updateStatusOrder = async (data) => {
  const { orderId, status } = data;
  return await axiosAPI.patch(`/order/admin/${orderId}`, { status });
};

export const getTotalOrder = async () => {
  return await axiosAPI.get("/order/totalOrder");
};

export const getTotalSale = async () => {
  return await axiosAPI.get("/order/totalSale");
};

export const handleCancelOrder = async (orderId) => {
  return await axiosAPI.patch(`order/cancelOrder/${orderId}`);
};


   :rules="passwordRules"
   
   const validatePassword = (rule, value) => {
    if (!value) {
      return Promise.reject('Mật khẩu là bắt buộc!');
    }
    if (value.length < 8) {
      return Promise.reject('Mật khẩu phải chứa ít nhất 8 ký tự.');
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject('Mật khẩu phải chứa ít nhất một chữ cái viết hoa.');
    }
    if (!/[a-z]/.test(value)) {
      return Promise.reject('Mật khẩu phải chứa ít nhất một chữ cái viết thường.');
    }
    if (!/[0-9]/.test(value)) {
      return Promise.reject('Mật khẩu phải chứa ít nhất một chữ số.');
    }
    return Promise.resolve();
  };

  const passwordRules = [
    {
      required: true,
      validator: validatePassword,
    },
  ];