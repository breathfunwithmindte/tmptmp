/**
 * @name EcommerceTemplate
 * @namespace Lib::SysContext
 * @author Mike Karypidis
 * @license All-Rights-Reserved
 * @link http://github.com/
 * 
 * ==================================================
 * 
 * * description
 * 
 */

const mongoose = require("mongoose");

module.exports = class SysContext
{

  /** @References fields */

  /** @type {Map<String, mongoose.Model} */
  models = new Map();

  /** @Session fields */
  data = new Map();
  #user = null;
  #view = "index"
  #layout = "main.layout";
  #status = 200;
  #contentType = "application/json";


  /**
   * Set default data from global ecommerceLib to current session.
   * 
   * @param {import("../Ecommerce.lib").EcommerceLib} ecommerceLib;
   */
  constructor (ecommerceLib)
  {
    this.models = ecommerceLib.models;
  }

  setUser(user) { this.#user = user;  }
  getUser() { return this.#user; }
  isAdminSession () 
  {
    return true;
    if(!this.#user) return false;
    if(!this.#user.admin) return false;
    return true;
  }


  response (expressResponseInstance)
  {
    if(this.#contentType === "application/json") {
      let obj = new Object();
      this.data.forEach((value, key) => obj[key] = value);
      return expressResponseInstance.status(this.#status).json(obj);
    } else if(this.#contentType === "text/html") {
      return expressResponseInstance.render(this.#layout, this);
    } else {
      return expressResponseInstance.send("not implemented any method for this content type")
    }
  }

  getContentType () { return this.#contentType; }

  throw401 ()
  {
    this.#status = 401;
    this.data = new Map();
    this.data.set("message", "Not Authenticated || 401");
    throw this;
  }
  throw403 ()
  {
    this.#status = 403;
    this.data = new Map();
    this.data.set("message", "Not Allowed || 403");
    throw this;
  }

  /**
   * @param {String[]} errors
   */
  throw400 (errors)
  {
    this.#status = 400;
    this.data = new Map();
    this.data.set("message", "Bad Request.");
    if(errors) this.data.set("errors", errors);
    throw this;
  }

}