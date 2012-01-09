(function(){
    var Ayudas;
    if (typeof exports !== 'undefined') {
        Ayudas = exports;
    } else {
        Ayudas = this.Ayudas = {};
        Ayudas.Alta = this.Ayudas.Alta = {};
    }

    Ayudas.Alta.IdentificarSolicitante = Wizard.Viewer.extend({
        current_entidad: null,

        events: {
            'keypress #identifica_cuil': 'ingreso_cuil',
            'change #identifica_select_entidad': 'seleccion_entidad',
            'change #identifica_select_sub_entidad': 'seleccion_subentidad',
            'change #identifica_select_categoria': 'seleccion_categoria',
            'change #identifica_select_mutual': 'seleccion_mutual',
            'change #identifica_select_legajos': 'seleccion_legajo',

            'change #identifica_legajo': 'establecer_legajo',

            'change #identifica_fecha_nacimiento': 'establecer_propiedad',
            'change #identifica_sexo': 'establecer_propiedad',
            'change #identifica_fecha_vencimiento': 'establecer_propiedad',
            'change #identifica_codigo_seguridad': 'establecer_propiedad',
            'change #identifica_cargo': 'establecer_propiedad',
            'change #identifica_fecha_ingreso': 'establecer_propiedad',
            'change #checkbox_telefono_fijo': 'establecer_telefono_fijo',
            'change #checkbox_cobra_solicitante': 'establecer_cobra_solicitante',
            'change #checkbox_zona_rural': 'establecer_zona_rural',
			
			'click #button_identifica_ingresar_legajo': 'editar_legajo',
            'click #button_identifica_cancelar_legajo': 'cancelar_edicion_legajo',
            'click #button_identifica_agregar_legajo': 'agregar_legajo',
			
			'click #button_identifica_buscar_asociado': 'abrir_busqueda_asociado'

        },

        init: function(options) {
            _.bindAll(this, 'ingreso_cuil', 'setup_servicios', 'setup_bindings', 'render', 'cargar_entidades_solicitante', 'identificar_solicitante', 'seleccion_entidad', 'seleccion_subentidad', 'seleccion_legajo', 'establecer_legajo', 'cargar_subentidades', 'establecer_telefono_fijo', 'establecer_cobra_solicitante', 'establecer_zona_rural', 'cargar_categorias', 'seleccion_categoria', 'cargar_mutuales', 'seleccion_mutual', 'analizar_entidad_seleccionada', 'reduce_legajos', 'establecer_asociado', 'establecer_propiedad', 'visualizar_mutual', 'visualizar_subentidad', 'agregar_legajo', 'visualizar_legajos');

            this.entidad_default = {
                cod_entidad: null,
                descripcion_entidad: null,
                descripcion_subentidad: null,
                descripcion_categoria: null,
                cod_subentidad: null,
                cod_categoria: null,
                requiere_subentidad: null,
                codigo_seguridad: null,
                fecha_vencimiento: null,
                fecha_ingreso: null,
                cargo: null,
                garante_id: null,
                legajo: null,
                nuevo_legajo: false,
                es_tarjeta: false,
                es_correo: false,
                requiere_garante: false
            };

        },

        render: function() {
            this.setup_components();
            this.setup_servicios();
            this.bind_combo_collections();
            this.setup_bindings();
            this.binds_for_model(this.model_binding, this.model);
			
            this.load_buttons();
            this.load_datepickers();
			$('#div_busqueda_asociado').dialog({
                title: 'B&uacute;squeda de Asociado',
                height: 480,
                width: 800,
                autoOpen: false,
                modal: true
            });
        },

		abrir_busqueda_asociado: function(){
            if(typeof(this.componente_busqueda_asociado) == 'undefined') {
                this.componente_busqueda_asociado = new BusquedaAsociados({
                    el: $('#div_busqueda_asociado'),
                    p_delegacion: this.contexto_session.codDelegacion
                });
                var seleccion_asociado = function(asociado) {
                };
                this.componente_busqueda_asociado.bind('selected', seleccion_asociado, this);
				this.componente_busqueda_asociado.bind('cerrar', function() {
					$('#div_busqueda_asociado').dialog('close');					  						
				});
            } 
           this.componente_busqueda_asociado.reset();
            $('#div_busqueda_asociado').dialog('open');
        },
		
        start: function() {

        },

        finish: function() {

        },

        reset: function() {

        },

        validate: function(context) {
            var campos = [
                    {field_name: 'cuil'}, 
                    {field_name: 'legajo'}, 
                    {field_name: 'sexo'}, 
                    {field_name: 'fecha_nacimiento', descripcion: 'fecha de nacimiento'}, 
                    {field_name: 'cod_entidad', descripcion: 'entidad'}, 
                    {field_name: 'cod_categoria', descripcion: 'categoria'},
                    {field_name: 'cod_mutual', descripcion: 'mutual'} 
                ], campos_faltantes = [];

            var modelo = this.model;
            _.each(campos, function(campo) {
                if(!modelo.get(campo.field_name)) {
                    campos_faltantes.push(campo.descripcion||campo.field_name);
                }
            });
            if(modelo.get('requiere_subentidad')) {
                if(!modelo.get('cod_subentidad')) {
                    campos_faltantes.push('sub-entidad');
                }
            }
            if(modelo.get('es_tarjeta')) {
                if(!modelo.get('codigo_seguridad')) {
                    campos_faltantes.push('codigo seguridad');
                }
                if(!modelo.get('fecha_vencimiento')) {
                    campos_faltantes.push('fecha de vencimiento tarjeta');
                }
            }
            if(modelo.get('es_correo')) {
                if(!modelo.get('fecha_ingreso')) {
                    campos_faltantes.push('fecha de ingreso');
                }
                if(!modelo.get('cargo')) {
                    campos_faltantes.push('cargo');
                }
            }
            if(modelo.get('requiere_garante')) {
                if(!modelo.get('garante_id')) {
                    campos_faltantes.push('garante');
                }
            }
				
            //socioFirma=(frmSolicitante.viewAutorizadoAlCobro.chkAutorizadoAlCobro.value?'S':'N');
            var is_valid = !campos_faltantes.length;	
            if(!is_valid) {
                context.campos_faltantes = campos_faltantes;
                var error_message = 'Faltan los siguientes campos: ';
                _.each(campos_faltantes, function(campo) {
                    error_message = error_message+'\n'+campo; 
                });
                context.error = error_message;
            }
            return is_valid;
        },

        ingreso_cuil: function(e) {
            if (e.keyCode != 13 && e.keyCode != 9) {
                return;
            }
            e.preventDefault();
            var cuil = $('#identifica_cuil').attr('value');
            this.model.set({cuil: cuil});
        },

        identificar_solicitante: function(model) {
            if(!model.get('cuil')) {
                return;
            }
            this.solicitante.clear({silent:true});
            this.solicitante.set({
                p_cuil: model.get('cuil'),
                'pre-filter': 'enviarPeticionNosis'
            });
            this.solicitante.fetch({
                data: this.solicitante.toJSON(),
                success: this.establecer_asociado
            });
        },

        establecer_asociado: function() {
            this.model.set({
                apellido: this.solicitante.context.get('p_apellido'),
                nombres: this.solicitante.context.get('p_nombres'),
                sexo: this.solicitante.context.get('p_sexo'),
                fecha_nacimiento: this.solicitante.context.get('p_fecha_nacimiento'),
                cod_categoria: this.solicitante.context.get('p_cod_categoria'),
                descripcion_categoria: this.solicitante.context.get('p_categoria'),
                telefono_fijo: (this.solicitante.context.get('p_tiene_tel_fijo') == 'S'),
                zona_rural: (this.solicitante.context.get('p_vive_zona_rural') == 'S'),
                monto_asm: this.solicitante.context.get('p_monto_asm'),
                tiene_salud: (this.solicitante.context.get('p_tiene_salud') == 'S'),
                status: this.solicitante.context.get('p_status')
            });

            this.cargar_entidades_solicitante();
        },

        cargar_entidades_solicitante: function() {
            this.entidades.clear({silent:true});
            this.entidades.set({
                p_cuil: this.solicitante.get('p_cuil')
            });
            this.entidades.fetch({
                data: this.entidades.toJSON()
            });
        },

        seleccion_entidad: function(e) {
            var cod_entidad = $('#identifica_select_entidad').attr('value');
            if(!cod_entidad) {
                return;
            }
            this.current_entidad = this.entidades.cursor.find(function(model) {
                return (model.get('cod_entidad') == cod_entidad);
            });

            var default_value  = {};
            _.extend(default_value, this.entidad_default, {cod_entidad: cod_entidad});
            this.model.set(default_value);
            this.reduce_legajos();
        },

        seleccion_legajo: function(e) {
        
            var legajo = $('#identifica_select_legajos').attr('value'),
                legajo_seleccionado;
            if(!legajo) {
                return;
            }
            legajo_seleccionado = this.legajos_por_entidad.find(function(model) {
                return (model.get('legajo') == legajo);
            });
            this.model.set({
                legajo: legajo,
                nuevo_legajo: legajo_seleccionado.get('nuevo'),
                requiere_garante: legajo_seleccionado && (legajo_seleccionado.get('req_garante') == 'S')
            });
        },

        input_property_map: {
           identifica_fecha_vencimiento: 'fecha_vencimiento',
           identifica_fecha_ingreso: 'fecha_ingreso',
           identifica_codigo_seguridad: 'codigo_seguridad',
           identifica_cargo: 'cargo',
           identifica_sexo: 'sexo',
           identifica_fecha_nacimiento: 'fecha_nacimiento'
        },

        establecer_legajo: function(e) {
            this.model.set({legajo: e.target.value});
        },

        establecer_telefono_fijo: function(e) {
            this.model.set({telefono_fijo: e.target.checked});
        },

        establecer_cobra_solicitante: function(e) {
            this.model.set({cobra_solicitante: e.target.checked});
        },

        establecer_zona_rural: function(e) {
            this.model.set({zona_rural: e.target.checked});
        },

        cargar_subentidades: function(model) {
            this.sub_entidades.clear({silent:true});
            this.sub_entidades.set({
                p_cod_entidad: model.get('cod_entidad'),
                p_legajo: model.get('legajo'),
                p_fecha_nacimiento: model.get('fecha_nacimiento'),
                p_sexo: model.get('sexo')
            });
            this.sub_entidades.fetch({
                data: this.sub_entidades.toJSON()
            });
        },

        seleccion_subentidad: function() {
            var cod_subentidad = $('#identifica_select_sub_entidad').attr('value');
            var desc_subentidad = $('#identifica_select_sub_entidad option:selected').text();
            this.model.set({
                cod_subentidad: cod_subentidad,
                descripcion_subentidad: desc_subentidad
            });
            this.cargar_categorias(this.model);
        },

        cargar_categorias: function(model) {
            this.categorias_entidad.clear({silent:true});
            this.categorias_entidad.set({
                p_cod_entidad: model.get('cod_entidad'),
                p_cod_subentidad: model.get('cod_subentidad')
            });
            this.categorias_entidad.fetch({
                data: this.categorias_entidad.toJSON()
            });
        },

        seleccion_categoria: function() {
            var cod_categoria = $('#identifica_select_categoria').attr('value');
            var desc_categoria = $('#identifica_select_categoria option:selected').text();
            this.model.set({
                cod_categoria: cod_categoria,
                descripcion_categoria: desc_categoria
            });
        },

        cargar_mutuales: function(model) {
            this.mutuales_asociado.clear({silent:true});
            this.mutuales_asociado.set({
                p_cuil: model.get('cuil'),
                p_cod_entidad: model.get('cod_entidad')
            });
            this.mutuales_asociado.fetch({
                data: this.mutuales_asociado.toJSON()
            });
        },

        seleccion_mutual: function() {
            var cod_mutual= $('#identifica_select_mutual').attr('value');
            this.model.set({cod_mutual: cod_mutual});
        },

        get_summary: function() {
            var tel = this.model.get('telefono_fijo'),
                rural = this.model.get('zona_rural');
            return [
                {label: '', value: this.model.get('apellido')+', '+this.model.get('nombres') },
                {label: 'Sexo', value: (this.model.get('sexo') == 'MAS' ? 'Masculino' : 'Femenino') },
                {label: 'Fecha Nac', value: this.model.get('fecha_nacimiento')},
                {label: 'Estado', value: this.model.get('status')},
                {label: 'Entidad', value: this.model.get('descripcion_entidad')},
                {label: 'Sub-Entidad', value: this.model.get('descripcion_subentidad')},
                {label: 'Legajo', value: this.model.get('legajo')},
                {label: 'Categoria', value: this.model.get('descripcion_categoria')},
                {label: 'Req Aut', value: (this.model.get('requiere_autorizacion_online')? 'SI': 'NO')},
                {label: 'Tel Fijo', value: (tel ? 'SI': 'NO')},
                {label: 'Zona Rural', value: (rural ? 'SI': 'NO')}
            ];
        },

        setup_components: function() {
           $('#identifica_cuil').mask('99-99999999-9');
        },

        setup_servicios: function() {

            this.entidades = new Uif.Persistence({
                pack: 'pcw_entidades',
                sp: 'spw_entidades_socio'
            });

            this.sub_entidades = new Uif.Persistence({
                pack: 'pcw_entidades',
                sp: 'spw_subentidades_disponibles'
            });

            this.solicitante = new Uif.Persistence({
                pack: 'pcw_asociados',
                sp: 'spw_identificar_solicitante'
            });

            this.categorias_entidad = new Uif.Persistence({
                pack: 'pcw_categorias',
                sp: 'spw_categorias_entidad'
            });

            this.mutuales_asociado = new Uif.Persistence({
                pack: 'pcw_general',
                sp: 'spw_mutuales_socio'
            });

        },

        setup_bindings: function() {
            this.model.bind('change:cuil', this.identificar_solicitante);
            this.model.bind('change:status', this.desplegar_info_entidades);
            this.model.bind('change:cod_entidad', this.analizar_entidad_seleccionada);
            this.model.bind('change:sexo', this.visualizar_sexo);
            this.solicitante.cursor.bind('all', this.reduce_legajos);
        },

        desplegar_info_entidades: function(model) {
            var status = model.get('status');
            var visible = true;
            $('#div_info_entidades').css('display', visible?'block':'none');
        },

        analizar_entidad_seleccionada: function(model) {
            var requiere_subentidad = (this.current_entidad.get('req_subentidad') == 'S'),
                es_tarjeta = (this.current_entidad.get('es_tarjeta') == 'S'),
                req_segundo_legajo = this.current_entidad.get('req_segundo_legajo'),
                es_correo = (this.current_entidad.get('cod_entidad') == 'CORRE'),
                requiere_garante = (this.model.get('requiere_garante') == 'S'),
                descripcion_entidad = this.current_entidad.get('descripcion'),
                mutual_entidad = this.current_entidad.get('cod_mutual');

            this.model.set({
                requiere_autorizacion_online: (this.current_entidad.get('autorizacion_on_line') == 'S'),
                uso_cobranza_aux: this.current_entidad.get('uso_cobranza_aux'),
                es_tarjeta: es_tarjeta,
                es_correo: es_correo,
                descripcion_entidad: descripcion_entidad,
                requiere_subentidad: requiere_subentidad
            });

            this.visualizar_subentidad(requiere_subentidad);
            this.visualizar_mutual(mutual_entidad);
            this.visualizar_campos_tarjeta(es_tarjeta);
            this.visualizar_campos_correo(es_correo);
            this.visualizar_garante(requiere_garante);

        },

        visualizar_legajos: function(collection) {
            if(collection.length) {
                this.cancelar_edicion_legajo();
            } else {
                this.editar_legajo();
            }
        },

        visualizar_subentidad: function(requiere_subentidad) {
            if(requiere_subentidad) {
                this.cargar_subentidades(this.model);
            } else {
                this.cargar_categorias(this.model);
            }
            $('#row_sub_entidad').css('display', requiere_subentidad?'block':'none');
        },

        visualizar_mutual: function(mutual_entidad) {
            if(mutual_entidad) {
                this.model.set({cod_mutual: mutual_entidad});
            } else {
                this.cargar_mutuales(this.model);
            }
            $('#row_mutual').css('display', mutual_entidad?'none':'block');
        },

        visualizar_garante: function(visible) {
            $('#row_fecha_vencimiento').css('display', visible?'block':'none');
            $('#row_codigo_seguridad').css('display', visible?'block':'none');
        },

        visualizar_sexo: function(model) {
            var $radios = $('input:radio[name=identifica_sexo]');
            $radios.filter('[value='+model.get('sexo')+']').attr('checked', true);
        },

        visualizar_campos_tarjeta: function(visible) {
            $('#row_fecha_vencimiento').css('display', visible?'block':'none');
            $('#row_codigo_seguridad').css('display', visible?'block':'none');
        },

        visualizar_campos_correo: function(visible) {
            $('#row_cargo').css('display', visible?'block':'none');
            $('#row_fecha_ingreso').css('display', visible?'block':'none');
        },

        editar_legajo: function() {
            $('#identifica_legajo').attr('value', '');
            $('#legajo_seleccion').hide();
            $('#legajo_edicion').show();
        },

        agregar_legajo: function() {
            var nuevo_legajo = $('#identifica_legajo').attr('value'),
                entidad_seleccionada = this.model.get('cod_entidad');

            if(this.validar_legajo(entidad_seleccionada, nuevo_legajo)) {
                this.legajos_por_entidad.add({
                    legajo: nuevo_legajo,
                    nuevo: true,
                    cod_entidad: entidad_seleccionada
                });
                $('#legajo_seleccion').show();
                $('#legajo_edicion').hide();
            } else {
                Message.show_warning('Formato de legajo erroneo');
                //message_warning('Formato de legajo erroneo');
            }

        },

        validar_legajo: function(cod_entidad, legajo) {
            if((typeof(legajo) == 'undefined') || ($.trim(legajo).length < 6)) {
                return false;
            }
            var prefijo = legajo.substring(0,2);
            var validacion_comun_prefijo = function(prefijo) {
                return (
                    (prefijo > 0 && prefijo < 19) ||
                    (prefijo == 21) ||
                    (prefijo == 23) ||
                    (prefijo > 24 && prefijo < 29) ||
                    (prefijo == 31) ||
                    (prefijo > 32 && prefijo < 38) ||
                    (prefijo > 42 && prefijo < 45) ||
                    (prefijo == 47) ||
                    (prefijo == 52) ||
                    (prefijo == 71) ||
                    (prefijo == 74) ||
                    (prefijo == 80) ||
                    (prefijo == 84) ||
                    (prefijo == 94) ||
                    (prefijo == 97) ||
                    (prefijo == 98) ||
                    (prefijo == 99)
                );
            };

            switch(cod_entidad) {
                case 'ANSES':
                    return (
                        (prefijo > 0 && prefijo < 14) ||
                        (prefijo > 14 && prefijo < 20) ||
                        (prefijo == 43) ||
                        (prefijo > 49 && prefijo < 62)
                   );
                case 'SJES1':
                    return validacion_comun_prefijo(prefijo);
                case 'SJJ01':
                    return validacion_comun_prefijo(prefijo);
                case 'SJSG1':
                    return validacion_comun_prefijo(prefijo);
                case 'PENGR':
                    return (legajo.substring(0, 3) == '405');
                case 'INTA':
                    return (legajo.substring(5,1).toString() == '.');
                default:
                    return true;
            }

        },

        cancelar_edicion_legajo: function() {
            $('#identifica_legajo').attr('value', '');
            $('#legajo_seleccion').show();
            $('#legajo_edicion').hide();
        },

        bind_combo_collections: function() {
            var highlight_function = function(model) {
                if(model.get('orden') == 1) {
                    return 'style="color:blue"';
                }
                return '';
            };
            $('#identifica_select_entidad').datacombo(this.entidades.cursor, {
                codigo: 'cod_entidad',
                descripcion: 'descripcion',
                highlight: highlight_function,
                required: true
            });
            $('#identifica_select_sub_entidad').datacombo(this.sub_entidades.cursor, {
                codigo: 'cod_subentidad',
                descripcion: 'descripcion',
                required: true
            });
            $('#identifica_select_categoria').datacombo(this.categorias_entidad.cursor, {
                codigo: 'cod_categoria',
                descripcion: 'descripcion',
                required: true
            });
            $('#identifica_select_mutual').datacombo(this.categorias_entidad.cursor, {
                codigo: 'cod_mutual',
                descripcion: 'cod_mutual',
                required: true
            });

            this.legajos_por_entidad = new Uif.Collection;
            this.legajos_por_entidad.bind('reset', this.visualizar_legajos);

           $('#identifica_select_legajos').datacombo(this.legajos_por_entidad, {
                codigo: 'legajo',
                descripcion: 'legajo',
                required: true
            });

            this.categorias_entidad.cursor.bind('reset', this.desplegar_categorias);
        },

        desplegar_categorias: function(collection) {
            var has_elements = collection.length;
            $('#row_categoria').css('display', has_elements?'block':'none');
        },

        reduce_legajos: function() {
            if(!this.model.has('cod_entidad')) {
                return;
            }
            var cod_entidad_seleccionada = this.model.get('cod_entidad');
            this.legajos_por_entidad.reset(this.solicitante.cursor.filter(function(modelo) {
                return modelo.get('cod_entidad') == cod_entidad_seleccionada;
            }));
            
        },

        datepickers: [
            {name: 'identifica_fecha_nacimiento'},
            {name: 'identifica_fecha_ingreso'},
            {name: 'identifica_fecha_vencimiento'}
        ],

        buttons: [
            { id: 'identifica_buscar_asociado', icono: 'search', label: ''},
            { id: 'identifica_buscar_garante', icono: 'search', label: ''},
            { id: 'identifica_ingresar_legajo', icono: 'plusthick', label: ''},
            { id: 'identifica_agregar_legajo', icono: 'check', label: ''},
            { id: 'identifica_cancelar_legajo', icono: 'close', label: ''}
        ],

        model_binding: [
            { ui: 'identifica_fecha_nacimiento', property: 'fecha_nacimiento'},
            { ui: 'checkbox_telefono_fijo', property: 'telefono_fijo'},
            { ui: 'checkbox_zona_rural', property: 'zona_rural'}
        ]

    });


}).call(this);

