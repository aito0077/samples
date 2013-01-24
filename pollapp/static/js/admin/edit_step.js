(function(){

    var self = this;

    if (typeof Admin == 'undefined') {
        Admin = self.Admin = {};
    }

    Admin.EditStep = Uif.View.extend({
        el: $('#dialog_editar_actividad'),
        codigo_proceso: 'default',

        events: {
            'click #button_cancelar_actividad': 'cancelar_actividad',
            'click #button_guardar_actividad': 'guardar_actividad',
            'click #button_actividad_pregunta_agregar': 'agregar_respuesta',
            'click #button_actividad_pregunta_guardar': 'guardar_edicion_respuesta',
            'click #button_actividad_pregunta_cancelar': 'cancelar_edicion_respuesta',

            'change #actividad_especial_video_resources': 'establecer_propiedad',
            'change #actividad_especial_flash_resources': 'establecer_propiedad',
            'change #actividad_clase_contenido': 'establecer_propiedad',
            'change #actividad_clase_pregunta': 'establecer_propiedad',
            'change #actividad_sumario': 'establecer_propiedad',
            'change #actividad_pregunta': 'establecer_propiedad',
            'change #actividad_clase_tipo': 'establecer_propiedad',

            'click #actividad_clase_contenido': 'establecer_clase',
            'click #actividad_clase_pregunta': 'establecer_clase',
            'click #actividad_clase_especial': 'establecer_clase'

        },

        initialize: function() {
            _.bindAll(this, 'render', 'reset', 'setup_bindings', 'guardar_actividad', 'cancelar_actividad', 'validate_actividad', 'establecer_propiedad', 'analizar_alta_actividad', 'establecer_clase', 'visualizar_clase', 'setup_combos', 'render_respuestas',  're_arrange_respuestas', 'validar_respuesta', 'guardar_edicion_respuesta', 'cancelar_edicion_respuesta', 'visualizar_clase_pregunta', 'visualizar_clase_contenido', 'visualizar_clase_especiales', 'visualizar_tipo', 'visualizar_tipo_pregunta', 'reset_clase_tipo_pregunta', 'establecer_texto', 'visualizar_tipo_especial', 'establecer_datos_actividad', 'create_view');

            this.codigo_proceso = this.options.codigo_proceso;
            this.model = new Uif.Model;
            this.respuestas_view = new Array;
            this.respuestas = new Uif.Collection;
            this.actividad_x_tipo = new Uif.Collection;
            this.render();
        },

        render: function() {
            this.setup_components();
            this.setup_servicios();
            this.setup_bindings();
        },

        reset: function(options) {
            this.model.clear();
            this.model.set({modify: false});
            this.respuestas_view = new Array();
            if(typeof(options) != 'undefined') {
                if(options.activity) {
                    this.model.set(_.extend(
                        options.activity.toJSON(),
                        {
                            codigo_proceso: options.codigo_proceso,
                            modify: true
                        }
                    ));
                } else {
                    this.model.set({
                        codigo_proceso: options.codigo_proceso,
                        codigo: options.codigo_actividad
                    });
                }
            }
            this.traer_recursos();
       },

        setup_components: function() {
            var self = this;
            this.setup_combos();
            
            $('#actividad_contenido_texto').redactor({
                lang: 'es',
                plugins: ['fullscreen', 'clips'],
                imageUpload: '/admin/resources/upload_image_redactor/'+this.codigo_proceso
            });
        },

        setup_combos: function() {
            this.tipos_resources = new Uif.Collection;
            this.resources = new Uif.Collection;
            this.tipos_actividad = new Uif.Collection([
                {clase: 'pregunta', codigo: 'MC', descripcion: 'Seleccion &uacute;nica'},
                {clase: 'pregunta', codigo: 'SM', descripcion: 'Seleccion m&uacute;ltiple'},
                {clase: 'pregunta', codigo: 'TL', descripcion: 'Texto libre'},
                {clase: 'pregunta', codigo: 'V', descripcion: 'Valor'},
                {clase: 'contenido', codigo: 'TP', descripcion: 'Contenido'},
//                {clase: 'contenido', codigo: 'BASES', descripcion: 'Bases'},
//                {clase: 'especial', codigo: 'LG', descripcion: 'Login'},
                {clase: 'especial', codigo: 'FLASH', descripcion: 'Flash'},
                {clase: 'especial', codigo: 'VIDEO', descripcion: 'Video'}
            ]);

            $('#actividad_clase_tipo').datacombo(this.actividad_x_tipo, {
                codigo: 'codigo',
                descripcion: 'descripcion',
                required: true
            });

            $('#actividad_especial_video_resources').datacombo(this.resources, {
                codigo: 'path',
                descripcion: 'filename',
                required: true
            });

            $('#actividad_especial_flash_resources').datacombo(this.resources, {
                codigo: 'path',
                descripcion: 'filename',
                required: true
            });


            

        },

        setup_servicios: function() {
            this.recursos = new Uif.Model({
                url: '/admin/resources/list_resources'
            });
        },

        setup_bindings: function() {
            this.model.on('change:clase', this.visualizar_clase);
            this.model.on('change:tipo', this.visualizar_tipo);
            this.model.on('change:modify', this.establecer_datos_actividad);
            this.respuestas.on('add', this.render_respuestas);
        },

        establecer_datos_actividad: function(model, attribute) {
            if(attribute === true) {
                $('#actividad_clase_'+model.get('clase')).trigger('click');

                $('#actividad_especial_video_resources').attr('value', model.get('datapath'));
                $('#actividad_especial_flash_resources').attr('value', model.get('datapath'));

                $('#actividad_clase_contenido').attr('value', model.get('clase_contentido'));
                $('#actividad_clase_pregunta').attr('value', model.get('clase_pregunta'));
                $('#actividad_sumario').attr('value', model.get('descripcion'));
                $('#actividad_pregunta').attr('value', model.get('pregunta'));
                $('#actividad_clase_tipo').attr('value', model.get('tipo'));
                if(model.has('respuestas')) {
                    var  self = this;
                    _.each(model.get('respuestas'), function(respuesta) {
                        var respuesta_model = new Uif.Model(respuesta);
                        self.create_view(respuesta_model);
                        self.respuestas.add(respuesta_model);
                    });
                    this.render_respuestas();
                }

            } else {
                this.respuestas.reset();
                this.render_respuestas();
                $('#actividad_edit_respuestas').html();
                this.reset_edicion_respuesta();
                $('#actividad_clase_contenido').removeClass('active');
                $('#actividad_clase_especial').removeClass('active');
                $('#actividad_clase_pregunta').removeClass('active');
                $('#actividad_sumario').attr('value', '').change();
                $('#actividad_pregunta').attr('value', '').change();
                $('#actividad_clase_tipo').attr('value', '').change();
                $('#actividad_contenido_texto').setCode('');
                this.visualizar_clase();
            }
        },

        traer_informacion_actividad: function() {

        },

        procesar_informacion_actividad: function() {

        },
        
        guardar_actividad: function() {
            if(this.validate_actividad()) {
                if(_.contains(['MC', 'SM'], this.model.get('tipo'))) {
                    this.model.set({
                        respuestas: this.respuestas
                    });
                }
                if(this.model.get('clase') == 'contenido') {
                    this.establecer_texto();
                }
                this.trigger('guardar_actividad', this.model);
            }
        },

        cancelar_actividad: function() {
            this.trigger('cancelar_actividad');
        },

        analizar_alta_actividad: function(response) {
            //console.dir(response);
        },

        validate_actividad: function() {
            return true;
        },

        establecer_clase: function(e) {
            var clase = '';
            switch(e.target.id) {
                case 'actividad_clase_contenido':
                    clase = 'contenido';
                    break;
                case 'actividad_clase_pregunta':
                    clase = 'pregunta';
                    break;
                case 'actividad_clase_especial':
                    clase = 'especial';
                    break;
                default:
                    clase = 'none';
                    break;
            }

            this.model.set({
                clase: clase
            });
        },

        visualizar_clase: function(model, attribute) {

            $('#body_step').css('display', attribute ? 'block' : 'none');
            if(!attribute) {
                $('#actividad_clase_contenido').button('reset');
                $('#actividad_clase_pregunta').button('reset');
                $('#actividad_clase_especiales').button('reset');
                return;
            }
            this.actividad_x_tipo.reset(_.filter(this.tipos_actividad.models, function(model) {
                return (model.get('clase') == attribute); 
            }));
            $('#row_tipo_actividad').css('display', attribute ? 'inline' : 'none');

            this.visualizar_clase_pregunta(attribute == 'pregunta');
            this.visualizar_clase_contenido(attribute == 'contenido', model.get('texto'));
            this.visualizar_clase_especiales(attribute == 'especial');
        },
        

        visualizar_tipo: function(model, attribute) {
            var clase = this.model.get('clase'),
                tipo = attribute;            

            switch(clase) {
                case 'contenido':
                    clase = 'contenido';
                    break;
                case 'pregunta':
                    this.visualizar_tipo_pregunta(tipo);
                    break;
                case 'especial':
                    this.visualizar_tipo_especial(tipo);
                    break;
                default:
                    clase = 'none';
                    break;
            }

        },

        visualizar_tipo_especial: function(tipo) {
            var video_pattern = /\.(avi|mkv|mov)$/i;
                flash_pattern = /\.swf$/i;
            $('#actividad_edit_tipo_especiales').css('display', 'block');
            $('#especial_login').css('display', 'none');
            $('#especial_video').css('display', 'none');
            $('#especial_flash').css('display', 'none');

            console.log(tipo);
            switch(tipo) {
                case 'FLASH':
                    this.resources.reset(_.filter(this.tipos_resources.models, function(model) {
                        return flash_pattern.test(model.get('filename'));
                    }));
                    $('#especial_flash').css('display', 'block');
                    break;
                case 'VIDEO':
                    this.resources.reset(_.filter(this.tipos_resources.models, function(model) {
                        return video_pattern.test(model.get('filename'));
                    }));
                    $('#especial_video').css('display', 'block');
                    break;
                case 'LG':
                    $('#especial_login').css('display', 'block');
                    break;
                default:
                    break;

            }
        },
 

        visualizar_tipo_pregunta: function(attribute) {
            var type_question = _.contains(['MC', 'SM'], attribute );
            $('#row_actividad_edicion_pregunta').css('display', type_question ? 'block' : 'none');
            if(type_question) {
                //$('#correcta_checkbox').css('display', (attribute == 'MC') ? 'inline' : 'none');
                this.reset_clase_tipo_pregunta();
                this.reset_edicion_respuesta();
            }
        },

        visualizar_clase_pregunta: function(visible) {
            $('#actividad_edit_tipo_pregunta').css('display', visible ? 'block' : 'none');
        },

        visualizar_clase_contenido: function(visible, texto) {
            $('#actividad_contenido_texto').setCode(texto ? texto : '');
            $('#actividad_edit_tipo_contenido').css('display', visible ? 'block' : 'none');
        },

        visualizar_clase_especiales: function(visible) {
            $('#actividad_edit_tipo_especiales').css('display', visible ? 'block' : 'none');
        },

        edit_respuesta: function(respuesta) {
            $('#actividad_respuesta_texto').attr('value', respuesta.get('texto'));
            $('#actividad_respuesta_valor').attr('value', respuesta.get('valor'));
            if(respuesta.get('correcta')) {
                $('#actividad_respuesta_correcta').attr('checked', 'checked');
            } 
            $('#button_actividad_pregunta_agregar').css('display', 'none');
            $('#button_actividad_pregunta_guardar').css('display', 'inline');
            $('#button_actividad_pregunta_cancelar').css('display', 'inline');

        },

        guardar_edicion_respuesta: function() {
            this.reset_edicion_respuesta();
        },

        cancelar_edicion_respuesta: function() {
            this.reset_edicion_respuesta();
        },

        agregar_respuesta: function() {
            var index = this.respuestas.length,
                correcta = ($('#actividad_respuesta_correcta').is(':checked')), 
                respuesta = new Uif.Model({
                    codigo: this.model.get('codigo')+'_r_'+index,
                    texto: $('#actividad_respuesta_texto').attr('value'),
                    valor: $('#actividad_respuesta_valor').attr('value'),
                    orden: index,
                    last: true,
                    tipo_pregunta: this.model.get('tipo'),
                    correcta: correcta
                });
            this.create_view(respuesta);
       },

       create_view: function(respuesta) {
            var self = this;
            if(this.validar_respuesta(respuesta)) {
                var respuesta_view = new Admin.RespuestaItemView({
                    model: respuesta,
                    edit_mode: true
                });
                respuesta_view.bind('up_sort', self.re_arrange_respuestas);
                respuesta_view.bind('down_sort', self.re_arrange_respuestas);
                respuesta_view.bind('change_model', self.render_respuestas);
                respuesta_view.bind('edit', self.edit_respuesta);
                self.respuestas_view.push(respuesta_view);
                self.respuestas.add(respuesta);
            }

            this.reset_edicion_respuesta();
        },

        reset_clase_tipo_pregunta: function() {
            this.respuestas_view.length = 0;
            this.respuestas.reset();
            $('#actividad_edit_respuestas').html('');
        },

        reset_edicion_respuesta: function() {
            $('#actividad_respuesta_texto').attr('value', '');
            $('#actividad_respuesta_valor').attr('value', '');
            $('#actividad_respuesta_correcta').removeAttr('checked');
            $('#button_actividad_pregunta_agregar').css('display', 'inline');
            $('#button_actividad_pregunta_guardar').css('display', 'none');
            $('#button_actividad_pregunta_cancelar').css('display', 'none');
        },

        validar_respuesta: function(respuesta) {
            if(respuesta.get('texto') == '') {
                Message.show_error('Falta texto de respuesta');
                return false;
            }
            return true;
        },

        re_arrange_respuestas: function(respuesta, up) {
            var current_index = respuesta.get('orden') ,
                next_index = up ? respuesta.get('orden') -1 : respuesta.get('orden') + 1;

            var respuesta_view = _.find(this.respuestas_view, function(view) {
                return (view.model.get('orden') == next_index);
            });
            if(respuesta_view) {
                respuesta_view.model.set({
                    last: (current_index + 1 == this.respuestas.length),
                    orden: current_index 
                });
                respuesta.set({
                    last: (next_index + 1 == this.respuestas.length),
                    orden: next_index
                });
            }
            this.render_respuestas();
        },

        render_respuestas: function() {
            var model = this.model,
                self = this;

            $('#actividad_edit_respuestas').html('');
            var respuestas_models = _.sortBy(this.respuestas_view, function(view) {
               return view.model.get('orden'); 
            });
            _.each(respuestas_models, function(respuesta) {
                $('#actividad_edit_respuestas').append(respuesta.render().el);
                respuesta.delegateEvents();
            });
        },

        establecer_texto: function() {
            this.model.set({
                texto: JSON.stringify($('#actividad_contenido_texto').getCode())
            });
        },

        traer_recursos: function(tipo) {
            var self = this;
            this.recursos.fetch({
                url: '/admin/resources/list_resources',
	        	data: {
                    codigo_proceso: this.codigo_proceso
                },
                success: function() {
                    self.tipos_resources.reset(self.recursos.context.get('recursos'));
                }
            });
            
        },

        establecer_propiedad: function(e) {
            var map = {};
            var property_id = this.input_property_map[e.target.id];
            var value = e.target.value;
            map[property_id] =  value;
            this.model.set(map);
        },

        input_property_map: {
            actividad_especial_video_resources: 'datapath',
            actividad_especial_flash_resources: 'datapath',
            actividad_clase_contenido: 'clase_contentido',
            actividad_clase_pregunta: 'clase_pregunta',
            actividad_sumario: 'descripcion',
            actividad_pregunta: 'pregunta',
            actividad_clase_tipo: 'tipo'
        }

    });

}).call(this);

