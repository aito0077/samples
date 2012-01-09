(function(){

    Ayudas.Alta.ConsultaMargen = Wizard.Viewer.extend({
        STATIC_PORCENTAJE_AMPC: 0.20,
        STATIC_TOPE_MARGEN_AMPC: 750,
        events: {
            'change #margen_recibo_periodo': 'establecer_propiedad',
            'change #margen_sueldo_basico': 'establecer_propiedad',
            'change #margen_descuento_ley': 'establecer_propiedad',
            'change #margen_total_descuento': 'establecer_propiedad',
            'change #margen_proximo_descuento': 'establecer_propiedad',
            'change #margen_con_salud': 'establecer_propiedad',
            'change #margen_libre_deuda': 'establecer_propiedad',
            'change #margen_margen': 'establecer_propiedad',
            'change #margen_deseado': 'establecer_propiedad'
        },

        init: function(options) {
            _.bindAll(this, 'render', 'cargar_datos_margen', 'cargar_aumentos_futuros', 'visualizar_margen', 'calcular_margen', 'establecer_margen_deseado', 'establecer_datos_margen');
        },

        render: function() {
            this.setup_components();
            this.setup_servicios();
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
            /*
            this.tipos_ayudas.fetch({
                data: {}
            });
            this.formas_pago_especial.fetch({
                data: {p_especial:'S'}
            });
            */
        },

        validate: function(context) {
            console.dir(this.model);
            return true;
        },

        _valida: function() {
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


        cargar_aumentos_futuros: function() {
            this.aumentos_futuros.fetch({
                data: {
                    p_cod_entidad: this.process_context.get('cod_entidad'),
                    p_legajo: this.process_context.get('legajo'),
                    p_periodo_recibo: this.model.get('recibo_periodo')
                }
            });
        },

        cargar_datos_margen: function() {
            this.datos_margen.fetch({
                data: {
                    p_cuil: this.process_context.get('cuil'),
                    p_cod_mutual: this.process_context.get('cod_mutual'),
                    p_cod_entidad: this.process_context.get('cod_entidad'),
                    p_cod_subentidad: this.process_context.get('cod_subentidad'),
                    p_cod_delegacion:  this.contexto_session.codDelegacion,
                    p_cod_categoria: this.process_context.get('cod_categoria'),
                    p_periodo: this.model.get('recibo_periodo'),
                    p_en_base_a: this.process_context.get('tipo_monto'),
                    p_monto: (this.process_context.get('cod_tipo_monto') == 'MAX' ? '' : this.process_context.get('monto_solicitado'))
				},
                success: this.establecer_datos_margen
            });
        },

        setup_servicios: function() {
            this.datos_margen = new Uif.Persistence({
                pack: 'pcw_ayudas_economicas',
                sp: 'spw_datos_margen'
            });
            this.aumentos_futuros = new Uif.Persistence({
                pack: 'pcw_ayudas_economicas',
                sp: 'spw_aumentos_futuros'
            });
            this.topes_cuotas = new Uif.Persistence({
                pack: 'pcw_ayudas_economicas',
                sp: 'spw_tope_cuota'
            });
        },

        setup_bindings: function() {
            this.model.bind('change:recibo_periodo', this.cargar_datos_margen);
            this.model.bind('change:recibo_periodo', this.cargar_aumentos_futuros);

            this.model.bind('change:sueldo_basico', this.calcular_margen);
            this.model.bind('change:descuento_ley', this.calcular_margen);
            this.model.bind('change:total_descuento', this.calcular_margen);
            this.model.bind('change:proximo_descuento', this.calcular_margen);
            this.model.bind('change:con_salud', this.calcular_margen);
            this.model.bind('change:libre_deuda', this.calcular_margen);

            this.model.bind('change:margen_deseado', this.calcular_margen);
            this.model.bind('change:margen_deseado', this.establecer_margen_deseado);
            this.model.bind('change:margen', this.visualizar_margen);
        },

        input_property_map: {
            margen_recibo_periodo: 'recibo_periodo',
            margen_sueldo_basico: 'sueldo_basico',
            margen_descuento_ley: 'descuento_ley',
            margen_total_descuento: 'total_descuento',
            margen_proximo_descuento: 'proximo_descuento',
            margen_con_salud: 'con_salud',
            margen_libre_deuda: 'libre_deuda',
            margen_deseado: 'margen_deseado',
            margen_margen: 'margen'
        },

        calcular_margen: function() {
            if(this.model.get('restriccion_tope_cuota') || this.model.get('margen_deseado')) {
                return;
            };
            var sueldo_basico = this.model.get('sueldo_basico'),
                sueldo_basico_calculado = this.model.get('sueldo_basico'),
                descuento_ley = this.model.get('descuento_ley'),
                total_descuento = this.model.get('total_descuento'),
                proximo_descuento = this.model.get('proximo_descuento'),
                libre_deuda = this.model.get('libre_deuda'),
                porcentaje_sueldo_con_descuento = this.model.get('porcentaje_afectacion_con_descuento'),
                porcentaje_sueldo_sin_descuento = this.model.get('porcentaje_afectacion_sin_descuento'),
                margen_calculado = 0,
                margen_con_descuento = 0,
                margen_sin_descuento = 0,
                descuento_reconocido = 0,
                cod_entidad = this.process_context.get('cod_entidad'),
                is_correo = (cod_entidad == 'CORRE');

                sueldo_basico = sueldo_basico ? sueldo_basico : 0;
                descuento_ley = descuento_ley ? descuento_ley : 0;
                total_descuento = total_descuento ? total_descuento : 0;
                proximo_descuento = proximo_descuento ? proximo_descuento : 0;
                libre_deuda = libre_deuda ? libre_deuda : 0;
                porcentaje_sueldo_con_descuento = porcentaje_sueldo_con_descuento ? porcentaje_sueldo_con_descuento : 0;
                porcentaje_sueldo_sin_descuento = porcentaje_sueldo_sin_descuento ? porcentaje_sueldo_sin_descuento : 0;
                margen_calculado = margen_calculado ? margen_calculado : 0;
                margen_con_descuento = margen_con_descuento ? margen_con_descuento : 0;
                margen_sin_descuento = margen_sin_descuento ? margen_sin_descuento : 0;
                descuento_reconocido = descuento_reconocido ? descuento_reconocido : 0;
 

                console.dir({
                sueldo_basico : this.model.get('sueldo_basico'),
                descuento_ley : this.model.get('descuento_ley'),
                total_descuento : this.model.get('total_descuento'),
                proximo_descuento : this.model.get('proximo_descuento'),
                libre_deuda : this.model.get('libre_deuda'),
                porcentaje_sueldo_con_descuento : this.model.get('porcentaje_afectacion_con_descuento'),
                porcentaje_sueldo_sin_descuento : this.model.get('porcentaje_afectacion_sin_descuento'),
                margen_calculado : 0,
                margen_con_descuento : 0,
                margen_sin_descuento : 0,
                descuento_reconocido : 0,
                cod_entidad : this.process_context.get('cod_entidad'),
                is_correo : (cod_entidad == 'CORRE')
                });

            descuento_reconocido = parseFloat(total_descuento) - parseFloat(descuento_ley);

            if(is_correo) {
                marge_calculado = (parseFloat(sueldo_basico) * this.STATIC_PORCENTAJE_AMPC - parseFloat(proximo_descuento) - parseFloat(total_descuento) +  parseFloat(libre_deuda));
            } else {
                if(cod_entidad =='ISSNP'){
                    sueldo_basico_calculado = parseFloat(sueldo_basico)/0.05;
                } else {
                    sueldo_basico_calculado = parseFloat(sueldo_basico);
                    margen_con_descuento = ((parseFloat(sueldo_basico_calculado) - parseFloat(descuento_ley)) * (parseFloat(porcentaje_sueldo_con_descuento)/100)) - parseFloat(proximo_descuento) - parseFloat(descuento_reconocido) + parseFloat(libre_deuda);
                    if(porcentaje_sueldo_sin_descuento === 0) {
                        margen_sin_descuento = margen_con_descuento;
                    } else {
                        margen_sin_descuento = ((parseFloat(sueldo_basico_calculado)-parseFloat(descuento_ley))*(parseFloat(porcentaje_sueldo_sin_descuento)/100));
                    }
                    if(parseFloat(margen_con_descuento) > parseFloat(margen_sin_descuento)) {
                        margen_calculado = parseFloat(margen_sin_descuento);
                    } else {
                        margen_calculado = parseFloat(margen_con_descuento);
                    }
                }
            }
            if(margen_calculado < 0){
                margen_calculado = 0;
            }
            console.log('Margen: '+margen_calculado);
            this.model.set({margen: margen_calculado});
        },

        establecer_margen_deseado: function() {
            var margen_deseado = this.model.get('margen_deseado'),
                margen = this.model.get('margen');
            console.log('margen deseado: '+margen_deseado);
            if(margen_deseado) {
                this.model.set({
                    prueba_margen: (parseFloat(margen_deseado) - parseFloat(margen)),
                    margen: margen_deseado
                });
            }
        },

        visualizar_margen: function() {
            var margen = this.model.get('margen'),
                warning_message = '',
                cod_entidad = this.process_context.get('cod_entidad'),
                is_correo = (cod_entidad == 'CORRE'),
                restriccion_tope_cuota = this.model.get('restriccion_tope_cuota');
            $('#margen_margen').attr('value', margen);
            $('#row_margen').css('display', margen ? 'block' : 'none');
            if(is_correo && margen > this.STATIC_TOPE_MARGEN_AMPC) {
                warning_message = 'Por disposici&#243;n de CORREO ARGENTINO ning&#250;n descuento de AMPC puede superar $'+this.STATIC_TOPE_MARGEN_AMPC+', aunque el margen los supere.';
                Message.show_warning(warning_message);
            }

        },

        establecer_datos_margen: function() {
            var restriccion_tope_cuota = (this.datos_margen.context.get('p_porc_afectacion_c_desc') == 100 && this.datos_margen.context.get('p_porc_afectacion_s_desc') == 100);
            this.model.set({
                porcentaje_afectacion_con_descuento: this.datos_margen.context.get('p_porc_afectacion_c_desc'),
                porcentaje_afectacion_sin_descuento: this.datos_margen.context.get('p_porc_afectacion_s_desc'),
                minimo_valor_cuota: this.datos_margen.context.get('p_min_valor_cuota_ae'),
                valor_cuota_salud: this.datos_margen.context.get('p_valor_cuota_salud'),
                datos_margen_proximos_descuentos: this.datos_margen.context.get('p_proximos_descuentos'),
                datos_margen_libre_deuda: this.datos_margen.context.get('p_libre_deuda'),
                trx_salud_rechazada: (this.datos_margen.context.get('p_trx_salud_rechazada') == 'S'),
                restriccion_tope_cuota: restriccion_tope_cuota
            });
        }

    });

}).call(this);

