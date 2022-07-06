const ERROR_HANDLERS = {
  CastError: res =>
    res.status(400).send({ error: 'id used is malformed' }),

  JsonWebTokenError: res =>
    res.status(401).send({ error: 'token is invalid' }),

  JsonWebTokenExpired: res =>
    res.status(401).json({ error: 'token expired' }),

  defaultError: res => res.status(500).end()
}

module.exports = (error, request, response, next) => {
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
  handler(response, error)
}
