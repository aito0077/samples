(function(){

    var self = this;

    if (typeof Admin == 'undefined') {
        Admin = self.Admin = {};
    }

    Admin.EditProcess = Uif.View.extend({

        template_actividad: _.template($('#item-actividad-template').html()),
        solapas: {
            'solapa_proceso': {
                id: 'proceso',
                first: true,
                next: 'solapa_actividad'
             },    
            'solapa_actividad': {
                id: 'actividad',
                back: 'solapa_proceso',
                next: 'solapa_recursos'
             },    
            'solapa_recursos': {
                id: 'recursos',
                back: 'solapa_actividad',
                next: 'solapa_usuarios'
             },    
             'solapa_usuarios': {
                id: 'usuarios',
                back: 'solapa_recursos',
                //next: 'solapa_templates'
                last: true
             }
             /*
             'solapa_templates': {
                id: 'templates',
                back: 'solapa_usuarios',
                last: true 
             }    
             */
 
        },

        events: {
            'click #button_agregar_actividad': 'agregar_actividad',
            'click #button_siguiente': 'change_solapa',
            'click #button_atras': 'change_solapa',
            'click #button_demo': 'open_demo',
            'click #button_login_process': 'login_process',


            'change #proceso_tema': 'establecer_propiedad',
            'change #proceso_codigo': 'establecer_propiedad',
            'change #proceso_sumario': 'establecer_propiedad',
            'change #proceso_tipo': 'establecer_propiedad',
            'changeDate #proceso_fecha_inicio': 'establecer_propiedad',
            'changeDate #proceso_fecha_fin': 'establecer_propiedad'

        },

        initialize: function(options) {
            _.bindAll(this, 'render', 'agregar_actividad', 'visualizar_actividades', 'setup_bindings', 'guardar_proceso', 'validate_solapa_proceso', 'establecer_propiedad', 'analizar_alta_proceso', 'procesar_guardar_actividad', 'solapa_swap', 'change_solapa', 'validate_solapa_actividades', 'validate_solapa_recursos', 'validate_solapa_usuarios', 'validate_solapa_templates', 'traer_informacion_proceso', 'reset', 'procesar_informacion_proceso', 'swap_edition_state', 'procesar_alta_actividad', 'setup_components', 'reorder_activities', 'refresh_activities', 'procesar_update_actividad', 'eliminar_actividad', 'delete_activity', 'procesar_baja_actividad', 'modificar_actividad', 'instantiate_editor_actividad', 'instanciar_gestion_recursos', 'instanciar_gestion_participantes', 'instanciar_gestion_templates', 'open_demo', 'login_process', 'get_activities', 'process_activities', 'delete_views', 'process_bases', 'establecer_bases');
            this.model = new Uif.Model;
            this.bases = new Uif.Model;
            this.actividades = new Uif.Collection;
            this.actividades_service = new Uif.Model;
            this.actividades_views = new Array();
            this.actividades_sorted = [];
            this.tipos_proceso = new Uif.Collection;
            this.temas = new Uif.Collection;
            this.setup_servicios();
            this.setup_bindings();
            this.setup_components();
            this.render();
        },

        render: function() {
            this.current_solapa = this.solapas['solapa_proceso'];
            $('#button_atras').css('visibility', this.current_solapa.first ? 'hidden' : 'visible');
            $('#button_siguiente').css('visibility', this.current_solapa.last? 'hidden' : 'visible');
        },

        reset: function(options) {
            if(typeof options != 'undefined') {
                if(options.codigo) {
                    this.traer_informacion_proceso(options.codigo);
                }
            } else {
                this.model.set({
                    process_persisted: false
                });
            }
        },

        setup_components: function() {
            var self = this;

            this.tipos_proceso.reset([
                {codigo: 'concurso', descripcion: 'Concurso'},
                {codigo: 'evaluacion', descripcion: 'Evaluacion'},
                {codigo: 'encuesta', descripcion: 'Encuesta'},
                {codigo: 'contenido', descripcion: 'Presentacion'}
            ]);

            this.temas_service.fetch({
                url: '/admin/resources/list_themes',
                data: {},
                success: function() {
                    self.temas.reset( self.temas_service.context.get('temas'));
                    $('#proceso_tema').datacombo(self.temas, {
                        codigo: 'tema',
                        descripcion: 'descripcion',
                        required: true
                    });


                }

            });

            /*
            $('#proceso_tipo').datacombo(this.tipos_proceso, {
                codigo: 'codigo',
                descripcion: 'descripcion'
            });
            */

            $('#bases_texto').redactor({
                lang: 'es',
                plugins: ['fullscreen', 'clips'],
                imageUpload: '/admin/resources/upload_image_redactor/'+this.codigo_proceso
            });

            $(".collapse").collapse({
                toggle: false   
            });
            $('.datepicker').datepicker();
            $('#dialog_editar_actividad').modal({
                show: false
            });

            $('a[data-toggle="tab"]').on('shown', this.solapa_swap);
            $('#cuestionario').sortable({ 
                opacity: 0.6, 
                cursor: 'move', 
                items: '.accordion-group',
                update: function(e, ui) {
                    self.reorder_activities();
                    //self.actividades_sorted = $(this).sortable('toArray');
                }
            });

            $('#cuestionario').disableSelection();
        },

        login_process: function() {
            var self = this;
            bootbox.confirm("Esta accion cerrara el administrador y abrirá el proceso. Desea continuar?", function(confirmed) {
                if(confirmed) {
                    window.open('/admin/login/logout/'+self.model.get('codigo'));
                    window.location = '/admin/login';
                }
            });

        },

        open_demo: function() {
            window.open('/p/'+this.model.get('codigo'));
        },

        reorder_activities: function() {
            var new_order = $('#cuestionario').sortable('toArray');
            this.procesar_actividades(_.reject(new_order, function(eleme){ return eleme === ''; }));
        },

        setup_servicios: function() {
            this.servicio_guardar_proceso = new Uif.Model;
            this.proceso = new Uif.Model;
            this.actividad_service = new Uif.Model;
            this.temas_service = new Uif.Model;
        },

        setup_bindings: function() {
            //this.actividades.bind('all', this.visualizar_actividades);
            this.actividades.bind('add', this.visualizar_actividades);
            this.actividades.bind('remove', this.visualizar_actividades);
            this.actividades.bind('reset', this.visualizar_actividades);
            this.model.bind('change:process_persisted', this.swap_edition_state);
            this.model.bind('change:codigo', function(model, attribute) {if(attribute){
                $('#url_process_code').html(attribute);
            } });
            this.model.bind('change:bases', this.establecer_bases);
            this.binds_for_model(this.model_binding, this.model);
        },

        model_binding: [
            { ui: 'proceso_tema', property: 'theme'},
            { ui: 'proceso_codigo', property: 'codigo'},
            { ui: 'proceso_sumario', property: 'sumario'},
            { ui: 'proceso_tipo', property: 'tipo'},
            { ui: 'proceso_fecha_inicio', property: 'fecha_inicio'},
            { ui: 'proceso_fecha_fin', property: 'fecha_fin'}
        ],

        swap_edition_state: function(model, attribute) {
            console.log("process_persisted: "+attribute);
            if(attribute) {
                $('#proceso_codigo').attr('disabled', attribute);
                $('#button_demo').css('visibility', 'visible');
                $('#button_login_process').css('visibility', 'visible');
                $('#url_label').css('visibility', 'visible');
            } else {
                $('#proceso_codigo').removeAttr('disabled');
                $('#button_demo').css('visibility', 'hidden');
                $('#button_login_process').css('visibility', 'hidden');
                $('#url_label').css('visibility', 'hidden');
            }
        },

        change_solapa: function(e) {
            if(e.target.id == 'button_siguiente') {
                if(!this.current_solapa.last) {
                    if(this.validate_solapa(this.current_solapa.id)) {
                        $('#'+this.current_solapa.next).tab('show');
                    }
                }
            } else {
                if(!this.current_solapa.first) {
                    $('#'+this.current_solapa.back).tab('show');
                }
            }
        },

        solapa_swap: function(e) {
            var current = e.target.id,
                last = e.relatedTarget.id;
                
            switch(current) {
                case 'solapa_actividad':
                    this.actividades.reset(this.model.get('activities'));
                    break;
                case 'solapa_recursos':
                    this.instanciar_gestion_recursos();
                    break;
                case 'solapa_usuarios':
                    this.instanciar_gestion_participantes();
                    break;
                case 'solapa_templates':
                    this.instanciar_gestion_templates();
                    break;

                default:
                    break;
            }
            switch(last) {
                case 'solapa_proceso':
                    this.guardar_proceso();
                    break;
                case 'solapa_actividad':
                    this.model.set({
                        activities: this.actividades.toJSON()
                    });
                    this.procesar_actividades();
                    break;
                case 'solapa_recursos':
                    break;
                case 'solapa_usuarios':

                    break;
                case 'solapa_templates':

                    break;
                default:
                    break;
            }

            this.current_solapa = this.solapas[e.target.id];
            
            $('#button_atras').css('visibility', this.current_solapa.first ? 'hidden' : 'visible');
            $('#button_siguiente').css('visibility', this.current_solapa.last? 'hidden' : 'visible');
        },

        instanciar_gestion_recursos: function() {
            if(typeof(Admin.gestion_recursos) == 'undefined') {
                Admin.gestion_recursos = new Admin.EditResources({
                    el: $('#gestor_recursos')
                });
            }
            Admin.gestion_recursos.reset({
                codigo_proceso: this.model.get('codigo')
            });
        },

        instanciar_gestion_participantes: function() {
            if(typeof(Admin.gestion_participantes) == 'undefined') {
                Admin.gestion_participantes = new Admin.EditProcessParticipants({
                    el: $('#edit_process_participants')
                });
            }
            Admin.gestion_participantes.reset({
                codigo_proceso: this.model.get('codigo'),
                batch_id: this.model.get('batch_id')
            });
        },

        instanciar_gestion_templates: function() {
            if(typeof(Admin.gestion_templates) == 'undefined') {
                Admin.gestion_templates = new Admin.EditTemplates({
                    el: $('#edit_process_templates')
                });
            }
            Admin.gestion_templates.reset({
                codigo_proceso: this.model.get('codigo'),
                actividades: this.actividades.toJSON()
            });
        },

        agregar_actividad: function() {
            var index = this.actividades.length;
            this.instantiate_editor_actividad();

            $('#dialog_editar_actividad').modal({
                show: true    
            });
            Admin.editor_actividad.reset({
                codigo_proceso: this.model.get('codigo'),
                codigo_actividad: this.model.get('codigo')+'_'+index
            });
        },

        instantiate_editor_actividad:  function() {
            if(typeof(Admin.editor_actividad) == 'undefined') {
                Admin.editor_actividad = new Admin.EditStep({
                    el: $('#dialog_editar_actividad'),
                    codigo_proceso: this.model.get('codigo')
                });
                Admin.editor_actividad.bind('guardar_actividad', this.procesar_guardar_actividad);
                Admin.editor_actividad.bind('cancelar_actividad', this.cancelar_actividad);
            }
        },

        modificar_actividad: function(activity_code) {
            var index = this.actividades.length;
            this.instantiate_editor_actividad();

            var activity = _.find(this.actividades.models, function(model) {
                return model.get('codigo') == activity_code;
            });
            if(activity) {
                $('#dialog_editar_actividad').modal({
                    show: true    
                });
                Admin.editor_actividad.reset({
                    codigo_proceso: this.model.get('codigo'),
                    activity: activity
                });

            }
        },

        eliminar_actividad: function(activity_code) {
            console.log('Eliminar actividad: '+activity_code+' del proceso: '+this.model.get('codigo'));
            var self = this;
            bootbox.confirm("Desea eliminar la actividad seleccionada?", function(confirmed) {
                if(confirmed) {
                    self.delete_activity(activity_code);
                }
            });
        },


        get_activities: function() {
            var self = this;
            this.actividades_service.fetch({
                url: '/admin/process/get_activities',
	        	data: {
                    process_code: this.model.get('codigo')
                },
                success: self.process_activities
            });
        },

        process_activities: function(service) {
            var self = this;
            self.actividades.reset();
            console.dir(service.context);
            _.each(service.context.attributes, function(model) {
                if(model) {
                    self.actividades.add(model);    
                }
            });
        },

        delete_activity: function(activity_code) {
            var self = this;
            this.actividad_service.fetch({
                url: '/admin/process/remove_activity',
	        	data: {
                    process_code: this.model.get('codigo'),
                    activity_code: activity_code   
                },
                success: function() {
                    self.procesar_baja_actividad(activity_code);
                }
            });


        },

        cerrar_dialogo_actividad: function() {
            $('#dialog_editar_actividad').modal('hide');
        },

        procesar_guardar_actividad: function(actividad) {
            var index = this.actividades.length+1,
                activity_map = {},
                self = this,
                orden = actividad.get('modify') ? actividad.get('orden') : index;
            activity_map = {
                codigo_proceso: this.model.get('codigo'),
                codigo: actividad.get('codigo'),
                orden: orden,
                descripcion: actividad.get('descripcion'),
                pregunta: actividad.get('pregunta'),
                clase: actividad.get('clase'),
                tipo: actividad.get('tipo'),
                texto: actividad.get('texto'),
                datapath: encodeURI(actividad.get('datapath')),
                respuestas: JSON.stringify(actividad.get('respuestas'))
            };
            if(actividad.get('modify')) {
                this.actividad_service.fetch({
                    url: '/admin/process/update_activity',
                    data: activity_map,
                    success: self.procesar_update_actividad
                });
            } else {
                this.actividad_service.fetch({
                    url: '/admin/process/add_activity',
                    data: activity_map,
                    success: this.procesar_alta_actividad
                });
            }

            this.cerrar_dialogo_actividad();
         },
            
         procesar_baja_actividad: function(activity_code) {
            var activity = _.find(this.actividades.models, function(model) {
                return model.get('codigo') == activity_code;
            });
            if(activity) {
                this.actividades.remove(activity);
            }
            this.reorder_activities();
         },

         procesar_alta_actividad: function(model, response) {
            var actividad_nueva = new Uif.Model;
            actividad_nueva.set(this.actividad_service.context.toJSON());
            if(actividad_nueva.get('tipo') != 'BASES') {
                this.actividades.add(actividad_nueva.toJSON());
            }
        },

        procesar_update_actividad: function(model, response) {
            console.log(this.actividad_service.context.toJSON());
            this.get_activities();
        },


        delete_views: function() {
            _.each(this.actividades_views, function(view) {
                if(view) {
                    view.remove();
                }
            });
        },

        visualizar_actividades: function() {
            console.log('visualizar actividades');
            var self = this;
            this.delete_views();
            $('#cuestionario').html('');
            var sorted_activities = _.sortBy(this.actividades.models, function(model) {
                return model.get('orden');
            });
            console.dir(sorted_activities);
            _.each(sorted_activities , function(actividad) {

                var actividad_view = new Admin.ActividadItemView({
                    model: actividad
                });

                actividad_view.bind('delete_activity', self.eliminar_actividad);
                actividad_view.bind('edit_activity', self.modificar_actividad);
                
                self.actividades_views.push(actividad_view);

                $('#cuestionario').append(actividad_view.render().el);
                actividad_view.render_respuestas();

                actividad_view.delegateEvents();
            });
        },
        
        refresh_activities: function() {
            console.log('refresh activities');
            var self = this;
            $('#cuestionario').html('');

            this.actividades_views = _.sortBy(this.actividades_views, function(view) {
               return view.model.get('orden'); 
            });

            _.each(this.actividades_views, function(view) {
                if(view) {
                    $('#cuestionario').append(view.render().el);
                    view.render_respuestas();
                    view.delegateEvents();
                }
            });

        },

        traer_informacion_proceso: function(codigo_proceso) {
            this.proceso.fetch({
                url: '/admin/process/traer_proceso',
	        	data: {
                    codigo: codigo_proceso
                },
                success: this.procesar_informacion_proceso
            });
        },

        procesar_informacion_proceso: function(model, response) {
            this.model.set(_.extend({
                process_persisted: true
            }, response.proceso));
            //this.actividades.reset(this.model.get('activities'));
        },
        
        guardar_proceso: function() {
            if(this.validate_solapa_proceso()) {
                $('#button_siguiente').button('loading');
                if(!this.model.get('process_persisted')) {
                    this.servicio_guardar_proceso.fetch({
                        url: '/admin/process/insert_proceso',
                        data: {
                            codigo: this.model.get('codigo'),   
                            sumario: this.model.get('sumario'),
                            theme: this.model.get('theme'),   
                            tipo: this.model.get('tipo'),   
                            fecha_inicio: this.model.get('fecha_inicio'),   
                            fecha_fin: this.model.get('fecha_fin'),   
                            estado: 'INACTIVO',
                            bases: this.bases.toJSON()
                        },
                        success: this.analizar_alta_proceso
                    });
                } else {
                    this.servicio_guardar_proceso.fetch({
                        url: '/admin/process/update_proceso',
                        data: {
                            codigo: this.model.get('codigo'),   
                            sumario: this.model.get('sumario'),   
                            tipo: this.model.get('tipo'),   
                            fecha_inicio: this.model.get('fecha_inicio'),   
                            fecha_fin: this.model.get('fecha_fin'),   
                            estado: 'INACTIVO',
                            bases: this.bases.toJSON()
                        },
                        success: this.analizar_alta_proceso
                    });

                }
            }
        },

        procesar_actividades: function(new_order) {
            var actividades = new_order || this.actividades_sorted,
                actividades_originales = this.actividades,
                activities_new_order = new Array(),
                index = 1;

            if(actividades && actividades.length > 0) {

                for(index = 1; index <= actividades.length; index++) {
                    var actividad = _.find(actividades_originales.models, function(model) {
                        return ('q_'+model.get('codigo')) == actividades[index];
                    });
                    if(actividad) {
                        var orden = actividad.get('orden');
                        if(orden != index) {
                           actividad.set({
                                orden: index,
                                previous_orden: orden,
                                modified: true  
                           }); 
                           console.log('update activity '+actividad.get('codigo')+' orden: '+actividad.get('orden'));
                           activities_new_order.push({
                               codigo: actividad.get('codigo'),
                                order: actividad.get('orden')
                           });
                        }
                    }
                }
            }

            if(activities_new_order.length) {
                this.actividad_service.fetch({
                    url: '/admin/process/reorder_activities',
                    data: {
                        codigo_proceso: this.model.get('codigo'),
                        activities_order: JSON.stringify(activities_new_order)
                    },
                    success: this.procesar_update_actividad
                });
 
            }
            /*
            _.each(actividades_originales.models, function(model) {
                if(model.get('modified')) {
                    this.actividad_service.fetch({
                        url: '/admin/process/update_activity',
                        data: activity_map,
                        success: this.procesar_update_actividad
                    });
                }
            });
            */
        },

        analizar_alta_proceso: function(response) {
            this.model.set({
              process_persisted: true  
            });
            $('#button_siguiente').button('reset');
        },

        validate_solapa: function(solapa_id) {
            switch(solapa_id) {
                case 'proceso':
                    return this.validate_solapa_proceso();
                case 'actividad':
                    return this.validate_solapa_actividades();
                case 'recursos':
                    return this.validate_solapa_recursos();
                case 'usuarios':
                    return this.validate_solapa_usuarios();
                case 'templates':
                    return this.validate_solapa_templates();
                default:
                    return true;
            }
        },

        validate_solapa_proceso: function() {
            if(!this.model.get('codigo')) {
                Message.show_error('Falta código');
                return false;
            }
            if(!this.model.get('sumario')) {
                Message.show_error('Falta sumario');
                return false;
            }

            if(!this.model.get('tipo')) {
                this.model.set({
                    tipo: $('#proceso_tipo').attr('value')
                });
            }
            if(!this.model.get('theme')) {
                this.model.set({
                    theme: $('#proceso_tema').attr('value')
                });
            }
            this.process_bases();
            return true;
        },

        process_bases: function() {
            var descripcion = $('#bases_sumario').attr('value'),
                texto = JSON.stringify($('#bases_texto').getCode());
            this.bases.set({
                descripcion: descripcion,
                texto: texto
            });
        },

        establecer_bases: function(model, attribute) {
            if(attribute) {
                $('#bases_sumario').attr('value', attribute.descripcion);
                $('#bases_texto').setCode(attribute.texto);
            }
        },

        validate_solapa_actividades: function() {
            //validar cantidad de actividades
            return true;
        },

        validate_solapa_recursos: function() {
            //que los recursos cargados sean consistentes
            return true;
        },

        validate_solapa_usuarios: function() {
            return true;
        },

        validate_solapa_templates: function() {
            return true;
        },


        establecer_propiedad: function(e) {
            var map = {};
            var property_id = this.input_property_map[e.target.id];
            var value = e.target.value;
            if(property_id == 'codigo') {
                value = value.toUpperCase();
            }
            map[property_id] =  value;
            this.model.set(map);
        },

        input_property_map: {
            proceso_tema: 'theme',
            proceso_codigo: 'codigo',
            proceso_sumario: 'sumario',
            proceso_tipo: 'tipo',
            proceso_fecha_inicio: 'fecha_inicio',
            proceso_fecha_fin: 'fecha_fin'
        }

    });


    Admin.ActividadItemView = Uif.View.extend({
        tagName: 'div',
        template_actividad: _.template($('#item-actividad-template').html()),

        events: {
            'click .btn-trash': 'eliminar_actividad',
            'click .btn-edit': 'modificar_actividad'
        },
 
        initialize: function() {
            _.bindAll(this, 'render', 'render_respuestas', 'setup_respuestas', 're_arrange_respuestas', 'eliminar_actividad', 'modificar_actividad');
        
            this.respuestas = new Array();
            this.setup_respuestas();
        },

        setup_respuestas: function() {
            var model = this.model,
                self = this;

            if(model.has('respuestas')) {
                var respuestas_models = new Uif.Collection(model.get('respuestas')); 

                _.each(respuestas_models.models, function(respuesta) {
                    respuesta.set({
                        last: respuesta.get('orden') + 1 == self.respuestas.length
                    });
                    var respuesta_view = new Admin.RespuestaItemView({
                        model: respuesta
                    });
                    respuesta_view.bind('up_sort', self.re_arrange_respuestas);
                    respuesta_view.bind('down_sort', self.re_arrange_respuestas);
                    respuesta_view.bind('change_model', self.render_respuestas);
                    self.respuestas.push(respuesta_view);
                });
            }
        },

        re_arrange_respuestas: function(respuesta, up) {
            var current_index = respuesta.get('orden') ,
                next_index = up ? respuesta.get('orden') -1 : respuesta.get('orden') + 1;


            var respuesta_view = _.find(this.respuestas, function(view) {
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

        render: function() {
            this.undelegateEvents();
        //    console.log('Orden: '+this.model.get('orden'));
        //    return this.template_actividad(_.extend({has_respuestas: this.respuestas.length}, this.model.toJSON()));
            this.$el.html(this.template_actividad(_.extend({has_respuestas: this.respuestas.length}, this.model.toJSON())));
            return this;
        },

        render_respuestas: function() {
            var model = this.model,
                self = this;

            $('#respuestas_'+model.get('codigo')).html('');
            var respuestas_models = _.sortBy(this.respuestas, function(view) {
               return view.model.get('orden'); 
            });
            _.each(respuestas_models, function(respuesta) {
                $('#respuestas_'+model.get('codigo')).append(respuesta.render().el);
            });
        },

        eliminar_actividad: function() {
            console.log('Eliminar actividad: '+this.model.get('codigo'));
            this.trigger('delete_activity', this.model.get('codigo'));
        },

        modificar_actividad: function() {
            console.log('Modificar actividad: '+this.model.get('codigo'));
            this.trigger('edit_activity', this.model.get('codigo'));
        }

    });

    Admin.RespuestaItemView = Uif.View.extend({
        tagName: 'div',
        template_respuesta: _.template($('#item-respuesta-template').html()),
        template_respuesta_edicion: _.template($('#item-edit-respuesta-template').html()),


        events: {
            'click .icon-arrow-up': 'do_up',
            'click .icon-arrow-down': 'do_down',
            'click .icon-remove-sign': 'do_remove',
            'click .icon-pencil': 'do_edit',
            'click .icon-repeat': 'do_undo'
        },

        initialize: function() {
            _.bindAll(this, 'render', 'do_up', 'do_down', 'do_remove', 'do_edit', 'do_undo', 'fire_change');
            this.edit_mode = this.options.edit_mode ? true : false;
            this.setup_bindings();
        },

        setup_bindings: function() {
            this.model.on('change:removed', this.fire_change);
            this.model.on('change', this.render);
        },

        render: function() {
            if(this.edit_mode) {
                this.$el.html(this.template_respuesta_edicion(this.model.toJSON()));
            } else {
                this.$el.html(this.template_respuesta(this.model.toJSON()));
            }
            return this;
        },

        do_up: function() {
            this.trigger('up_sort', this.model, true);
        },

        do_down: function() {
            this.trigger('down_sort', this.model, false);
        },

        do_remove: function() {
            this.model.set({
                removed: true
            });
        },

        do_undo: function() {
            this.model.unset('removed');
        },

        do_edit: function() {
            this.trigger('edit', this.model);
        },

        fire_change: function() {
            this.trigger('change_model', this.model);
        }
    });

}).call(this);

