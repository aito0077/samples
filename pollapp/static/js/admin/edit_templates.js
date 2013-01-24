(function(){

    var self = this;

    if (typeof Admin == 'undefined') {
        Admin = self.Admin = {};
    }

    Admin.EditTemplates = Uif.View.extend({
        el: $('#edit_process_templates'),

        events: {
            'click #button_templates_editar':  'edit_template',
            'click #button_templates_visualizar':  'visualizar_template',
            'click #button_templates_cancelar':  'cancelar_edicion_template',
            'click #button_templates_guardar':  'save_template',
            'click #button_templates_generar': 'regenerar_templates',
            'click #template_proceso': 'desplegar',
            'click #template_actividades': 'desplegar',
            'click #template_login': 'desplegar',
            'click #template_finish': 'desplegar',
            'click #template_report': 'desplegar',
            'click #template_home': 'desplegar',
            'click #template_others': 'desplegar',
            'change #template_actividades_seleccion': 'establecer_propiedad'
        },

        initialize: function(options) {
            _.bindAll(this, 'render', 'reset', 'desplegar', 'regenerar_templates', 'analizar_regenerar_templates', 'get_template', 'edit_template', 'visualizar_template', 'cancelar_edicion_template', 'save_template', 'visualizar_modo_edicion', 'establecer_propiedad', 'visualizar_actividad');
            this.model = new Uif.Model;
            this.actividades = new Uif.Collection;
            this.render();
        },

        render: function() {
            this.setup_components();
            this.setup_servicios();
            this.setup_bindings();
        },

        reset: function(options) {
            $('#template_edit_content .body_template').css('display', 'none');
            this.codigo_proceso = options.codigo_proceso;
            this.model.set({
                edit_mode: false,
                view_mode: false,
                is_actividad: false
            });
            this.actividades.reset(options.actividades);
        },

        setup_components: function() {
            $('.bs-docs-sidenav').affix({
                offset: {
                    top: 0
                }
            });
            this.editor = CodeMirror.fromTextArea(document.getElementById('template_code'), {
                mode: 'text/html',
                tabMode: 'indent'
            });
            $('#template_actividades_seleccion').datacombo(this.actividades, {
                codigo: 'codigo',
                descripcion: function(model) {
                    return (model.get('orden')+'-'+model.get('descripcion') || model.get('tipo'));
                },
                required: true
            });
        },

        setup_servicios: function() {
            this.service_generar_templates = new Uif.Model;
            this.service_obtener_templates = new Uif.Model;
            this.service_guardar_template = new Uif.Model;
        },

        setup_bindings: function() {
            this.model.bind('change:edit_mode', this.visualizar_modo_edicion);
            this.model.bind('change:view_mode', this.visualizar_modo_edicion);
            this.model.bind('change:actividad', this.visualizar_actividad);
            this.model.bind('change:current_html', this.set_html);
            this.model.bind('change:is_actividad', this.visualizar_accion_actividades);

        },

        set_html: function(model, html) {
            $('#template_view').text(html); 
            //$('#template_code').html(html); 
            prettyPrint();
        },

        visualizar_actividad: function(model, attribute) {
            if(attribute) {
                this.get_template(attribute);
            }
        },

        regenerar_templates: function() {
            this.service_generar_templates.fetch({
                url: '/admin/templates/regenerar_templates',
                data: {
                    codigo_proceso: this.codigo_proceso
                },
                success: this.analizar_regenerar_templates
            });
        },

        analizar_regenerar_templates: function(response) {

        },

        desplegar: function(e) {
            var template_id = e.target.id;
            $('#template_edit_content .body_template').css('display', 'none');
            $('#edit_process_template li').removeClass('none');
            $('#'+template_id+':parent').addClass('active');
            $('#body_'+template_id).css('display', 'block');
            $('#body_editor').css('display', 'block');
            $('#template_view_container').css('display', 'block');
            this.model.set({
                edit_mode: false,
                view_mode: true,
                is_actividad: false
            });
            switch(template_id) {
                case 'template_proceso':
                    break;
                case 'template_actividades':
                    this.model.set({
                        is_actividad: true
                    });
                    break;
                case 'template_login':
                    this.get_template('login');
                    break;
                case 'template_finish':
                    break;
                case 'template_report':
                    break;
                case 'template_home':
                    break;
                case 'template_others':
                    break;
                default: 
                    $('#body_editor').css('display', 'none');
                    $('#template_view_container').css('display', 'block');
                    $('#template_edit_container').css('display', 'none');
                    break;
            }
        },

        get_template: function(codigo_actividad) {
            var self = this;
            $.ajax({
                url: '/admin/templates/get_template/'+this.codigo_proceso+'/'+codigo_actividad
            }).done(function(response) {
                self.model.set({
                    current_html: response
                }); 
            });
        },

        visualizar_accion_actividades: function(model, is_actividad) {
            $('#template_actividad_label').css('visibility', is_actividad ? 'visible' : 'hidden');
            $('#template_actividades_seleccion').css('visibility', is_actividad ? 'visible' : 'hidden');
        },

        visualizar_modo_edicion: function(model) {
            var edit_mode = model.get('edit_mode'),
                view_mode = model.get('view_mode'),
                is_actividad = model.get('is_actividad');
            $('#button_templates_generar').css('display', view_mode || edit_mode ? 'none': 'block');
            $('#button_templates_editar').css('visibility', view_mode ? 'visible': 'hidden');
            $('#button_templates_visualizar').css('visibility', view_mode || edit_mode ? 'visible': 'hidden');

            $('#template_edit_container').css('display', edit_mode ? 'block' : 'none');
            $('#template_view_container').css('display', view_mode ? 'block' : 'none');
         },

        visualizar_template: function() { 
        },

        edit_template: function() { 
            this.model.set({
                edit_mode: true,
                view_mode: false
            });
            $('#template_view_container').css('display', 'none');
            $('#template_edit_container').css('display', 'block');

            this.editor.setValue(this.model.get('current_html'));
            /*
            $('#template_edit').setCode(this.model.get('current_html'));
            */
        },
         
        save_template: function() {
            //var html = $('#template_edit').getCode();   
            var html = "";
            this.model.set({
                edit_mode: false,
                view_mode: true,
                current_html: html
            });

            /*
            this.service_guardar_template.fetch({
                url: '/admin/templates/guardar_template',
                data: {
                    codigo_proceso: this.codigo_proceso
                    codigo_actividad: 
                    template: 
                    url: '/admin/templates/get_template/'+this.codigo_proceso+'/'+codigo_actividad,
                },
                success: this.analizar_regenerar_templates
            });
            */


        },

        cancelar_edicion_template: function() {
            //var html = $('#template_edit').getCode();   
            var html = "";
            this.model.set({
                edit_mode: false,
                view_mode: true,
                current_html: html
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
            template_actividades_seleccion: 'actividad'
        }


    });




}).call(this);


