"use strict";

/* Package System */
const Controller = require('@system/Controller');
const Model = require('@system/Model');

module.exports = class extends Controller{

  constructor(tableName){
    super(tableName);
    this.db = new Model('introduces');
  }
}