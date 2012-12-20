Ext.define('Todo.controller.Tasks', {
	extend: 'Ext.app.Controller',

	models: [ 'Task' ],

	stores: [ 'Tasks' ],

	views: 	[ 'TaskList' ],

	refs: [
		{ ref: 'taskList',    	selector: 'taskList'},
		{ ref: 'toggleAll', 	selector: 'button[action=toggleAll]'},
		{ ref: 'clearButton', 	selector: 'button[action=clearCompleted]'},
		{ ref: 'toolBar',	  	selector: 'container[cls=footer]' },
		{ ref: 'itemsLeft',   	selector: 'container[name=itemsLeft]' },
		{ ref: 'todoeditor', 	selector: 'todoeditor', xtype: 'todoeditor', autoCreate: true }
	],

	init: function() {

		this.control({
			'todoeditor' : {
				'complete'		: this.onCompleteEdit
			},
			'taskList' : {
				'todoChecked' 	: this.onTodoChecked,
				'itemdblclick' 	: this.onTodoDblClicked,
				'removeItem'	: this.onTodoRemoveItem
			},
			'textfield[name=newtask]' : {
				'keyup'			: this.onTaskFieldKeyup
			},
			'button[action=clearCompleted]': {
				'click'			: this.onClearButtonClick
			},
			'button[action=toggleAll]': {
				'toggle'		: this.onCheckAllClick
			},
			'button[action=changeView]': {
				click: function(btn) {
					var btns =  Ext.ComponentQuery.query('button[action=changeView]');

					Ext.each(btns, function(x) {
						x.getEl().down('span').applyStyles({ 'text-align': 'center', 'font-weight': x == btn ? 'bold' : 'normal'});
					});
				}
			}
		});

		this.store = this.getTasksStore();

		this.store.on({
			load		: this.onStoreDataChanged,
			update		: this.onStoreDataChanged,
			datachanged : this.onStoreDataChanged,
			scope 		: this
		});
	},

	onTaskFieldKeyup: function( field, event ) {
		var ENTER_KEY_CODE = 13,
			value = field.getValue().trim();

		if (event.keyCode === ENTER_KEY_CODE && value !== '') {
			this.store.add({label: value, checked: false});
			this.store.filter();
			this.store.sync();
			field.reset();
		}
	},

	onTodoChecked: function( record ) {
		record.set('checked', !record.get('checked'));
		this.store.filter();
		this.store.sync();
		record.commit();
	},

	onTodoDblClicked: function ( list, record, el ) {
		var editor = this.getTodoeditor(),
			label = Ext.get(el).down('label');

		editor.activeRecord = record;
//		editor.activeRecord.set('editing', true);
//		this.getTasksStore().sync();
		editor.startEdit(label, record.data['label']);
	},

	onCompleteEdit: function( editor, value ) {
		var value = value.trim();

    	if ( !value ) {
    		this.store.remove(editor.activeRecord);
    	}
    	else {
    		editor.activeRecord.set({
    			'label' 	: value,
    			'editing' 	: false
    		});
    	}
        this.store.sync();
	},

	onTodoRemoveItem: function (record) {
		this.store.remove(record);
		this.store.sync();
	},

	onClearButtonClick: function() {
		var records = [],
			store = this.store;

		store.each(function(record) {
			if (record.get('checked')) {
				records.push(record);
			}
		});
		store.remove(records);
		store.sync();
	},

	onCheckAllClick: function(cb, newValue, oldValue, opts) {
		var store = this.store;

		store.suspendEvents();
		store.each(function(record) {
			record.set('checked', newValue);
		});
		store.resumeEvents();
		store.sync();
	},

	onStoreDataChanged: function() {
		var me 			= this,
			info 		= '', 
			text 		= '',
			toolbar 	= me.getToolBar(),
			tasklist 	= me.getTaskList(),
			store 		= me.getTasksStore(),
			button 		= me.getClearButton(),
			toggleAll 	= me.getToggleAll(),
			itemsLeft 	= me.getItemsLeft(),

			totalCount  = store.queryBy(function(record) {
				return true;
			}).getCount(),

			activeCount = store.queryBy(function(record) {
				return !record.get('checked');
			}).getCount(),

			completedCount	= totalCount - activeCount;

		if (completedCount) {
			text = 'Clear completed ('+ completedCount +')';
		}

		toggleAll.setVisible(totalCount);
		toggleAll.toggle(activeCount == 0, true);

		button.setText(text);
		button.setVisible(completedCount);

		itemsLeft.update({ counts: activeCount });
		toolbar.setVisible(totalCount);	
	}
});