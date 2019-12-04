export const notFoundError = (res, err, msg) => {
  return res.status(404).json({
    status: 'Not found',
    error: err,
    message: msg,
  });
};