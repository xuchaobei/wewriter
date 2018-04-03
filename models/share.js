/**
 * Created by xu on 16/6/22.
 */

var async = require('async');
var dbPool = require('./db');

function Share(seq, imageUrl, quote, author){
    this.seq = parseInt(seq) ;
    this.imageUrl = imageUrl;
    this.quote = quote;
    this.author = author;
}

Share.prototype.save = function(callback) {
  var share = {
    seq: this.seq,
    image_url: this.imageUrl,
    quote: this.quote,
    author: this.author
  }
  queryById(this.seq, function(err, data){
    if(err) {
      callback(err);
    } else {
      if(data) {
        deleteById(share.seq, function(err) {
          if(err) {
            callback(err);
          } else {
            insert(share, callback);
          }
        })
      }else {
        insert(share, callback);
      }
    }
  })
}

Share.get = function get(seq, callback){
  queryById(seq, callback);
};

function queryById(seq, callback){
    dbPool.query("select * from share where seq = ? ", seq, function(err, data) {
      if(err) {
        callback(err);
      } else {
        share = null;
        if(data.length > 0){
          share = data[0];
        }
        callback(null, share);
      }
    });
}

function insert( share, callback) {
  dbPool.query('insert into share set ?', share, callback);
}

function deleteById( seq, callback) {
  dbPool.query("delete from share where seq = ?", seq, callback);
}

module.exports = Share;
