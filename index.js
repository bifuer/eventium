/* jslint node: true */
"use strict";

global.modulesCache = global.modulesCache || {};
if(global.modulesCache['eventium']){
  module.exports = global.modulesCache['eventium'];
  return;
}

var ObjectArray = require('objectarray');
var Procedure = require('procedure');

module.exports = global.modulesCache['eventium'] = Eventium;

function Eventium(target){
  this.target = target;
  this.events = new ObjectArray();
  target.eventium = this;
}

  Eventium.prototype.fire = function(name,meta,callback){
    var eventium = this;
    var target = eventium.target;
    var ons = eventium.events.getAll(name,'name');
    if(ons.length>0){
      var procedure = new Procedure();
      var i,l;
      for(i=0,l=ons.length;i<l;i++){
        var event = ons[i];
        var targetClass = (target.constructor?target.constructor.name:false) || "unknowClass";
        procedure.add('eventium.'+targetClass+'.'+name+"."+(event.handler.name || "unknowHandler"),event.handler,target,meta);
      }
      procedure.launch(function(errors){
        if(errors){
          crier.error('error',{error:errors[i]},callback);
        } else if(callback){
          callback();
        }
      });
    } else if(callback){
      callback();
    }
  };

  Eventium.prototype.on = function(name,handler,index){
    var eventium = this;
    eventium.events.add({
      name:name,
      handler:handler
    },index);
  };