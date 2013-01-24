$(function($) {
	
	var methods = {
		init : function ( collection, in_options ) {
			var default_options = {
				selected_value: '',
				required: false,
				first_description:'-- Seleccione --'
			};       
			
			var options = $.extend(default_options, in_options) ;
			var obj = $(this);
			obj.addClass( "ui-widget ui-corner-all ui-widget-content" );
		    var self = this;	
			var function_refresh = function(event_name) {
				methods.clean.apply(obj, [collection, options, event_name]);
			};
			
			collection.bind('all', function_refresh);
			methods.update.apply(obj, [collection, options]);
		},
		
		clean: function(collection, options, event_name) {
			var obj = $(this);
			obj.html('');
			methods.update.apply(obj, [collection, options, event_name]);
		},
	
		select: function(cod_value) {
			$(this).val(cod_value);
		},
		
		reset: function() {
			$(this).val('');
		},
	
		update: function(collection, options, event_name){
			var obj = $(this);
			var descripcion = options.descripcion;
			var description_function = descripcion;

            var highlight_function = options.highlight;
            var has_highlight = (typeof(highlight_function) != 'undefined');
            
			
			if (typeof(description_function) != 'function') {
				description_function = function(model) {
					return model.get(descripcion);
				};
			}
			
			var selected_function = options.selected;
			var codigo = options.codigo;
            if(typeof(selected_function) == 'undefined') {
            	if(collection.length == 0) {
            		obj.width(100);
            		selected_function = function(model) {};
                } else {
                	obj.width('auto');
                	if(collection.length == 1) {
                        selected_function = function(model) {
                            return true;
                        };
                    } else {
                        if(options.selected_value) {
                            selected_function = function(model) {
                                return ( options.selected_value == model.get(codigo) );				
                            };
                        } else {
                            if(options.required) {
                                var first_value = collection.first().get(codigo);
                                selected_function = function(model) {
                                    return ( model.get(codigo) == first_value );				
                                };
                            } else {
                                selected_function = function(model) {
                                    return model.get('selected');
                                };
                            }
                        }
                    }
                }
            }
			
			if (!options.required) {
                obj.append($('<option></option>').attr('value', '').text(options.first_description));
			}

            var get_codigo;
            if(codigo == 'id') {
                get_codigo = function(model) {
                    return model.cid;
                };
            } else {
                get_codigo = function(model) {
                    return model.get(codigo);
                };
            }
            var option_selected = null;
            var first = true, first_option = null;
            collection.each(function(model){
                var option = $('<option></option>').attr('value', get_codigo(model)).html(description_function(model)),
                    selected = selected_function(model);
                if(selected) {
                    option_selected = option;
                }
                if(first) {
                    first_option = option;
                }
                if(has_highlight) {
                    option.attr('style',highlight_function(model));
                }
                obj.append(option); 
            });
            if(option_selected == null && options.required) {
                option_selected = first_option;
            }
            if(option_selected) {
                try {
                    option_selected.attr('selected', true);
                    obj.trigger('change');
                } catch(err) {
                    _.delay(function() {
                        option_selected.attr('selected', true);
                        obj.trigger('change');
                    }, 500);
                }
            }	
            
            obj.trigger('updated', obj);
            
		}
	};

	$.fn.datacombo = function( method ) {
    
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}
	};
		
});
