/**
 * @name EcommerceTemplate
 * @namespace Lib::types::ViewController
 * @author Mike Karypidis
 * @license All-Rights-Reserved
 * @link http://github.com/
 * 
 * ==================================================
 * 
 * * description
 * 
 */

const { RESTAPI__controller_method, RESTAPI__model_method, RESTAPI__middleware_method } = require("../src/DefaultScript");


module.exports = class SysRoute 
{

  /** @type {String}              */        type; //
  /** @type {String}              */        method;
  /** @type {String}              */        path;
  /** @type {String}              */        contentType;
  /** @type {String[]}            */        middlewares;
  /** @type {Function}            */        callback;
  /** @type {String}              */        modelname;
  /** @type {String}              */        modelmethod;


  /**
   * 
   * @param {import("../Ecommerce.lib").EcommerceLib} ecommerceLib; 
   * @param {String} type 
   * @param {String} method 
   * @param {String} path 
   * @param {String} contentType 
   * @param {String[]} middlewares 
   * @param {Function} callback 
   * @param {String} modelname 
   * @param {String} modelmethod 
   */
  constructor(ecommerceLib, type, method, path, contentType, middlewares, callback, modelname, modelmethod) 
  {
    this.method = method ? method.toLowerCase() : "get";
    this.path = path;
    this.contentType = contentType;
    this.middlewares = middlewares;
    this.middlewares = middlewares.map(m => {
      const currentMiddleware = ecommerceLib.middlewares.find(f => f.Name === m);
      const notfoundmiddleware = (context, express) => {
        context.data.set("system-error", "middleware not found with name " + m + ".");
        context.response(express.res);
      }
      return RESTAPI__middleware_method.bind({
        middleware_method: currentMiddleware ? currentMiddleware.Func : notfoundmiddleware, ecommerceLib: ecommerceLib
      });
    })
    switch (type) {
      case "RESTAPI_CONTROLLER_METHOD":
        this.type = type;
        this.modelname = null;
        this.modelmethod = null;
        const unfoundcallback = (context, express) => {
          context.data.set("system-error", "controller method not found.")
        }
        this.callback = RESTAPI__controller_method.bind({
          controller_method: callback || unfoundcallback, ecommerceLib: ecommerceLib
        });
        break;
      case "RESTAPI__MODEL_METHOD":
        this.type = type;
        this.modelname = modelname;
        this.modelmethod = modelmethod;
        const unfoundmodelcallback = (context, express) => {
          context.data.set("system-error", "controller method not found.")
        }
        this.callback = RESTAPI__model_method.bind({
          model_method: this.callback || unfoundmodelcallback
        });
        break;
      default:
        throw new Error("Not supported type for route.")
        break;
    }
  }
  

}