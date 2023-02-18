/**
 * @name EcommerceTemplate
 * @namespace Lib::SysApplication
 * @author Mike Karypidis
 * @license All-Rights-Reserved
 * @link http://github.com/
 * 
 * ==================================================
 * 
 * * description
 * 
 */

const { Router } = require("express");
const express = require("express");
const SysRoute = require("../types/SysRoute");
const { RESTAPI__middleware_method } = require("./DefaultScript");
const SysContext = require("./SysContext");

module.exports = class SysApplication 
{

  PORT = 5000;
  MESSAGE = "ECOMMERCE SERVER IS RUNNING AT PORT %PORT% "
  VIEWS = "/views"

  #server = express();

  /** @type {Router}        */ #router_v1;
  /** @type {Router}        */ #router_v2;

  initRouters ()
  {
    this.#router_v1 = new Router();
    this.#router_v2 = new Router();
    this.#server.use(this.#router_v1);
    this.#server.use(this.#router_v2);
  }

  async change(app) 
  {

  }

  /** @type {Express} */
  getServer () { return this.#server; }

  listen ()
  {
    this.#server.listen(this.PORT, () => console.log(this.MESSAGE.replace("%PORT%", this.PORT)))
  }

  /**
   * 
   * @param {SysRoute[]} routes 
   * @param {import("../Ecommerce.lib").EcommerceLib} ecommerceLib;
   */
  setRoutes(routes, ecommerceLib)
  {
    this.#router_v1.stack = [];
    this.#router_v1.get("/router", (req, res) => res.send("okok"))
    for (let index = 0; index < routes.length; index++) {
      this.#router_v1[routes[index].method](
        routes[index].path,
        (req, res, next) => { req.restapi_context = new SysContext(ecommerceLib); next(); },
        routes[index].middlewares.map(m => m),
        routes[index].callback
      );
    }
  }


  /**
   * 
   * @param {SysRoute} route 
   */
  #callbackBaseOnType (route)
  {
    
  }

}