/**
 * @name EcommerceTemplate
 * @namespace Lib::ViewController
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

module.exports = class ViewController 
{

  /**
   * Collects base on annotation all rest api endpoints and add them to the express application
   * 
   * @param {AnnotationImport} annoImport;
   * @param {import("../Ecommerce.lib").EcommerceLib} ecommerceLib;
   */
  build (annoImport, ecommerceLib)
  {

  }

}