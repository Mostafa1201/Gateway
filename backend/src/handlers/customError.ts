//@ts-ignore
class CustomError extends Error {  
    constructor (message,status,error) {
      super(message)
      Error.captureStackTrace(this, this.constructor);
  
      this.name = this.constructor.name
      //@ts-ignore
      this.status = status
      //@ts-ignore
      this.response = {
        statusCode: status,
        message,
        error
      }
    }
  
    statusCode() {
    //@ts-ignore
      return this.status
    }
  }
  
  module.exports = CustomError  