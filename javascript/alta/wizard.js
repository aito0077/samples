(function(){

    var self = this, Wizard;

    if (typeof exports !== 'undefined') {
        Wizard = exports;
    } else {
        Wizard = self.Wizard = {};
    }

    Wizard.Manager = Uif.View.extend({
        el: $('#div_wizard_manager'),

        current_module: null,

        events: {
            'click #button_wizard_volver': 'do_back',
            'click #button_wizard_continuar': 'do_next',
            'click #button_wizard_cancelar': 'do_cancel'
        },

        viewers: [
            {
                order: 1,
                code: 'IDENTIFICACION', 
                title: 'Solicitante',
                summary_title: 'Solicitante',
                has_back: false
            },
            {
                order: 2,
                code: 'REQUISITOS', 
                title: 'Requisitos',
                summary_title: 'Requisitos'
            },
            {
                order: 3,
                code: 'MARGEN', 
                title: 'Margen',
                summary_title: 'Margen'
            },
            {
                order: 4,
                code: 'DOCUMENTACION', 
                title: 'Documentacion',
                summary_title: 'Documentacion'
            },
            {
                order: 5,
                code: 'NOSIS', 
                title: 'Nosis',
                summary_title: 'Nosis'
            },
            {
                order: 6,
                code: 'PLANES', 
                title: 'Planes',
                summary_title: 'Planes'
            },
            {
                order: 7,
                code: 'ASOCIADO', 
                title: 'Datos Asociado'
            },
            {
                order: 8,
                code: 'IMPRESION', 
                title: 'Impresion',
                has_back: false,
                has_continue: false,
                has_finish: true
            }
        ],

        initialize: function() {
            _.bindAll(this, 'render', 'do_next', 'do_back', 'do_cancel', 'module_selection');
            var self = this;
            this.process_context = new Uif.Model;
            /*
            _.each(this.viewers, function(view_options) {
                view_options.view = self.factory(view_options, self.process_context);
            });
            */
            this.navigator = new Wizard.Navigator({steps: this.viewers});
            this.navigator.bind('module_selected', this.module_selection);
            this.summary = new Wizard.Summary({steps: this.viewers});
            
            this.bind_close_event(function(event) {
                alert('close');
            });

            this.unbind_close_event();

            this.render();

            this.navigator.select_by_index(0);
        },

        render: function() {
            this.navigator.render();
            this.load_buttons();
        },

        module_selection: function(selected_module) {
            var module = _.find(this.viewers, function(step) {
                return step.code == selected_module.code;
            });
            if(typeof(module.view) == 'undefined') {
                module.view = this.factory(module, this.process_context);
            }

            this.current_module = module;
        },

        do_next: function() {
            var validation_context = {};
            if(this.current_module.view.validate(validation_context)) {
                this.summary.set_summary_text(this.current_module.code, this.current_module.view.get_summary());
                this.process_context.set(this.current_module.view.model.toJSON());
                this.navigator.next();
            } 
            if(validation_context.error) {
                Message.show_warning(validation_context.error);
            }
        },

        do_back: function() {
            this.navigator.back();
        },

        do_finish: function() {
        },

        do_cancel: function() {

        },

        abrir_busqueda_asociado: function(controlador_solicitante, callback) {
            /*
            if(typeof(this.componente_busqueda_asociado) == 'undefined') {
                this.componente_busqueda_asociado = new BusquedaAsociados({
                    el: $('#div_busqueda_asociado'),
                    p_delegacion: this.contexto_session.codDelegacion
                });
                this.componente_busqueda_asociado.bind('selected', seleccion_asociado, this);
                this.componente_busqueda_asociado.bind('cerrar', function() {
                    $('#div_busqueda_asociado').dialog('close');					  						
                });
            } 
            this.componente_busqueda_asociado.reset();
            $('#div_busqueda_asociado').dialog('open');
            */
        },

        factory: function(options, process_context) {
            options.el = $('#'+options.code);
            options.process_context = process_context;
            switch(options.code) {  
                case 'IDENTIFICACION':
                    return new Ayudas.Alta.IdentificarSolicitante(options);
                case 'REQUISITOS':
                    return new Ayudas.Alta.RequisitosSolicitante(options);
                case 'MARGEN':
                    return new Ayudas.Alta.ConsultaMargen(options);
                case 'DOCUMENTACION':
                    return new Ayudas.Alta.ControlDocumentacion(options);
                case 'NOSIS':
                    return new Ayudas.Alta.InformacionNosis(options);
                case 'PLANES':
                    return new Ayudas.Alta.PlanesFormaPago(options);
                default:
                    return new Wizard.Viewer(options);
            }
    
                /*
                case 'PLANES':
                    return new Ayudas.Alta.PlanesFormaPago(options);
                case 'ASOCIADO':
                    return new Ayudas.Alta.DatosAsociado(options);
                case 'IMPRESION':
                    return new Ayudas.Alta.Impresion(options);
                */
        },

        buttons: [
            { id: 'wizard_volver', icono: 'arrowthick-1-w', label: 'Volver'},
            { id: 'wizard_continuar', icono: 'arrowthick-1-e', label: 'Continuar'},
            { id: 'wizard_cancelar', icono: 'close', label: 'Cancelar'}				
        ]

    });

    Wizard.Viewer = Uif.View.extend({
        order: 0,
        title: null,
        code: null,
        has_continue: true,
        has_back: true,
        has_finish: false,
        has_cancel: true,

        model: null,

        inited: false,

        initialize: function() {
            this.process_context = this.options.process_context;
            this.title = this.options.title;
            this.order = this.options.order;
            this.code = this.options.code;
            this.model = new Uif.Model;

            this.init(this.options);
            this.render();
            this.inited = true;
        },

        render: function() {},

        init: function(options) {},

        start: function(context) {},

        finish: function(context) {},

        reset: function(model) {},

        validate: function() {},

        get_summary: function() {

        },
        
        establecer_propiedad: function(e) {
            var map = {};
            map[this.input_property_map[e.target.id]] = e.target.value;
            this.model.set(map);
        }

    });

    Wizard.Summary = Uif.View.extend({
        el: $('#div_summary'),

        template_box: _.template('<div id="summary_<%=code%>" style="display:none" class="ui-widget ui-widget-content ui-corner-all" style="width: 180px; height: 130px; padding: 20px;"><div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all"><span class="ui-datepicker-month"><%=summary_title%></span></div><div id="<%=code%>_summary_text"></div></div>'), 

        initialize: function() {
            _.bindAll(this, 'render', 'hide', 'show', 'set_summary_text');
            this.steps = this.options.steps;
            this.render();
        },

        render: function() {
            var self = this;
            _.each(_.filter(this.steps, function(step) {return (step.summary_title);}), function(step) {
                $('#div_summary').append(self.template_box({code: step.code, summary_title: step.summary_title}));
            });
        },

        hide: function(code) {
            $('#summary_'+code).css('display', 'none');
        },

        show: function(code) {
            $('#summary_'+code).css('display', 'block');
        },

        set_summary_text: function(code, fields) {
            var summary_html = 
                '<div id="project-issue-summary-table" class="summary">'+
                '    <table>'+
                '        <tbody>'+
                '<% _.each(fields, function(field) { if(field.value) {%> <tr>'+
                '   <%if(field.label) {%><td><%=field.label%>:</td><td><span><%=field.value%></span></td><%} else {%>'+
                '   <td colspan="2"><span><%=field.value%></span></td><%}%>'+
                '       </tr><%} }); %>'+
                '        </tbody>'+
                '    </table>'+
                '</div>';
            $('#'+code+'_summary_text').html( _.template(summary_html, {fields: fields}) );
            this.show(code);
        }

    });

    Wizard.Navigator = Uif.View.extend({
        el: $('#ul_navigator'), 
        template: _.template('<li><a href="#<%=code%>"><%=title%></a></li>'),
        current_index: 0,
        events: {
        },
        initialize: function() {
            _.bindAll(this, 'do_tab_selected', 'validate_selected_tab', 'next', 'back', 'select_by_index', 'valid_tab');
            this.steps = this.options.steps;
        },

        render: function() {
            var self = this;
            $(self.el).html('');
            _.each(this.steps, function(step) { 
                $(self.el).append(self.template(step));
            });
            $('#navigator').tabs({select: self.validate_selected_tab});
            $('#navigator').bind('tabsselect', this.do_tab_selected);
            $('#navigator').tabs('disable');
            $('#navigator').tabs('enable', 0);
            $('#navigator').tabs('select', 0);
        },

        do_tab_selected: function(event, ui) {
            this.select_by_index(ui.index);
        }, 

        next: function() {
            var next_index = (this.current_index + 1);
            this.current_index = next_index;
            $('#navigator').tabs('enable', next_index);
            $('#navigator').tabs('select', next_index);
        },

        back: function() {
            $('#navigator').tabs('disable', this.current_index);
            $('#navigator').tabs('select',(this.current_index - 1));
        },

        select_by_index: function(index) {
            var current_step = _.find(this.steps, function(step) {
                return step.order === (index + 1);
            });
            this.trigger('module_selected', current_step);
        },

        validate_selected_tab: function(event, ui) {
            return this.valid_tab(ui.index);
        },

        valid_tab: function(index) {
            var is_valid = (this.current_index >= index);
            if(is_valid) {
                this.current_index = index;
            }
            return is_valid;
        }

    });



}).call(this);

