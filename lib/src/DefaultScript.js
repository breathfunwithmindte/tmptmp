const SysContext = require("./SysContext");

module.exports.RESTAPI__controller_method = async function (req, res)
{
  try {
    await this.controller_method(req.restapi_context, { req, res });
    req.restapi_context.response(res);
    return 0;
  } catch (error) {
    if(error instanceof SysContext) {
      req.restapi_context.response(res);
    } else {
      if(req.restapi_context.getContentType() === "application/json") return res.status(500).json({ message: "Something went wrong" })
      if(req.restapi_context.getContentType() === "text/html") return res.render("default/500", req.restapi_context);
      return res.send("Something went wrong");
    }
  }
}

module.exports.RESTAPI__middleware_method = async function (req, res, next)
{
  return await this.middleware_method(req.restapi_context, { req, res, next });
}

module.exports.RESTAPI__model_method = async function (req, res)
{
  try {
    await this.model[this.method](req.restapi_context, { req, res });
    req.restapi_context.response(res);
    return 0;
  } catch (error) {
    if(error instanceof SysContext) {
      req.restapi_context.response(res);
    } else {
      if(req.restapi_context.getContentType() === "application/json") return res.status(500).json({ message: "Something went wrong" })
      if(req.restapi_context.getContentType() === "text/html") return res.render("default/500", req.restapi_context);
      return res.send("Something went wrong");
    }
  }
}


module.exports.executeModelMethod = async function ()
{

}