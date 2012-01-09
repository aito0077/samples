
(function(){

    Ayudas.Alta.ControlDocumentacion = Wizard.Viewer.extend({
        events: {
            'change #documentacion_dni_nuevo': 'establecer_propiedad',
            'change #documentacion_dni_libreta': 'establecer_propiedad',
            'change #documentacion_libreta_civica': 'establecer_propiedad',
            'change #documentacion_libreta_enrolamiento': 'establecer_propiedad',
            'change #documentacion_foto_ok': 'establecer_propiedad',
            'change #documentacion_troquelado': 'establecer_propiedad',
            'change #documentacion_sello_registro_civil': 'establecer_propiedad',
            'change #documentacion_hoja_voto': 'establecer_propiedad',
            'change #documentacion_complementaria': 'establecer_propiedad',
            'change #documentacion_tirilla': 'establecer_propiedad',
            'change #documentacion_ci_pasaporte': 'establecer_propiedad',
            'change #documentacion_dni_viejo': 'establecer_propiedad',
            'change #documentacion_doc_complementaria': 'establecer_propiedad',
            'change #documentacion_servicio_titular': 'establecer_propiedad',
            'change #documentacion_luz': 'establecer_propiedad',
            'change #documentacion_gas': 'establecer_propiedad',
            'change #documentacion_telefono': 'establecer_propiedad',
            'change #documentacion_agua': 'establecer_propiedad',
            'change #documentacion_servicio_terceros': 'establecer_propiedad',
            'change #documentacion_acredita_vinculo': 'establecer_propiedad',
            'change #documentacion_coincide_domicilio_dni': 'establecer_propiedad',
            'change #documentacion_otros_servicios': 'establecer_propiedad',
            'change #documentacion_otros_servicios': 'establecer_propiedad',
            'change #documentacion_factura_celular': 'establecer_propiedad',
            'change #documentacion_resumen_tarjeta': 'establecer_propiedad',
            'change #documentacion_contrato_alquiler': 'establecer_propiedad',
            'change #documentacion_certificado_domicilio_original': 'establecer_propiedad',
            'change #documentacion_certificado_domicilio_copia': 'establecer_propiedad',
            'change #documentacion_certificado_declaracion_jurada': 'establecer_propiedad',
            'change #documentacion_pendiente_entrega': 'establecer_propiedad'
            //'change #margen_deseado': 'establecer_propiedad'
        },

        init: function(options) {
            _.bindAll(this, 'render');
        },

        render: function() {
            this.setup_components();
            this.load_buttons();
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
            console.dir(this.model);
            return true;
        },

        get_summary: function() {
            return [
                {label: 'Periodo', value: this.model.get('recibo_periodo')},
                {label: 'Basico', value: this.model.get('sueldo_basico')},
                {label: 'Desc. Ley', value: this.model.get('descuento_ley')},
                {label: 'Total Desc.', value: this.model.get('total_descuento')},
                {label: 'Prox. Desc.', value: this.model.get('proximo_descuento')},
                {label: 'Libre Deuda', value: this.model.get('libre_deuda')},
                {label: 'Margen', value: this.model.get('margen')},
                {label: 'Con Salud', value: this.model.get('con_salud') =='ON' ? 'SI' : 'NO'}
            ];
        },

        setup_components: function() {
        },


        setup_servicios: function() {
            /*
            this.topes_cuotas = new Uif.Persistence({
                pack: 'pcw_ayudas_economicas',
                sp: 'spw_tope_cuota'
            });
            */
        },

        setup_bindings: function() {
           this.model.bind('change:dni_carnet', this.visualizar_detalle_dni);
           this.model.bind('change:tipo_servicio', this.visualizar_detalle_servicios);
        },

        visualizar_detalle_dni: function(model, attri) {
            $('#row_detalle_dni').css('display', (attri == '2' || attri == '22' || attri == '21') ? 'block' : 'none'); 
            $('#row_detalle_tirilla').css('display', (attri == '0') ? 'block' : 'none'); 
        },

        visualizar_detalle_servicios: function(model, attri) {
            $('#row_servicios_titular').css('display', (attri == 'TIT') ? 'block' : 'none'); 
            $('#row_servicios_terceros').css('display', (attri == 'TER') ? 'block' : 'none'); 
            $('#row_servicios_otros').css('display', (attri == 'OTR') ? 'block' : 'none'); 
        },

        establecer_propiedad: function(e) {
            var map = {};
            if(e.target.type == 'radio') {
                map[this.input_property_map[e.target.id]] = e.target.checked;
                map[this.input_property_map[e.target.name]] = e.target.value;
            } else {
                map[this.input_property_map[e.target.id]] = e.target.value;
            }
            this.model.set(map);
        },

        input_property_map: {
            documentacion_dni_nuevo: 'dni_nuevo',
            documentacion_dni_libreta: 'dni_libreta',
            documentacion_libreta_civica: 'libreta_civica',
            documentacion_libreta_enrolamiento: 'libreta_enrolamiento',
            documentacion_foto_ok: 'foto_ok',
            documentacion_troquelado: 'troquelado',
            documentacion_sello_registro_civil: 'sello_registro_civil',
            documentacion_hoja_voto: 'hoja_voto',
            documentacion_complementaria: 'complementaria',
            documentacion_tirilla: 'tirilla',
            documentacion_ci_pasaporte: 'ci_pasaporte',
            documentacion_dni_viejo: 'dni_viejo',
            documentacion_doc_complementaria: 'doc_complementaria',
            documentacion_servicio_titular: 'servicio_titular',
            documentacion_luz: 'luz',
            documentacion_gas: 'gas',
            documentacion_telefono: 'telefono',
            documentacion_agua: 'agua',
            documentacion_servicio_terceros: 'servicio_terceros',
            documentacion_acredita_vinculo: 'acredita_vinculo',
            documentacion_coincide_domicilio_dni: 'coincide_domicilio_dni',
            documentacion_otros_servicios: 'otros_servicios',
            documentacion_otros_servicios: 'otros_servicios',
            documentacion_factura_celular: 'factura_celular',
            documentacion_resumen_tarjeta: 'resumen_tarjeta',
            documentacion_contrato_alquiler: 'contrato_alquiler',
            documentacion_certificado_domicilio_original: 'certificado_domicilio_original',
            documentacion_certificado_domicilio_copia: 'certificado_domicilio_copia',
            documentacion_certificado_declaracion_jurada: 'certificado_declaracion_jurada',
            documentacion_pendiente_entrega: 'pendiente_entrega',

            dni_carnet: 'dni_carnet',
            dni_tirilla: 'dni_tirilla',
            otros_servicios: 'otros_servicios',
            servicio_terceros: 'servicio_terceros',
            servicio_titular: 'servicio_titular',
            tipo_servicio: 'tipo_servicio'
        },

        buttons: [
            { id: 'complementaria_dni', icono: 'lightbulb', label: 'Ver complementaria'},
            { id: 'complementaria_tirilla', icono: 'lightbulb', label: 'Ver complementaria'},
        ]
    });

}).call(this);


