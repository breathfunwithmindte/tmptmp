const ApplicationContext = require("../Context");

/**
 * % @Middleware
 * @param {ApplicationContext} context
 * @param {import("../EcommerceApplication").ExpressType} exp
 */
module.exports = async function passport (context, exp)
{
  console.log("passport");
  exp.next();
}