(function(){

    var self = this;

    if (typeof Admin == 'undefined') {
        Admin = self.Admin = {};
    }

    Admin.EditProcessParticipants = Uif.View.extend({
        el: $('#edit_process_participants'),

        events: {
            'click .batch_preview': 'preview_batch',
            'click #button_batch_cancelar': 'do_cancel',
            'click #button_batch_asociar': 'do_asociar'
        },

        initialize: function(options) {
            _.bindAll(this, 'render', 'preview_batch', 'get_data_source', 'process_participants', 'do_cancel', 'do_asociar', 'process_asociacion', 'asociar_batch');
            this.model = new Uif.Model;
            this.service_batch = new Uif.Model;
            this.service_associate_batch = new Uif.Model;
            console.log('inicializando');
            this.render();
        },

        render: function() {
            this.setup_components();
            this.setup_servicios();
            this.setup_bindings();
        },

        reset: function(options) {
            this.model.unset('batch_id');
            if(typeof(options) != 'undefined') {
                this.model.set({
                    codigo_proceso: options.codigo_proceso
                });
                $('#row_'+options.batch_id).toggleClass('success', true);
            }
            $('#batch_list').css('display', 'block');
            $('#batch_preview').css('display', 'none');
            $('#batch_actions').css('display', 'none');
        },

        do_cancel: function() {
            console.log('do cancel');
            this.reset();
        },

        do_asociar: function() {
            var self = this;
            bootbox.confirm("Desea asociar el lote seleccionado al proceso?", function(confirmed) {
                if(confirmed) {
                    self.asociar_batch();
                }
            });
        },

        asociar_batch: function() {
           this.service_associate_batch.fetch({
                url: '/admin/participants/associate_batch_process',
                data: {
                    batch_id: this.model.get('batch_id'),
                    process_code: this.model.get('codigo_proceso')
                }, 
                success: this.process_asociacion
           }); 
        },

        process_asociacion: function(response) {
            $('#row_'+this.model.get('batch_id')).toggleClass('success', true);
            this.reset();
        },

        setup_components: function() {
            var self = this;

            this.datasource = new Admin.ParticipantsDatasource({

            });

        },

        setup_servicios: function() {

        },

        setup_bindings: function() {

        },

        preview_batch: function(e) {
            var batch_id = e.target.value;
            $('#batch_list').css('display', 'none');
            $('#batch_preview').css('display', 'block');
            $('#batch_actions').css('display', 'block');
            this.model.set({
                batch_id: batch_id
            });
            console.log('batch_id: '+batch_id);
            this.get_data_source(batch_id);
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
        } 

    });

    Admin.ParticipantsDatasource = Uif.View.extend({
        initialize: function() {

            _.bindAll(this, 'reset', 'init', 'columns', 'data');
            this.participants = new Uif.Collection;
            this.column_definitions = new Uif.Collection;
            this._columns = [];
            this._data = [];
        },

        reset: function(batch) {
            this.column_definitions.reset(batch.get('definicion_columnas'));
            this._data = batch.get('participants');
            this.participants.reset(this._data);
            var self = this;
            _.each(this.column_definitions.models, function(model) {
                self._columns.push({
                     property: model.get('name'),
                     label: model.get('name'),
                     sortable: true
                });
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


