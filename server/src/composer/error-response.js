let BadRequest = class BadRequest{
    constructor(errorMessage) {
      this.status = "0";
      this.errMsg = errorMessage;
      this.result = null;
    }
  
    getError() {
      return {
        status:this.status,
        message: this.message,
        result: this.result,
      };
    }
  };
  

exports.ErrorResponse = (res, httpCode, message, payload = '') => {
  return res.status(httpCode).send(new BadRequest(message))
}
  
