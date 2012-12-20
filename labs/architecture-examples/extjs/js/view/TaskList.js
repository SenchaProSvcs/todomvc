Ext.define('Ext.ux.DataView.LabelEditor', {
    extend	: 'Ext.Editor',
    alias	: 'widget.todoeditor',

    dataIndex: 'label',
    renderTo: 'kevin', 

    autoSize: {
		width : 'boundEl',
        height : 'boundEl'
    },

	field: {
		xtype: 'textfield',
		allowOnlyWhitespace: false,
		selectOnFocus: true
	}
});

Ext.define('Todo.view.TaskList' , {
	extend	: 'Ext.view.View',
	alias	: 'widget.taskList',

	store		: 'Tasks',
	loadMask	: false,
	itemSelector: 'li',
	
	tpl: [ 
       	'<tpl for=".">',
			'<li class="<tpl if="checked">completed</tpl> <tpl if="editing">editing</tpl>">',
			'<div class="view">',
				'<input type="checkbox" class="toggle" <tpl if="checked">checked</tpl> /> ',
				'<label>{label}</label>',
				'<a class="destroy"></a>',
			'</div>',
			'</li>',
        '</tpl>',
		{ compiled: true }
	],

	listeners: {
		render: function (moi) {
			this.el.on('click', function (clickEvent, el) {
				var extEl = Ext.get(el),
					parent = extEl.parent('li');

				this.fireEvent('todoChecked', this.getRecord(parent));
			}, this, {
				delegate: 'input.toggle'
			});

			this.el.on('click', function (clickEvent, el) {
				var extEl = Ext.get(el)
				  , record = this.getRecord(extEl.parent('li'))
				  , self = this;

				  // Todo this is clearly not the best way to do this, but without this we get an error when
				  // the item that was clicked is removed.
				  setTimeout(function () { self.fireEvent('removeItem', record); }, 1);
			}, this, {
				delegate: 'a'
			});
		}
	}
});