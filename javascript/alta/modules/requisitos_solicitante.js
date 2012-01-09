(function(){

    Ayudas.Alta.RequisitosSolicitante = Wizard.Viewer.extend({
        events: {
            'change #requisitos_tipo_ayuda': 'seleccion_tipo_ayuda',
            'change #requisitos_check_forma_pago_especial': 'habilitar_seleccion_formas_pago',
            'change #requisitos_tipo_monto': 'establecer_propiedad',
            'change #requisitos_monto': 'establecer_propiedad',
            'change #requisitos_cuotas_desde': 'establecer_propiedad',
            'change #requisitos_cuotas_hasta': 'establecer_propiedad',
            'change #requisitos_forma_pago_especial': 'establecer_propiedad'
 
        },

        init: function(options) {
            _.bindAll(this, 'seleccion_tipo_ayuda', 'cargar_combos', 'render', 'habilitar_seleccion_formas_pago', 'visualizar_carga_detalle', 'cargar_grilla_ventas_contado', 'cargar_grilla_detalle_ventas');
        
        },

        render: function() {
            this.load_buttons();
            this.setup_components();
            this.setup_servicios();
            this.bind_combo_collections();
            this.setup_bindings();
            //this.binds_for_model(this.model_binding, this.model);
            $('#row_formas_pago_especial').css('display', 'none');
            var $radios = $('input:radio[name=requisitos_tipo_monto]');
            $radios.filter('[value=MAX]').attr('checked', true);
            this.cargar_combos();
        },

        start: function() {

        },

        finish: function() {

        },

        reset: function() {

        },

        cargar_combos: function(model) {
            this.tipos_ayudas.fetch({
                data: {}
            });
            this.formas_pago_especial.fetch({
                data: {p_especial:'S'}
            });
        },

        habilitar_seleccion_formas_pago: function(e) {
            $('#row_formas_pago_especial').css('display', e.target.checked?'block':'none');
        },

        seleccion_tipo_ayuda: function(e) {
            var cod_tipo_ayuda = $('#requisitos_tipo_ayuda').attr('value');
            if(cod_tipo_ayuda) {
                this.current_tipo_ayuda = this.tipos_ayudas.cursor.find(function(model) {
                    return (model.get('cod_tipo_ayuda') == cod_tipo_ayuda);
                });
                this.model.set({
                    cod_tipo_ayuda: cod_tipo_ayuda,
                    cod_rubro: this.current_tipo_ayuda.get('cod_rubro'),
                    controla_stock: (this.current_tipo_ayuda.get('controla_stock') == 'S'),
                    descripcion_tipo_ayuda: this.current_tipo_ayuda.get('descripcion'),
                    lista_precio_propia: (this.current_tipo_ayuda.get('lista_precio_propia') == 'S'),
                    maneja_prestacion: (this.current_tipo_ayuda.get('maneja_prestacion') == 'S'),
                    precio_por_delegacion: (this.current_tipo_ayuda.get('precio_por_delegacion') == 'S'),
                    req_detalle: (this.current_tipo_ayuda.get('req_detalle') == 'S')
                });
            }
        },

        validate: function(context) {
            var campos = [
                    {field_name: 'cod_tipo_ayuda', descripcion: 'Tipo de Ayuda'},
                ], campos_faltantes = [];

            var modelo = this.model;
            _.each(campos, function(campo) {
                if(!modelo.get(campo.field_name)) {
                    campos_faltantes.push(campo.descripcion||campo.field_name);
                }
            });

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

        get_summary: function() {
            return [
                {label: 'Tipo Ayuda', value: this.model.get('descripcion_tipo_ayuda')},
                {label: 'Monto', value: this.model.get('monto_solicitado')},
                {label: 'Cuotas desde', value: this.model.get('cuotas_desde')},
                {label: 'Cuotas hasta', value: this.model.get('cuotas_hasta')}
            ];
        },

        setup_components: function() {
            $('#requisitos_cuotas_desde').spinner({ min: 1, max: 99});
            $('#requisitos_cuotas_hasta').spinner({ min: 1, max: 99});

            $('#requisitos_grid_detalle_ventas').jqGrid({
                datatype: 'clientSide',
                height: 150,
                colNames:['Producto', 'Descripcion', 'Proveedor', 'Cantidad', 'Precio Unit', 'Subtotal'],
                colModel:[
                    {name:'cod_producto', index:'cod_producto', width:40},
                    {name:'descripcion_producto', index:'descripcion_producto', width:175},
                    {name:'descripcion_proveedor', index:'descripcion_proveedor', width:80},
                    {name:'cantidad', index:'cantidad', width:25},
                    {name:'monto', index:'monto', width:52},
                    {name:'subtotal', index:'subtotal', width:40}
                ],
                multiselect: false,
                caption: 'Detalle Venta',
                data: []
            });
            $('#requisitos_grid_ventas_contado').jqGrid({
                datatype: 'clientSide',
                height: 150,
                colNames:['Venta Id', 'Producto', 'Mutual', 'Nro Venta', 'Fecha', 'Pago Contado', 'Venta', 'Nro Recibo'],
                colModel:[
                    {name:'venta_id', index:'venta_id', width:55},
                    {name:'cod_delegacion_pedido', index:'cod_delegacion_pedido', width:40},
                    {name:'cod_mutual', index:'cod_mutual', width:40},
                    {name:'nro_venta_contado', index:'nro_venta_contado', width:50},
                    {name:'fecha', index:'fecha', width:60},
                    {name:'monto_pago_contado', index:'monto_pago_contado', width:60},
                    {name:'monto_venta', index:'monto_venta', width:50},
                    {name:'nro_recibo', index:'nro_recibo', width:60}
                ],
                multiselect: false,
                caption: 'Ventas Contado Parciales',
                data: []
            });
        },

        cargar_grilla_ventas_contado: function() {
            $('#requisitos_grid_ventas_contado').clearGridData();
            if(this.ventas_contado_con_saldo.length) {
                $('#row_ventas_contado').show();
                $('#requisitos_grid_ventas_contado').addRowData( this.index, this.ventas_contado_con_saldo.toJSON(), 'last');
            } else {
                $('#row_ventas_contado').hide();
            }
        },

        cargar_grilla_detalle_ventas: function() {
            $('#requisitos_grid_detalle_ventas').clearGridData();
            if(this.detalles_venta.length) {
                $('#row_detalle_venta').show();
                $('#requisitos_grid_detalle_ventas').addRowData( this.index, this.detalles_venta.toJSON(), 'last');
            } else {
                $('#row_detalle_venta').hide();
            }
        },

        setup_servicios: function() {
            this.tipos_ayudas = new Uif.Persistence({
                pack: 'pcw_ayudas_economicas',
                sp: 'spw_tipos_ayudas'
            });
            this.formas_pago_especial = new Uif.Persistence({
                pack: 'pcw_general',
                sp: 'sp_formas_pagos'
            });
            this.ventas_contado_con_saldo = new Uif.Persistence({
                pack: 'pcw_ventas',
                sp: 'spw_ventas_contado_con_saldo'
            });

            this.detalles_venta = new Uif.Persistence({
                pack: 'pcw_ventas',
                sp: 'spw_detalle_venta'
            });

        },

        setup_bindings: function() {
            this.model.bind('change:req_detalle', this.visualizar_carga_detalle);
            this.model.bind('change:tipo_monto', this.visualizar_tipo_monto);
            this.detalles_venta.bind('all', this.cargar_grilla_detalle_ventas);
            this.ventas_contado_con_saldo.bind('all', this.cargar_grilla_ventas_contado);
        },

        visualizar_tipo_monto: function(atributes, atri ) {
            $('#row_requisitos_monto').css('display', (atri == 'MAX' ? 'none' : 'block'));
        },

        visualizar_carga_detalle: function(atri) {
            $('#button_requisitos_carga_detalle').css('display', this.model.get('req_detalle')?'inline-block':'none');
            if(this.model.get('req_detalle')) {
                this.ventas_contado_con_saldo.set({
                    p_cod_rubro: this.model.get('cod_rubro'),
                    p_cod_mutual: this.process_context.get('cod_mutual'),
                    p_cuil: this.process_context.get('cuil')
                });
                this.ventas_contado_con_saldo.fetch({
                    data: this.ventas_contado_con_saldo.toJSON()
                });
            } else {
                this.ventas_contado_con_saldo.clear();
            }
        },

        traer_detalle_venta: function(cod_venta_id) {
            this.detalles_venta.set({
	        	p_venta_id: cod_venta_id
            });
            this.detalles_venta.fetch({
                data: this.detalles_venta.toJSON()
            });
        },

        bind_combo_collections: function() {
            $('#requisitos_tipo_ayuda').datacombo(this.tipos_ayudas.cursor, {
                codigo: 'cod_tipo_ayuda',
                descripcion: 'descripcion',
                selected_value: 'FIN',
                required: true
            });
            $('#requisitos_forma_pago_especial').datacombo(this.formas_pago_especial.cursor, {
                codigo: 'cod_forma_pago',
                descripcion: 'descripcion'
            });
        },

        input_property_map: {
            requisitos_tipo_monto: 'tipo_monto',
            requisitos_monto: 'monto_solicitado',
            requisitos_cuotas_desde: 'cuotas_desde',
            requisitos_cuotas_hasta: 'cuotas_hasta',
            requisitos_forma_pago_especial: 'cod_forma_pago_especial'
        },

        buttons: [
            { id: 'requisitos_carga_detalle', icono: 'cart', label: 'Carga detalles'}
        ]

    });

}).call(this);


