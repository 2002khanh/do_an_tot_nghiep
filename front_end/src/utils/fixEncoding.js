export const fixEncoding = (str) => {
  try {
    return decodeURIComponent(escape(str));
  } catch (e) {
    console.error("Error fixing encoding: ", e);9999
    return str;
  }
};
