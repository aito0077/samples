(function(){

    var self = this, Admin;

    if (typeof exports !== 'undefined') {
        Admin = exports;
    } else {
        Admin = self.Admin = {};
    }

    Admin.Edit = Uif.View.extend({

        events: {
            'click #button_agregar_pregunta': 'agregar_pregunta'
        },

        initialize: function(options) {
            _.bindAll(this, 'render', 'agregar_pregunta', 'visualizar_preguntas', 'setup_bindings');
            this.preguntas = new Uif.Collection;
            this.render();
        },

        render: function() {
            this.setup_components();
            this.setup_servicios();
            this.setup_bindings();
            this.generar_preguntas();
        },

        generar_preguntas: function() {
            this.preguntas.add({
                codigo_pregunta: 'cod_1',
                orden: 0,
                descripcion_pregunta: 'Esta es una pregunta generada dinamicamente'
            });
            this.preguntas.add({
                codigo_pregunta: 'cod_2',
                orden: 1,
                descripcion_pregunta: 'Esta es una segunda pregunta generada dinamicamente'
            });
            this.preguntas.add({
                codigo_pregunta: 'cod_3',
                orden: 3,
                descripcion_pregunta: 'Quien lee un libro'
            });
            this.preguntas.add({
                codigo_pregunta: 'cod_4',
                orden: 2,
                descripcion_pregunta: 'Quien sigue leyendo un libro'
            });
        },

        setup_components: function() {
            $(".collapse").collapse();
        },

        setup_servicios: function() {
            this.concurso = new Uif.Model({
                url: ''
            });
        },

        setup_bindings: function() {
            this.preguntas.bind('all', this.visualizar_preguntas);
        },

        agregar_pregunta: function() {
            this.preguntas.add({
                codigo_pregunta: this.preguntas.size(),
                descripcion_pregunta: $('#concurso_pregunta').attr('value')
            });
        },

        visualizar_preguntas: function() {
            var self = this;
            $('#cuestionario').html('');
            _.each(this.preguntas.models, function(model) {
                $('#cuestionario').append(self.template_pregunta(model.toJSON()));
            });
        },

        traer_informacion_concurso: function() {
            this.concurso.fetch({
	        	data: {

                },
                success: this.procesar_informacion_concurso
            });
        },

        procesar_informacion_concurso: function() {

        },

        template_pregunta: _.template(' <div class="accordion-group" id="grupo_pregunta_<%=codigo_pregunta%>"> <div class="accordion-heading"> <a class="accordion-toggle" data-toggle="collapse" data-parent="#cuestionario" href="#<%=codigo_pregunta%>"> <i class="icon-list"></i><%=descripcion_pregunta%> </a> </div> <div id="<%=codigo_pregunta%>" class="accordion-body collapse in"> <div id="#respuestas_<%codigo_pregunta%>" class="accordion-inner"> </div> </div> </div> '),

        template_respuesta_view: _.template(' <div id="<%=codigo_respuesta%>" class="row"> <div class="span5"><%=descripcion_respuesta%></div> <div class="span1"></div> <div class="span1"><button class="btn btn-link"><i class="icon-pencil"></i></button></div> <div class="span1"><button class="btn btn-link"><i class="icon-remove-sign"></i></button></div> <div class="span1"></div> <div class="span1"></div> <div class="span1"></div> </div> ')
    });

}).call(this);
