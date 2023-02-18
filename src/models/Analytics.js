const { EcommerceLib } = require("../../lib/Ecommerce.lib")
const mongoose = require("mongoose");

/** 
 * % @Model
 * % @CollectionName := users 
 * & @Fields := ModelFields
 * & @GenerateApis := ModelApis
 * % @GenerateDefaultAdminApisAll
 */
module.exports = class Analytic extends EcommerceLib.Model
{
  /** 
   * @override default behaviour of EcommerceLib.Model 
   * @example you can override default read_many method
   */
}

module.exports.ModelApis = [
  { method: "GET", middlewares: ["admin"], method: "test" }, // test method doing nothing, return empty response.
]
module.exports.ModelFields = [
  { name: "email", mongodb: { type: String, required: true, minlength: 3, maxlength: 15 }, populate: true }
]