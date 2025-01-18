"use strict";

/* Package System */
const Controller = require('@system/Controller');
const Model = require('@system/Model');
const { extractBase64 } = require("@utils/Helper");
const { nanoid } = require("nanoid");
const path = require("path");
const fs = require("fs");

module.exports = class extends Controller{

  constructor(tableName){
    super(tableName);
    this.db = new Model("infors");
  }

  async getAll (req, res) {
    try {
      if (!req.query?.fqnull) req.query.fqnull = "deleted_at";
      req.query.joinQueries = [
        {
          fieldJoin: "category_id",
          fieldTarget: "id",
          table: "categories",
          mergeField: "categories.name as categories_name",
        },
      ];
      const _data = await this.db.find(req);
      let _items = _data.data.filter((v) => v.id !== process.env.ADMIN_ID);

      this.response(res, 200, _data == null ? [] : { data: _items, total: _data.total });
    } catch (e) {
      this.response(res, 500, e.message);
    }
  }
}