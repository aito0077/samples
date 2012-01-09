$(function(){
    Modelo = Uif.Persistence.extend({
        pack: 'pcw_plazos_fijos',
        sp: 'spw_pf'
    });

    Viewer = Uif.View.extend({
        initialize: function() {
            console.log('En el initialize');
            this.render();
            this.modelo = new Modelo;
            this.modelo.bind('error', this.do_on_error);
            this.modelo.bind('warning', this.do_on_warning);
            this.modelo.bind('change', this.do_on_change);

            this.modelo.set({
                p_cod_mutual: 'AMPF',
                p_cod_delegacion: '000000',
                p_nro_pf: 80
            });
            this.modelo.fetch({
                data: this.modelo.toJSON()
            });

        },

        render: function() {
            Message.show_info('Mostramos mensaje de informacion en el render');
            Message.show_error('Error errores');
            Message.show_warning('Estoi es un warning');
            Message.show_message('esto es un mensaje');
        },

        do_on_change: function(model, resp, options) {
            console.log('do on change');
        },

        do_on_error: function(model, resp, options) {
            console.log('do on error');
        },

        do_on_warning: function(model, resp, options) {
            console.log('do on warning');
        }

    });

    window.manager = new Wizard.Manager;
    //window.viewer = new Viewer;

});
