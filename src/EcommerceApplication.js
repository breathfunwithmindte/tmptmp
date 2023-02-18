const { EcommerceLib } = require("../lib/Ecommerce.lib");

const express = require("express");

/**
 * @typedef {Object} ExpressType
 * @property {express.request} req
 * @property {express.response} res
 * @property {Function} next
 */


/**
 * % @Port := 5000
 * % @Views := /views
 */
module.exports = class EcommerceApplication extends EcommerceLib.Application
{

  async change (app) 
  {
    app.use(require("cors")());
  }

}

/**
 * % @EcommerceApplication
 * % @Port := 5000
 * % @Message := Ecommerce is running
 * & @Views := /views
 */
module.exports.asdasd = class ASdasd {

}