const annotation = require("awesome-annotations");
const AnnotationImport = require("awesome-annotations/lib/types/AnnotationImport");
const AnnotationStandaloneItem = require("awesome-annotations/lib/types/AnnotationStandaloneItem");
const { AnnotationType } = require("awesome-annotations/lib/types/StaticTypes");
const fs = require("fs");
const rd = fs.readdirSync;
const rf = fs.readFileSync;
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

var ROOT = path.resolve();

/**
 * @typedef  {Object} FileItem
 * @property {String} name;
 * @property {String} fullpath;
 * @property {String} path;
 * 
 * @typedef  {Object} ErrorTypeProp
 * @property {String} Name;
 * @property {String} Description;
 * @property {String} Guide;
 * 
 * @typedef  {Object} ClassInstanceWithAnnotation
 * @property {*}      Instance;
 * @property {AnnotationStandaloneItem[]} Annotations
 * 
 * @typedef  {Object} FunctionWithAnnotation
 * @property {*}      Func;
 * @property {String} Name
 * 
 */

/**
 * @typedef {Object} FileItemWithAnnotation
 * @property {String} Name;
 * @property {String} Fullpath;
 * @property {String} Path;
 * @property {AnnotationImport} AnnotationImport;
 * 
 */



const SysApplication = require("./src/SysApplication");
const SysViewController = require("./src/SysViewController");
const SysRestController = require("./src/SysRestController");
const SysError = require("./src/SysError");
const SysContext = require("./src/SysContext");
const SysModel = require("./src/SysModel");
const { ERRORTypes } = require("./types/SysStatic");
const { RESTAPI__controller_method, RESTAPI__middleware_method } = require("./src/DefaultScript");
const SysRoute = require("./types/SysRoute");



class EcommerceLib
{
  static Model = SysModel;
  static Application = SysApplication;
  static Context = SysContext;
  static RestController = SysRestController;

  /**
   * @InstanceProperties 
   */

  /** @type {Map<String, mongoose.Model>}                */ models = new Map();
  /** @type {Array<FileItem>}                            */ files;
  /** @type {Array<FileItemWithAnnotation>}              */ filesWithAnnotation = new Array();
  /** @type {FunctionWithAnnotation[]}                   */ middlewares = new Array();
  /** @type {mongoose.Connection}                        */ db = mongoose.createConnection("mongodb://localhost:27017/test-ecommerce");
  /** @type {SysApplication}                             */ application;

  /** @type {String} sourceDirectory */

  constructor(sourceDirectory) {
    this.sourceDirectory = sourceDirectory;
  }

  /**
   * entry point to run application
   * 
   * @returns void;
   */
  async main ()
  {
    console.time("s")
    this.files = EcommerceLib.deepReadDirectory(this.sourceDirectory);
    this.files.map(f => {
      const result = annotation(f.path, { debug: false, cached: true });
      if(result.annotations.length === 0) return;
      this.filesWithAnnotation.push({ Name: f.name, Path: f.path, Fullpath: f.fullpath, AnnotationImport: result })
    })
    // console.table(this.filesWithAnnotation)

    // const DefaultApplicationClass = this.getApplicationClasses();
    // if(!DefaultApplicationClass) 

    const applicationWithAnnotations = this.getClassInstanceSingletonWithAnnotation(EcommerceLib.Application);
    if(!applicationWithAnnotations) throw new SysError(ERRORTypes.MISSING_APPLICATION_CLASS);

    const contextWithAnnotations = this.getClassInstanceSingletonWithAnnotation(EcommerceLib.Context);
    console.log(contextWithAnnotations);

    /** @type {SysApplication} */
    this.application = applicationWithAnnotations.Instance;

    applicationWithAnnotations.Annotations.map(a => {
      switch (a.AnnotationName) {
        case "@Port": this.application.PORT = a.Props[0]; break;
        case "@Message": this.application.MESSAGE = a.Props[0]; break;
        case "@Views": this.application.VIEWS = a.Props[0]; break;
        default: break;
      }
    })

    const db = mongoose.createConnection("mongodb://localhost:27017/ecommerce-test");
    const User = db.model("users", mongoose.Schema({
      username: String
    }));

    const models = this.getClassInstancesWithAnnotationsByAnnotation("@Model", EcommerceLib.Model, this);

    // console.table(models)


    await this.application.change(this.application.getServer()) // run the changes that might be from application side;

    this.middlewares = this.getDefaultExportAsyncFunctionsWithAnnotationsByAnnotation("@Middleware");
    

    this.models.set("User", User);

    const result = this.getClassInstancesWithAnnotationsByAnnotation("@RestController", EcommerceLib.RestController, this);

    this.application.initRouters();
    this.application.setRoutes([new SysRoute(
      this, "RESTAPI_CONTROLLER_METHOD", "GET", "/api/v1/hi", "application/json", ["admin"], 
      (context, express) => context.data.set("www", 123)
    )]);
    const allRoutes = [];
    result.map(r => r.Instance.readyRoutes.map(m => allRoutes.push(m)));
    this.application.setRoutes(allRoutes, this);
    
    // ! debug console.log(result.map(i => i.Instance));


    this.application.listen();

    console.timeEnd("s")
    console.log("running")
  }


  /** @returns {ClassInstanceWithAnnotation} */
  getClassInstanceSingletonWithAnnotation (ClassInstanceOf)
  {
    let instance;
    let annotations;
    this.filesWithAnnotation.filter(f => f.AnnotationImport.annotations.some(s => s.Type === AnnotationType.DEFAULT_CLASS)).map(i => {
      const instanceClass = new i.AnnotationImport.exports();
      if(instanceClass instanceof ClassInstanceOf === true) {
        instance = instanceClass; annotations = i.AnnotationImport.getAnnos(i.AnnotationImport.exports.name);
      }
    })
    if(!instance) return null
    return { Instance: instance, Annotations: annotations }
  }

  /** 
   * @param {String} AnnotationName
   * @param {*} ClassInstanceOf
   * @param {EcommerceLib} ecommerceLib
   * @returns {ClassInstanceWithAnnotation[]} 
   */
  getClassInstancesWithAnnotationsByAnnotation (AnnotationName, ClassInstanceOf, ecommerceLib)
  {
    /** @type {ClassInstanceWithAnnotation[]} */ let result = []
    this.filesWithAnnotation.filter(f => f.AnnotationImport.annotations.some(s => s.Type === AnnotationType.DEFAULT_CLASS)).map(i => {
      if(i.AnnotationImport.getAnnos(i.AnnotationImport.exports.name).some(s => s.AnnotationName === AnnotationName)) {
        const instance = new i.AnnotationImport.exports();
        if(instance instanceof ClassInstanceOf === true) {
          instance.build(i.AnnotationImport, ecommerceLib);
          result.push({ Instance: instance, Annotations: i.AnnotationImport.annotations });
        } else {
          throw new SysError(ERRORTypes.MISSING_EXTEND, ` Classname: ${i.AnnotationImport.exports.name}`);
        }
      }
    })
    return result;
  }

  /** @returns {FunctionWithAnnotation[]} */
  getDefaultExportAsyncFunctionsWithAnnotationsByAnnotation (AnnotationName)
  {
    /** @type {FunctionWithAnnotation[]} */ let result = []
    this.filesWithAnnotation.filter(f => f.AnnotationImport.annotations.some(s => s.Type === AnnotationType.DEFAULT_ASYNC_FUNCTION)).map(i => {
      const currAnno = i.AnnotationImport.getAnnos().find(f => f.AnnotationName === AnnotationName)
      if(!currAnno) return;
      result.push({ Func: i.AnnotationImport.exports, Name: currAnno.ItemName });
    })
    return result;
  }

  async contentToDatabase ()
  {

  }
  
  /**
   * @param {String} directoryPath 
   * @returns {Array<FileItem>}
   */
  static deepReadDirectory (directoryPath)
  {
    /** @type {FileItem[]} files */ const files = []
    const fdir = ROOT + directoryPath;
    rd(fdir).map(/** @Name item directory */ idir => {
      if(fs.lstatSync(fdir + `/${idir}`).isDirectory()) {
        EcommerceLib.deepReadDirectory(directoryPath + `/${idir}`).map(fitem => files.push(fitem));
      } else {
        files.push({ name: idir, fullpath: fdir + `/${idir}`, path: directoryPath + `/${idir}` });
      }
    });
    return files;
  }

}




module.exports.EcommerceLib = EcommerceLib


function AnnotationReader ()
{

}

function deepDirectoryReader ()
{

}

class RestControllerAnnotation
{

}

class ModelAnnotation
{

}

class GenerateAdminApis
{

}



async function middlewarefunc (middleware) {

  return async (req, res, next) => await middleware({req, res}, next, req.context);
}

async function controllerfunc (controllermethod) {

  return async (req, res, next) => await controllermethod({req, res}, req.context);
}










/**
 * 
 */

function loop (app, middlewares, controller)
{
  
  app.get("asda",
  (req, res, next) => {
    req.context = new Context();
  },
    middlewares.map(m => middlewarefunc(m)),
    controllerfunc(controller)
  )

}

// /** @type {FileItem[]} files */ const allFiles = deepReadDirectory("/src");

// const annotationResults = [];

// for (let index = 0; index < allFiles.length; index++) {
//   annotationResults.push(annotation(allFiles[index].path, { debug: false, cached: true }).result);
// }