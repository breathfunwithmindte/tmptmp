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
const { ERRORTypes } = require("../types/SysStatic");

module.exports = class SysError extends Error 
{

  /** @type {String} */ Name;
  /** @type {String} */ Description;
  /** @type {String} */ Guide;
  /** @type {*}      */ Data;

  /**
   * @param {ErrorTypeProp} error 
   * @param {String | null} description
   * @param {*} data; 
   */
   constructor(error, description, data) {
    let message = `[ERROR::${error.Name}] ~> ${error.Description + (description || "")}`
    super(message);
    this.Name = error.Name;
    this.Description = error.Description + (description || "");
    this.Guide = error.Guide;
    this.Data = data || null;
  }

}