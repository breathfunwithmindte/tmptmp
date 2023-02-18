const { EcommerceLib } = require("../../lib/Ecommerce.lib")
const mongoose = require("mongoose");

/** 
 * % @Model
 * % @CollectionName := users 
 * & @Fields := ModelFields
 * & @GenerateApis := ModelApis
 * % @GenerateDefaultAdminApisAll
 */
module.exports = class User extends EcommerceLib.Model
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
  { name: "avatar",           mongodb: { type: String,  required: true, minlength: 3, maxlength: 1400, default: "/avatar.jpg" } },
  { name: "email",            mongodb: { type: String,  required: true, minlength: 1, maxlength: 255 } },
  { name: "password",         mongodb: { type: String,  required: true, minlength: 1, maxlength: 255 } },
  { name: "address",          mongodb: { type: String,  required: true, minlength: 1, maxlength: 255 } },
  { name: "phonenumber",      mongodb: { type: String,  required: true, minlength: 1, maxlength: 255 } },
  { name: "admin",            mongodb: { type: Boolean, required: true, default: false } },
  { name: "description",      mongodb: { type: String,  required: true, minlength: 3, maxlength: 1400 } }
]