(function(){

    Ayudas.Alta.InformacionNosis = Wizard.Viewer.extend({
        template_informacion_usuario: _.template('<label>Cuil:</label>&nbsp;<b><%=key%></b>&nbsp;-&nbsp;<label>Apellido y Nombre:</label>&nbsp;<b><%=rz%></b>'),

        events: {
            //'change #requisitos_tipo_ayuda': 'seleccion_tipo_ayuda',
        },

        init: function(options) {
            _.bindAll(this, 'render', 'traer_informacion_nosis', 'traer_informacion_deuda_nosis', 'visualizar_informacion_persona', 'cargar_grilla');
        },

        render: function() {
            this.load_buttons();
            this.setup_components();
            this.setup_servicios();
            this.bind_combo_collections();
            this.setup_bindings();
            this.cargar_combos();
            this.traer_informacion_nosis();
        },

        start: function() {

        },

        finish: function() {

        },

        reset: function() {

        },

        cargar_combos: function(model) {
            this.entidades_crediticias.fetch({
	        	data: {
                    p_descripcion: null,
                    p_visible: 'S'
                }
            });
        },

        validate: function(context) {
            console.dir(this.model);
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
            $('#nosis_tab').tabs();
            $('#nosis_grilla_deuda').jqGrid({
                datatype: 'clientSide',
                height: 150,
                autowidth: true,
                shrinkToFit: true,
                colNames:['Entidad', 'Situacion', 'Periodo', 'Monto', 'Porcentaje', 'Judicializada'],
                colModel:[
                    {name:'entidad_crediticia', index:'entidad_crediticia', width:180},
                    {name:'cod_deuda', index:'cod_deuda', width:40},
                    {name:'periodo_2', index:'periodo_2', width:60},
                    {name:'monto', index:'monto', width:60},
                    {name:'porcentaje', index:'porcentaje', width:60},
                    {name:'proceso__juridico__2', index:'proceso__juridico__2', width:60}
                ],
                multiselect: false,
                caption: 'Verificacion Crediticia',
                data: []
            });
        },

        setup_servicios: function() {
            this.entidades_crediticias = new Uif.Persistence({
                pack: 'pcw_asociados',
                sp: 'spw_entidades_crediticias'
            });
            this.informacion_deuda_nosis = new Uif.Persistence({
                pack: 'pcw_asociados',
                sp: 'spw_deudas_nosis'
            });

            this.informacion_nosis = new Uif.Model;
            this.informacion_nosis.url = 'traerInformacionNosis.json?lowercase';

            //PCW_ACT_SOCIOS/spw_alta_deuda_nosis
            //PCW_ACT_SOCIOS/spw_alta_informacion_nosis
        },

        setup_bindings: function() {
            this.informacion_deuda_nosis.cursor.bind('all', this.cargar_grilla);
        },

        cargar_grilla: function() {
            $('#nosis_grilla_deuda').clearGridData();
            if(this.informacion_deuda_nosis.cursor.length) {
                $('#nosis_grilla_deuda').addRowData(this.id, this.informacion_deuda_nosis.cursor.toJSON(), 'last');
            }
        },

        traer_informacion_nosis: function() {
            this.informacion_nosis.fetch({
	        	data: {
                    CUIL: this.process_context.get('cuil')
                },
                success: this.traer_informacion_deuda_nosis
            });
        },

        traer_informacion_deuda_nosis: function() {
            var status = this.informacion_nosis.context.get('status');
            var nosis = this.informacion_nosis.context.get("nosis");
            nosis.key = this.informacion_nosis.context.get("key");
            var ino_id = nosis.ino_id;
            console.dir(nosis);
            this.process_context.set({
                ino_id: ino_id,
                status_nosis: status,
                nosis_message: nosis.error,
                nosis: nosis
            });
 
            this.informacion_deuda_nosis.fetch({
	        	data: {
                    p_ino_id: this.process_context.get('ino_id')
                }
            });
            this.visualizar_informacion_persona(nosis);
        },

        visualizar_informacion_persona: function(data) {
            $('#div_informacion_asociado').html(this.template_informacion_usuario(data));
        },

        bind_combo_collections: function() {
            $('#nosis_entidades').datacombo(this.entidades_crediticias.cursor, {
                codigo: 'cod_entidad',
                descripcion: 'descripcion',
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
            { id: 'nosis_web', icono: 'newwin', label: 'Web Nosis'},
            { id: 'agregar_deuda', icono: 'plusthick', label: 'Agregar'}
        ]

    });

}).call(this);


