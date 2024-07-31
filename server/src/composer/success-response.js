const HttpCodes = require("../constants/httpCodes");

let SuccessResponse = class SuccessResponse{

    constructor(message,result) {
      this.status= "1"
      this.message = message;
      this.result =result; 
    }
  
    getSuccess() {
      return {
         status:this.status,
         message: this.message,
         result: this.result,
      };
    }
  };



exports.SuccessfullResponse = ( res, message, payload) =>  {
  return res.status(HttpCodes.OK).send(new SuccessResponse(message,payload))
}
  