Ext.define('Ext.ux.DataView.LabelEditor', {
    extend : 'Ext.Editor',

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
            allowOnlyWhitespace: false,
            selectOnFocus:true
        });
        this.callParent([config]);
    },

    init: function(view) {
        this.view = view;
        this.mon(view, 'render', this.bindEvents, this);
        this.on('complete', this.onSave, this);
    },

    // initialize events
    bindEvents: function() {
        this.mon(this.view.getEl(), {
            dblclick: {
                fn: this.onClick,
                scope: this
            }
        });
    },

    // on mousedown show editor
    onClick: function(e, target) {
        var me = this,
            item, record;

        if (Ext.fly(target).is(me.itemSelector) && !me.editing && !e.ctrlKey && !e.shiftKey) {
            e.stopEvent();
            item = me.view.findItemByChild(target);
            record = me.view.store.getAt(me.view.indexOf(item));
            me.startEdit(target, record.data[me.dataIndex]);
            me.activeRecord = record;
//            me.activeRecord.set('editing', true);
        } else if (me.editing) {
            me.field.blur();
	        e.preventDefault();
        }
    },

    // update record
    onSave: function(ed, value) {
    	if (!value) {
    		this.view.store.remove(this.activeRecord);
    	}
    	else {
	        this.activeRecord.set(this.dataIndex, value);
//    	    this.activeRecord.set('editing', false);
    	}
        this.view.store.sync();
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
