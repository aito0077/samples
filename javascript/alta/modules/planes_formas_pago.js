(function(){

    Ayudas.Alta.PlanesFormaPago = Wizard.Viewer.extend({
        events: {
            //'change #requisitos_forma_pago_especial': 'establecer_propiedad'
        },

        init: function(options) {
            _.bindAll(this, 'render');
        },

        render: function() {
            this.load_buttons();
            this.setup_components();
            this.setup_servicios();
            this.setup_bindings();
        },

        start: function() {

        },

        finish: function() {

        },

        reset: function() {

        },

        validate: function(context) {
            /*
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
            */
            return true;
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
            
            $('#planes_grid_propuestas').jqGrid({
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
                caption: 'Propuestas de Renovaciones',
                data: []
            });
            $('#planes_grid_renovaciones').jqGrid({
                datatype: 'clientSide',
                height: 150,
                colNames:['Mutual', 'Delegacion', 'Nro.Solic.', 'Cuota $', 'Cuotas', 'Canceladas', 'Importe', 'Saldo', 'Servicio', 'Entidad', 'Legajo', 'Proveedor'],
                colModel:[
                    {name:'cod_mutual', index:'cod_mutual', width:40},  
                    {name:'cod_delegacion', index:'cod_delegacion', width:40},
                    {name:'nro_solicitud', index:'nro_solicitud', width:40},
                    {name:'valor_cuotas', index:'valor_cuotas', width:40},
                    {name:'cuotas', index:'cuotas', width:40},
                    {name:'cuotas_canceladas', index:'cuotas_canceladas', width:40},
                    {name:'monto_otorgado', index:'monto_otorgado', width:40},
                    {name:'saldo_cancelado', index:'saldo_cancelado', width:40},
                    {name:'servicio', index:'servicio', width:40},
                    {name:'cod_entidad', index:'cod_entidad', width:40},
                    {name:'legajo', index:'legajo', width:40},
                    {name:'descripcion_proveedor', index:'descripcion_proveedor', width:40}
                ],
                multiselect: false,
                caption: 'Renovaciones',
                data: []
            });
            $('#planes_grid_planes').jqGrid({
                datatype: 'clientSide',
                height: 150,
                colNames:['Solicitado', 'En mano', 'Cant.Ctas.', 'Importe', 'Proveedor'],
                colModel:[
                    {name:'monto', index:'monto', width:40},
                    {name:'neto_final', index:'neto_final', width:40},
                    {name:'cuotas', index:'cuotas', width:40},
                    {name:'valor_cuota', index:'valor_cuota', width:40},
                    {name:'descripcion_proveedor', index:'descripcion_proveedor', width:40}
                ],
                multiselect: false,
                caption: 'Seleccion de plan',
                data: []
            });
        },

        cargar_grilla_propuestas: function() {
            $('#requisitos_grid_ventas_contado').clearGridData();
            if(this.ventas_contado_con_saldo.length) {
                $('#row_ventas_contado').show();
                $('#requisitos_grid_ventas_contado').addRowData( this.index, this.ventas_contado_con_saldo.toJSON(), 'last');
            } else {
                $('#row_ventas_contado').hide();
            }
        },

        setup_servicios: function() {
            /*
            this.tipos_ayudas = new Uif.Persistence({
                pack: 'pcw_ayudas_economicas',
                sp: 'spw_tipos_ayudas'
            });
            */
        },

        setup_bindings: function() {
            //this.model.bind('change:req_detalle', this.visualizar_carga_detalle);
        },

        traer_propuesta: function(cod_venta_id) {
            this.detalles_venta.set({
	        	p_venta_id: cod_venta_id
            });
        },

        traer_planes: function(cod_venta_id) {
            this.detalles_venta.set({
	        	p_venta_id: cod_venta_id
            });
        },

        buttons: [
            { id: 'planes_actualizar', icono: 'refresh', label: 'Actualizar'},
            { id: 'ver_morosidad', icono: 'calculator', label: 'Ver detalle'}
        ]

    });

}).call(this);






