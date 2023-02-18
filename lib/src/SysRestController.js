/**
 * @name EcommerceTemplate
 * @namespace Lib::RestController
 * @author Mike Karypidis
 * @license All-Rights-Reserved
 * @link http://github.com/
 * 
 * ==================================================
 * 
 * * description
 * 
 */

const express = require("express");
const { AnnotationType } = require("awesome-annotations/lib/types/StaticTypes");
const AnnotationImport = require("awesome-annotations/lib/types/AnnotationImport");
const SysRoute = require("../types/SysRoute");

/**
 * @typedef ExpressRoute
 * @property {String}       path;
 * @property {Function[]}   middlewares;
 * @property {Function}     callback;
 */

module.exports = class RestController 
{
  contentType = "application/json";
  routes = new Map();
  readyRoutes = new Array();

  /**
   * Collects base on annotation all rest api endpoints and add them to the express application
   * 
   * @param {AnnotationImport} annoImport;
   * @param {import("../Ecommerce.lib").EcommerceLib} ecommerceLib; 
   */
  build (annoImport, ecommerceLib)
  {
    annoImport.annotations.map(anno => {
      if([AnnotationType.CLASS_ASYNC_METHOD, AnnotationType.CLASS_METHOD].some(s => s === anno.Type)){
        if(typeof this[anno.ItemName] !== "function") return;
        this.#checkIfExistAndDo(anno.ItemName, "callback", this[anno.ItemName]);
        switch(anno.AnnotationName) {
          case "@GetMapping": 
            this.#checkIfExistAndDo(anno.ItemName, "method", "GET");
            this.#checkIfExistAndDo(anno.ItemName, "path", anno.Props[0]);
            break;
          case "@PostMapping":
            this.#checkIfExistAndDo(anno.ItemName, "method", "POST");
            this.#checkIfExistAndDo(anno.ItemName, "path", anno.Props[0]);
            break;
          case "@PutMapping":
            this.#checkIfExistAndDo(anno.ItemName, "method", "PUT");
            this.#checkIfExistAndDo(anno.ItemName, "path", anno.Props[0]);
            break;
          case "@DeleteMapping":
            this.#checkIfExistAndDo(anno.ItemName, "method", "DELETE");
            this.#checkIfExistAndDo(anno.ItemName, "path", anno.Props[0]);
            break;
          case "@PatchMapping":
            this.#checkIfExistAndDo(anno.ItemName, "method", "PATCH");
            this.#checkIfExistAndDo(anno.ItemName, "path", anno.Props[0]);
            break;
          case "@Middlewares":
            this.#checkIfExistAndDo(anno.ItemName, "middlewares", anno.Props);
          default: break;
        }
      }
    })
    this.routes.forEach((value, key) => {
      this.readyRoutes.push(new SysRoute(
        ecommerceLib, "RESTAPI_CONTROLLER_METHOD", value.method, value.path, this.contentType, 
        value.middlewares, value.callback
      ))
    })
  }

  #checkIfExistAndDo (name, key, value)
  {
    if(this.routes.has(name)) {
      this.routes.get(name)[key] = value;
    } else {
      this.routes.set(name, { [key]: value })
    }
  }

}