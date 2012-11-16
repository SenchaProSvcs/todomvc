Ext.define('Todo.controller.Tasks', {
	extend: 'Ext.app.Controller',

	models: ['Task'],

	stores: ['Tasks'],

	views: ['TaskList' ],

	refs: [
		{ ref: 'taskList',    selector: 'taskList'},
		{ ref: 'checkAllBox', selector: 'button[inputId=toggle-all]'},
		{ ref: 'clearButton', selector: 'button[action=clearCompleted]'},
		{ ref: 'toolBar',	  selector: 'container[cls=footer]' },
		{ ref: 'itemsLeft',   selector: 'container[name=itemsLeft]' }
	],

	init: function() {
		this.control({
			'textfield[name=newtask]': {
				keyup: 				this.onTaskFieldKeyup
			},
			'taskList': {
				todoChecked: 		this.onTodoChecked,
//				itemdblclick: 		this.onTodoDblClicked,
//				onTaskEditKeyup: 	this.onTaskEditKeyup,
				todoRemoveSelected: this.onTodoRemoveSelected
			},
			'button[action=clearCompleted]': {
				click: 				this.onClearButtonClick
			},
			'button[inputId=toggle-all]': {
				toggle: 			this.onCheckAllClick
			}
		});

		this.getTasksStore().on({
			scope: this,
			load: this.onStoreDataChanged,
			update: this.onStoreDataChanged,
			datachanged: this.onStoreDataChanged
		});

	},

	onTaskFieldKeyup: function(field, event) {
		var ENTER_KEY_CODE = 13,
			value = field.getValue().trim();

		console.log("saving ....");
		if (event.keyCode === ENTER_KEY_CODE && value !== '') {
			var store = this.getTasksStore();
			store.add({label: value, checked: false});
			store.filter();
			store.sync();
			field.reset();
		}
	},

	onTodoChecked: function(record) {
		record.set('checked', !record.get('checked'));
		this.getTasksStore().sync();
		record.commit();
	},

	onTodoDblClicked: function (list, record, el) {
		record.set('editing', true);
		record.commit();
	},

	onTodoRemoveSelected: function (record) {
		var store = this.getTasksStore();
		store.remove(record);
		store.sync();
	},

	onTaskEditDeselect: function(event, record, extEl) {
		console.log("edit blur");
	},

	onTaskEditKeyup: function (event, record, extEl) {
		console.log("edit key up");
		var ENTER_KEY_CODE = 13;
		if (event.keyCode === ENTER_KEY_CODE) {
			this.finalizeTaskEdit(extEl, record);
		}
	},

	finalizeTaskEdit: function (extEl, record) {
		var value = extEl.getValue().trim();

		if (!value) {
			var store = this.getTasksStore();
			store.remove(record);
		} else {
			record.set('label', value);
			record.set('editing', false);
			this.getTasksStore().sync();
			record.commit();
		}
	},

	onClearButtonClick: function() {
		var records = [],
			store = this.getTasksStore();

		store.each(function(record) {
			if (record.get('checked')) {
				records.push(record);
			}
		});
		store.remove(records);
		store.sync();
	},

	onCheckAllClick: function(cb, newValue, oldValue, opts) {
		var store = this.getTasksStore();
console.log("toggled");
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

		this.getCheckAllBox().setVisible(totalCount);
		this.getCheckAllBox().toggle(activeCount == 0, true);

		button.setText(text);
		button.setVisible(completedCount);

		itemsLeft.update({ counts: activeCount });
		toolbar.setVisible(totalCount);	
	}

});
