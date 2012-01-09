(function(){

    Ayudas.Alta.FormasPago = Uif.View.extend({
        events: {
        },

        init: function(options) {
            _.bindAll(this, 'render');
        },

        render: function() {
            this.load_buttons();
            this.setup_components();
            this.setup_servicios();
            this.bind_combo_collections();
            this.setup_bindings();
        },

        validate: function(context) {
            return true;
        },

        setup_components: function() {
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

        bind_combo_collections: function() {
            /*
            $('#requisitos_tipo_ayuda').datacombo(this.tipos_ayudas.cursor, {
                codigo: 'cod_tipo_ayuda',
                descripcion: 'descripcion',
                selected_value: 'FIN',
                required: true
            });
            */
        },

        input_property_map: {
            //requisitos_tipo_monto: 'tipo_monto',
        },

        buttons: [
        //    { id: 'requisitos_carga_detalle', icono: 'cart', label: 'Carga detalles'}
        ]

    });

}).call(this);


