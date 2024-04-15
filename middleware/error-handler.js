const { StatusCodes } = require('http-status-codes')



const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    //set default
  statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  msg: err.message || "Something went wrong try again later"
  }
  //send a readable error to user when the job id is incorrect 
  if(err.name === "CastError"){
    err.message = `No item found with id : ${err.value}`
    customError.msg = err.message
    customError.statusCode = 404
    console.log("hit")
  }
  if(err.name === "ValidationError"){
    customError.msg = Object.values(err.errors)
    .map((item) => item.message)
    .join(",")
    customError.statusCode= 400
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode = 400).json({ 
    msg: err.code && err.code ===11000 ? 
    `Duplicate value entered for ${Object.keys(err.keyValue)} fields, please choose another email address`
    : err.message, 

  })

}

module.exports = errorHandlerMiddleware
