const ApplicationContext = require("../Context");

/**
 * % @Middleware
 * @param {ApplicationContext} context
 * @param {import("../EcommerceApplication").ExpressType} exp
 */
module.exports = async function analytics (context, exp)
{
  console.log("middleware analytics is working but doing nothing\t", exp.req.url);
  exp.next();
}