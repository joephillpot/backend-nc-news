exports.invalidEndpoint = (req, res, next) => {
  return res.status(404).send({ msg: 'Not found' });
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === '22P02') {
    return res.status(400).send({ status: 400, msg: 'Bad request' });
  }
  if (err.code === '23503') {
    return res.status(404).send({ status: 404, msg: 'Not found' });
  }
  if (err.code === '23502' || err.code === '23505') {
    return res.status(400).send({ status: 400, msg: 'Bad request' });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  return res.status(500).send({ msg: 'Internal Server Error' });
};
