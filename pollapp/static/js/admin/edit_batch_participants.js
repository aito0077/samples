(function(){

    var self = this;

    if (typeof Admin == 'undefined') {
        Admin = self.Admin = {};
    }

    Admin.EditBatch = Uif.View.extend({

        events: {
            'change .checkbox': 'preview_batch',
            'click #button_preview_format': 'preview_batch',
            'click #button_batch_agregar_registro': 'editar_registro',
            'submit #fileupload': 'validar_seleccion_archivo',
            'click .row_action_eliminar': 'do_eliminar_registro',
            'click .row_action_modificar': 'do_modificar_registro'

        },

        initialize: function(options) {
            _.bindAll(this, 'render', 'get_data_source', 'reset', 'process_participants', 'editar_registro', 'cancelar_editor_participante', 'guardar_participante', 'instantiate_editor_registro', 'do_modificar_registro', 'do_eliminar_registro');
        
            this.model = new Uif.Model;
            this.setup_components();
            this.render();
        },

        render: function() {
            this.setup_servicios();
            this.setup_bindings();
        },

        reset: function(options) {
            if(typeof options != 'undefined') {
                this.model.set({
                    batch_id: options.batch_id
                });
                this.get_data_source(options.batch_id);
            }
        },

        setup_components: function() {
            var self = this;
            this.datasource = new Admin.ParticipantsDatasource({

            });

        },

        setup_servicios: function() {
            this.service_batch = new Uif.Model;
            this.service_update = new Uif.Model;
            this.service_delete = new Uif.Model;
        },

        setup_bindings: function() {

        },

        validar_seleccion_archivo: function(e) {
            if($('#batch_file').val() != '' && $('#batch_descripcion').val() != '') {
                return true;
            } else {
                bootbox.alert('Debe completar todos los campos.');
                return false;
            }
        },

        preview_batch: function() {
            console.log($('#fileprocess').serialize());
            $.post('/admin/participants/batch_preview', $('#fileprocess').serialize(), function(response){
                $('#records_preview').html(response);
            });
        },

        get_data_source: function(batch_id) {
           this.service_batch.fetch({
                url: '/admin/participants/get_batch',
                data: {
                    batch_id: batch_id   
                }, 
                success: this.process_participants
           }); 
        },
 
        process_participants: function(response) {
            this.datasource.reset(response.context);
            $('#participants_table').datagrid({
                dataSource: this.datasource
            });
        }, 

        editar_registro: function() {
            this.instantiate_editor_registro();
            $('#dialog_editar_participante').modal({
                show: true    
            });
            Admin.editor_participante.reset({
            });
        },

        instantiate_editor_registro:  function() {
            if(typeof(Admin.editor_actividad) == 'undefined') {
                Admin.editor_participante = new Admin.ParticipantEditRecord({
                    el: $('#dialog_editar_participante')
                });
                Admin.editor_participante.bind('guardar_participante', this.guardar_participante);
                Admin.editor_participante.bind('cancelar_participante', this.cancelar_editor_participante);
            }
        },

        cancelar_editor_participante: function() {
            $('#dialog_editar_participante').modal('hide');
        },

        guardar_participante: function(participante, modify) {
            $('#dialog_editar_participante').modal('hide');
            console.dir(participante);
            var batch_id = this.model.get('batch_id');
            var self = this;
            if(modify) {
                this.service_update.fetch({
                    url: '/admin/participants/update_record/'+batch_id,
                    data: participante.toJSON(), 
                    success: function() {
                        location.reload();
                    }
                }); 
            } else {
                this.service_batch.fetch({
                    url: '/admin/participants/add_record/'+batch_id,
                    data: participante.toJSON(), 
                    success: function() {
                        location.reload();
                    }
                }); 
            }
        },

        do_eliminar_registro: function(e) {
            var batch_id = this.model.get('batch_id');
            console.log('eliminar');
            console.log(e.currentTarget.id);
            var participante = this.datasource.get_participant(e.currentTarget.id);
            console.dir(participante.toJSON());
            this.service_delete.fetch({
                url: '/admin/participants/remove_record/'+batch_id,
                data: participante.toJSON(), 
                success: function() {
                    location.reload();
                }
            });
        },

        do_modificar_registro: function(e) {
            console.log('modificar');
            console.log(e.currentTarget.id);
            var participante = this.datasource.get_participant(e.currentTarget.id);
            console.dir(participante.toJSON());
            this.instantiate_editor_registro();
            $('#dialog_editar_participante').modal({
                show: true    
            });
            Admin.editor_participante.reset({
                participant: participante,
                definitions: this.datasource.column_definitions
            });

        }
 
    });

    Admin.ParticipantEditRecord = Uif.View.extend({

        events: {
            'click #button_guardar_participante': 'do_guardar',
            'click #button_cancelar_edicion': 'do_cancelar',
            'change .campo': 'establecer_valor_campo'
        },

        initialize: function() {
            _.bindAll(this, 'do_guardar',  'reset', 'do_cancelar', 'establecer_valor_campo');
            this.modify = false;
            this.model = new Uif.Model;
        },

        reset: function(options) {
            this.model.clear();
            this.modify = false;
            $('.campo').val('').change();
            if(typeof(options) != 'undefined') {
                var participant = options.participant,
                    definitions = options.definitions;
                this.modify = true;
                _.each(definitions.models, function(model) {
                     var name = model.get('name');
                     $('#'+name).attr('value', participant.get(name)).change();
                });
 
            }
        },

        do_guardar: function() {
            this.trigger('guardar_participante', this.model, this.modify);
        },

        do_cancelar: function() {
            this.trigger('cancelar_participante');
        },

        establecer_valor_campo: function(e) {
            var map = {};
            map[e.target.name] = e.target.value;
            this.model.set(map);            
        } 


    });

    Admin.ParticipantsDatasource = Uif.View.extend({
        initialize: function() {

            _.bindAll(this, 'reset', 'init', 'columns', 'data', 'get_participant');
            this.participants = new Uif.Collection;
            this.participants.toJSON = function(options) {
                return this.map(function(model){ 
                    var attributes_extended = _.clone(model.attributes);
                    attributes_extended.id = model.cid;
                    return attributes_extended;
                });
            };
            this.column_definitions = new Uif.Collection;
            this._columns = [];
            this._data = [];
        },

        reset: function(batch) {
            this.column_definitions.reset(batch.get('definicion_columnas'));
            this.participants.reset(batch.get('participants'));
            this._data = this.participants.toJSON();
            var self = this;

            _.each(this.column_definitions.models, function(model) {
                self._columns.push({
                     property: model.get('name'),
                     label: model.get('name'),
                     sortable: true
                });
            });

            self._columns.push({
                 action: true,
                 action_label: 'eliminar',
                 label: 'Eliminar',
                 icon: 'icon-remove',
                 id: 'id'
            });

            self._columns.push({
                 action: true,
                 action_label: 'modificar',
                 label: 'Modificar',
                 icon: 'icon-edit',
                 id: 'id'
            });

            this.init({
                // function formatter
                delay: 0
            });
        },

        init: function(options) {
            this._formatter = options.formatter;
            this._delay = options.delay || 0;
        },


		columns: function () {
			return this._columns;
		},

        get_participant: function(id) {
            var participant = _.find(this.participants.models, function(model) {
                return model.cid == id;
            });
            return participant;
        },

		data: function (options, callback) {
			var self = this;

			setTimeout(function () {
				var data = $.extend(true, [], self._data);

				// SEARCHING
				if (options.search) {
					data = _.filter(data, function (item) {
						for (var prop in item) {
							if (!item.hasOwnProperty(prop)) continue;
							if (~item[prop].toString().toLowerCase().indexOf(options.search.toLowerCase())) return true;
						}
						return false;
					});
				}

				var count = data.length;

				// SORTING
				if (options.sortProperty) {
					data = _.sortBy(data, options.sortProperty);
					if (options.sortDirection === 'desc') data.reverse();
				}

				// PAGING
				var startIndex = options.pageIndex * options.pageSize;
				var endIndex = startIndex + options.pageSize;
				var end = (endIndex > count) ? count : endIndex;
				var pages = Math.ceil(count / options.pageSize);
				var page = options.pageIndex + 1;
				var start = startIndex + 1;

				data = data.slice(startIndex, endIndex);

				if (self._formatter) self._formatter(data);

				callback({ data: data, start: start, end: end, count: count, pages: pages, page: page });

			}, this._delay);
		}
    });



}).call(this);

