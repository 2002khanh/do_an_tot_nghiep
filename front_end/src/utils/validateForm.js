const requiredValidators = {
  email: { fieldName: "Email", error: "" },
  //   phone: { fieldName: "Phone", error: "" },
  name: { fieldName: "Tên người dùng", error: "" },
  password: { fieldName: "Mật khẩu", error: "" },
  rePassword: { fieldName: "Nhập lại mật khẩu", error: "" },
};

const regexValidators = {
  email: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  phone: /^\d+$/,
};

export const validateAllCaseFromField = (fieldName, value) => {
  if (!requiredValidators[fieldName]) {
    throw new Error(`Validator for field '${fieldName}' is not defined`);
  }

  if (!value) {
    return `Vui lòng nhập "${requiredValidators[fieldName].fieldName}"`;
  }

  if (regexValidators[fieldName] && !regexValidators[fieldName].test(value)) {
    return `${requiredValidators[fieldName].fieldName} không đúng định dạng`;
  }

  return "";
};
