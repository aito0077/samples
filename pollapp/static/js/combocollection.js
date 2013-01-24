$(function($) {

//   $('select').combocollection({
//       collection: collection,
//       first_description: '-- seleccione --',
//       code: 'cod_mutual',
//       description: 'descripcion',
//		 description: function(model) {
//	   		return model.get("cod_delegacion")+' - '+model.get("descripcion");
//		 },
//       onselect: callback,
//   });
//



    $.fn.combocollection = function(collection, in_options) {
        var default_options = {
			selected_value: '',
            required: false,
            first_description:''
		};       
        var options = $.extend(default_options, in_options) ;
        var obj = $(this);

        var required = options.required;
        var selected_value = options.selected_value;                        
        var callback = options.callback;
        var codigo = options.codigo;
        var descripcion = options.descripcion;

		var description_function = descripcion;
		if(typeof(descripcion) != 'function') {
			description_function = function(model) {
				return model.get(descripcion);
			};
		}

		obj.html('');
		
        if(!required) {
	        obj.append('<option value="">' + options.first_description + '</option>');
        }
        collection.each(function(model) {
        	if(typeof(selected_value)=='undefined'){
        		selected_value='';
        	}
        	var selected = ((required && selected_value == '') || (model.get(codigo) == selected_value));
			if(selected) {
				selected_value = model.get(codigo);
			}
	        obj.append('<option value="'+ model.get(codigo) +'" '+(selected ? 'selected' : '')+'>'+description_function(model)+'</option>');
        });
        if(required) {
        	obj.trigger('change');
        }
    };
});
