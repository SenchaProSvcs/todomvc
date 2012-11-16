Ext.Loader.setConfig({
	enabled:true
});

Ext.application({
	name: 'Todo',
	appFolder: 'js',

	stores: [ 'Tasks' ],

	controllers: ['Tasks'],

	launch: function() {

		Ext.create('Todo.view.Main'),

		this.getTasksStore().load();

		Ext.History.init(function(history) {
			this.setRoute(history.getToken());
		}, this);

		Ext.History.on('change', this.setRoute, this);

	},

	setRoute: function(token) {
		var store = this.getTasksStore();

		store.clearFilter();

		switch (token) {
			case '/' : 
				break;
			case '/active': 
				store.filter('checked', false);
				break;
			case '/completed':
				store.filter('checked', true);
				break;
		}
	}
});
