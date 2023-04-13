const responseWithData = (res, statusCode, data) => res.status(statusCode).json(data)

// module scafolding
const responseHandler = {}

responseHandler.error = (res) => {
    responseWithData(res, 500, {
        status: 500,
        message: 'Oops! Something wrong!',
    })
}

responseHandler.badrequest = (res, message) => {
    responseWithData(res, 400, {
        status: 400,
        message,
    })
}

responseHandler.ok = (res, data) => responseWithData(res, 200, data)

responseHandler.created = (res, data) => responseWithData(res, 201, data)

responseHandler.unauthorize = (res) => {
    responseWithData(res, 401, {
        status: 401,
        message: 'Unauthorized',
    })
}

responseHandler.notfound = (res) => {
    responseWithData(res, 404, {
        status: 404,
        message: 'Resource not found',
    })
}

export default responseHandler
