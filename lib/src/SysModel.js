/**
 * @name EcommerceTemplate
 * @namespace Lib::SysModel
 * @author Mike Karypidis
 * @license All-Rights-Reserved
 * @link http://github.com/
 * 
 * ==================================================
 * 
 * * description
 * 
 */

const { AnnotationType } = require("awesome-annotations/lib/types/StaticTypes");
const AnnotationImport = require("awesome-annotations/lib/types/AnnotationImport");
const express = require("express");
const mongoose = require("mongoose");

module.exports = class SysModel 
{

  collectionname = "";
  apis = new Array();
  fields = new Array();
  schema = new Object();
  /** @type{mongoose.Model} */ model;


  /**
   * Collects base on annotation all rest api endpoints and add them to the express application
   * 
   * @param {AnnotationImport} annoImport;
   * @param {import("../Ecommerce.lib").EcommerceLib} ecommerceLib;
   */
  build (annoImport, ecommerceLib)
  {
    annoImport.annotations.map(anno => {
      if([AnnotationType.DEFAULT_CLASS].some(s => s === anno.Type)){
        switch(anno.AnnotationName) {
          case "@CollectionName": 
          this.collectionname = anno.Props[0];
            break;
          case "@Fields":
            this.fields = anno.Props[0];
          case "@GenerateApis":
            console.log(anno.Props, "@@@@@@@@@@@@@ generate apis")
          case "@GenerateDefaultAdminApis":

          case "@GenerateDefaultAdminApisAll":

          default: break;
        }
      }
    })
    console.log(this);
  }

  /** read, write, update, delete */

  async read_many (context, express)
  {
    try {
      context.data().set(this.collectionname, await this.model.find(express.req.query).populate(this.populatedFields))
    } catch (err) {
      console.log(err);
    }
  }

  async create_one (context, express)
  {
    try {
      context.data().set(this.name.toLowerCase() + "s", await this.Model.create(express.req.body))
    } catch (err) {

    }
  }

}