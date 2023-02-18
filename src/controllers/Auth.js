const { EcommerceLib } = require("../../lib/Ecommerce.lib")
const ApplicationContext = require("../Context")

/**
 * % @RestController
 */
module.exports = class AuthController extends EcommerceLib.RestController
{
  /**
   * % @GetMapping := /api/v1/login
   * % @Middlewares := admin
   * 
   * @param {ApplicationContext} context;
   * @param {import("../EcommerceApplication").ExpressType} exp 
   */
  async login (context, exp) {
    context.data.set("something", 123123123)
    context.data.set("users", await context.models.get("User").find());
    console.log(context);
    context.throw403();
  }

  /**
   * % @GetMapping := /api/v1/register
   * % @Middlewares := 
   */
  async register (context, exp) {}

}

