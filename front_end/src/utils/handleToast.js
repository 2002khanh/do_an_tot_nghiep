export default function displayToast(dispatch, type, message) {
  dispatch(
    "addToast",
    {
      id: Date.now(),
      type,
      message,
    },
    { root: true }
  );
}
