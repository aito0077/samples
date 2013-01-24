(function(){

  //Setup

  var self = this;

    var Uif;
    if (typeof exports !== 'undefined') {
        Uif = exports;
    } else {
        Uif = self.Uif = {};
    }

    Uif.Model = Backbone.Model.extend({
    });

    _.extend(Uif.Model.prototype, Backbone.Model, {
        lowercase: true,
        datatype: 'json',
        fetch : function(options) {
            options || (options = {});
            var model = this;
            var success = options.success;
            options.error = wrapError(options.error, model, options, 'error');
            options.warning = wrapError(options.warning, model, options, 'warning');
            options.success = function(resp, status, xhr) {
                if(resp.EXCEPTION || resp.ERROR) {
                    options.error(resp);
                    return false;
                }
                if(resp.WARNING) {
                    options.warning(resp);
                }
                if (!model.set(model.do_parse(resp, xhr), options)) return false;
                if (success) success(model, resp);
            };
            _.extend({cache:false}, options);

            return (this.sync || Backbone.sync).call(this, 'read', this, options);
        },

        do_parse : function(resp, xhr) {
            this.parse(resp, xhr);
        },

        parse: function(response) {
        	if(response) {
                if(typeof(this.context) == 'undefined') {
                     this.context = new Uif.Model;
                }
                if(response.cursor) {
                    if(typeof(this.cursor) == 'undefined') {
                         this.cursor = new Uif.Collection;
                    }
                    this.cursor.reset(response.cursor);
                }
                var result = response;
                result.cursor = null;
                this.context.set(result);
        	}
        },

        toJSON : function() {
            var attributes_extended = _.clone(this.attributes);
            attributes_extended.id = this.cid;
            return attributes_extended;
        },

        notification_handler: function(resp, event_name) {
            switch(event_name) {
                case 'warning':
                    Message.show_warning(resp.WARNING);
                    break;
                case 'error':
                    Message.show_error(resp.ERROR);
                    break;
                default:
                    Message.show_message(resp);
                    break;
            }
        }

    });

    Uif.Collection = Backbone.Collection.extend({
    });

    _.extend(Uif.Collection.prototype, Backbone.Collection, Uif.Model, {
        fetch : function(options) {
            options || (options = {});
            var collection = this, success = options.success;
            options.success = function(resp, status, xhr) {
                collection[options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
                if (success) success(collection, resp);
            };
            options.error = wrapError(options.error, collection, options);
            return (this.sync || Backbone.sync).call(this, 'read', this, options);
        }

    });

    Uif.View = Backbone.View.extend ({
        buttons: []

    });

    Uif.Message = Backbone.View.extend ({
   });

    _.extend(Uif.Message.prototype, Backbone.View, {
        show_error: function(message) {
            Notifier.error(message, 'Error');
        },
        show_warning: function(message) {
            Notifier.warning(message, 'Atencion');
        },
        show_info: function(message) {
            Notifier.info(message, 'Informacion');
        },
        show_success: function(message) {
            Notifier.success(message, 'Exito');
        },
        show_message: function(message) {
            Notifier.notify(message, 'Exito');
        }
 
    });

    window.Message = new Uif.Message;

    _.extend(Uif.View.prototype, Backbone.View, {

        bind_close_event: function(callback) {
            $(window).bind("beforeunload", callback);
        },

        unbind_close_event: function() {
            $(window).unbind("beforeunload");
        },

        execute_service: function(options) {
            var params = _.extend({
                error: this.error_handler,
                cache: false,
                dataType: 'json'
            }, options);

            $.ajax(params);
        },

        binds_for_model: function(bindings, model) {
            _.each(bindings, function(binding) {
                Synapse('#'+binding.ui).observe(model, binding.property);
            });
        }

    });

  // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
    var ctor = function(){};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
    var inherits = function(parent, protoProps, staticProps) {
        var child;
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
          child = protoProps.constructor;
        } else {
          child = function(){ return parent.apply(this, arguments); };
        }
        _.extend(child, parent);
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        if (protoProps) _.extend(child.prototype, protoProps);
        if (staticProps) _.extend(child, staticProps);
        child.prototype.constructor = child;
        child.__super__ = parent.prototype;

        return child;
    };

    var wrapError = function(onError, model, options, event_name) {
        return function(resp) {
            model.notification_handler(resp, event_name);
            if (onError) {
                onError(model, resp, options);
            } else {
                model.trigger(event_name, model, resp, options);
            }
        };
    };

    var extend = function (protoProps, classProps) {
        var child = inherits(this, protoProps, classProps);
        child.extend = this.extend;
        return child;
    };

    // Set up inheritance for the model, collection, and view.
    Uif.Model.extend = Uif.Collection.extend = Uif.Message = Uif.View.extend = extend;

    _.templateSettings = {
          evaluate    : /\{%([\s\S]+?)%\}/g,
          interpolate : /\{%=([\s\S]+?)%\}/g
    };

}).call(this);
