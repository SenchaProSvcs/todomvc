Ext.define('Ext.ux.DataView.LabelEditor', {
    extend : 'Ext.Editor',
    alias: 'widget.todoeditor',

    alignment : 'tl-tl',
    completeOnEnter : true,
    cancelOnEsc : true,
    itemSelector : 'label',
    shim : false,

    autoSize: {
		width : 'boundEl',
        height : 'boundEl'
    },

    requires: [
        'Ext.form.field.Text'
    ],

    constructor: function(config) {
        config.field = config.field || Ext.create('Ext.form.field.Text', {
            baseCls:null,
            cls: 'todo-list',
            allowOnlyWhitespace: false,
            selectOnFocus:true
        });
        this.callParent([config]);
    },

    init: function(view) {
        this.view = view;
    }

});

Ext.define('Todo.view.TaskList' , {
	extend: 'Ext.view.View',
	alias: 'widget.taskList',

	store: 'Tasks',
	loadMask: false,
	itemSelector: 'li',
    autoEl: 'ul',
	
	tpl: Ext.create('Ext.XTemplate',
       	'<tpl for=".">',
		'<li class="<tpl if="checked">completed</tpl> <tpl if="editing">editing</tpl>">',
		'<div class="view">',
		'<input type="checkbox" class="toggle" <tpl if="checked">checked</tpl> /> ',
		'<label>{label}</label>',
		'<a class="destroy"></a>',
		'</li>',
        '</div>',
        '</tpl>',
		{ compiled: true }
	),

  	plugins: [
       	Ext.create('Ext.ux.DataView.LabelEditor', {dataIndex: 'label'})
   	],

	listeners: {
		render: function () {
			this.el.on('click', function (clickEvent, el) {
				var extEl = Ext.get(el)
				  , parent;
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
				  setTimeout(function () { self.fireEvent('todoRemoveSelected', record); }, 1);
			}, this, {
				delegate: 'a'
			});
		}
	}
});
