exports.invalidEndpoint = (req, res, next) => {
  res.status(404).send({ msg: 'Not found' });
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === '22P02' || err.code === '23502' || err.code === '23503' || err.code === '08P01') {
    res.status(400).send({ msg: 'Bad request' });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send({ msg: 'Internal Server Error' });
};
