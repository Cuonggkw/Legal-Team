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
    this.db = new Model('partners');
  }

  async create (req, res) {
    try {
      const _check = await this.validate(req, res);
  
      if(_check === false){
        let _data = {};
        _data = req.body;
        _data.created_at = new Date();
        _data.updated_at = new Date();
        if (_data?.logo) {
          try {
            const _parse = extractBase64(_data.logo.file); // `image` là key trong form upload
  
            if (!_parse) {
              return this.response(res, 400, "File ảnh không tồn tại.");
            }
            const _name = `/${nanoid()}.${_parse.ext}`;
            const filePath = path.join("./public/upload/partners", _name);
  
            await this.uploadFileLocal(_data.logo, filePath);
            _data.logo = filePath;
          } catch (e) {
            console.log(e);
            return this.response(res, 500, "Upload failure, please try again");
          }
        }
        this.db.insert(_data);
        this.response(res, 201);
      }
    } catch (e) {
      this.response(res, 500, e.message);
    }
  }

  async update(req, res) {
      try {
        // Validate
        const _check = await this.validate(req, res);
  
        if (_check === false) {
          let _data = {};
          _data = req.body;
          _data.created_at = new Date();
          _data.updated_at = new Date();
          if (_data?.logo) {
            try {
              const _parse = extractBase64(_data.logo.file); // `image` là key trong form upload
  
              if (!_parse) {
                return this.response(res, 400, "File ảnh không tồn tại.");
              }
  
              const _name = `/${nanoid()}.${_parse.ext}`;
              const filePath = path.join("./public/upload/partners", _name);
              await this.uploadFileLocal(_data.logo, filePath);
              _data.logo = filePath;
            } catch (e) {
              console.log(e);
              return this.response(res, 500, "Upload failure, please try again");
            }
          }
          if(_data?.ended_at) _data.ended_at = new Date(_data.ended_at);
        this.db.update({ id: req.params.id }, _data);
  
        this.response(res, 200);
        }
      } catch (e) {
        this.response(res, 500, e.message);
      }
  }

  async uploadFileLocal(imageData, igePath) {
    try {
      if (imageData && igePath) {
        const base64Data = imageData.file.replace(/^data:image\/\w+;base64,/, "");
            // console.log(base64Data);
        const _dir = "D:\\Legal-team\\sourceapi\\public\\upload\\partners" || path.resolve(process.env.DIR_UPLOAD, "partners");
    
        if (!fs.existsSync(_dir)) fs.mkdirSync(_dir);
    
        fs.writeFileSync(path.join("D:\\Legal-team\\sourceapi\\", igePath), base64Data, 
        "base64", function (err) {
            if (err) console.error(err);
            else console.log("File created successfully.");
          }
        );
        return path.join(_dir, igePath);
      } else {
        console.error("Image data is missing or invalid");
        return null;
      }
    } catch (e) {
      console.log(e);
      return e.message;
    }
  }
}