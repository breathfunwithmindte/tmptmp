const ApplicationContext = require("../Context");

/**
 * % @Middleware
 * @param {ApplicationContext} context
 * @param {import("../EcommerceApplication").ExpressType} exp
 */
module.exports = async function admin (context, exp)
{
  if(context.isAdminSession()) return exp.next();
  return exp.res.status(403).json({ message: "Not Allowed", status: 403 });
}