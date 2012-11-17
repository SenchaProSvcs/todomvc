Ext.define('Todo.view.Main', {
	extend: 'Ext.container.Viewport',
	alias: 'widget.mainview',

	layout: {
		type: 'vbox',
		align: 'center'
	},

	autoScroll: true,

	defaults: {
		xtype: 'container',
		baseCls: null,
		width: 550
	},

	config: {
		items: [{
			cls: 'header',
			html: 'todos'
		},{
			cls: 'todoapp',
			items: [{
				baseCls: null,
				xtype: 'container',
				cls: 'new-todo',
				layout: 'hbox',
				items: [{
					xtype: 'button',
					ui: 'plain',
					cls: 'toggle-all-button',
					text: '»',
					width: 40,
					enableToggle: true,
					action: 'toggleAll'
				}, {
					flex:1,
					xtype: "textfield",
					fieldStyle: 'background-color: transparent;',
					name: 'newtask',
					enableKeyEvents: true,
					emptyText: "What needs to be done?"
				}]
			}, {
				baseCls: null,
				cls: 'todo-list',
				xtype: 'taskList'
			}]
		}, {
			baseCls: null,
			cls: 'footer',
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			items: [{
				flex: 1,
				baseCls: null,
				style: 'text-align: left;',
				name: 'itemsLeft',
				data: { counts: 0 },
				tpl: [
					'<tpl><span id="todo-count"><b>{counts}</b> item',
						'<tpl if="counts &gt; 1">s</tpl>',
						'<tpl if="counts == 0">s</tpl>',
					' left</span>',
					'</tpl>'
				]
			}, {
				flex: 1,
				xtype: 'container',
				baseCls: null,
				cls: 'filters',
				html: [
					'<li>',
						'<a class="selected" href="#/">All</a>',
					'</li>',
					'<li>',
						'<a href="#/active">Active</a>',
					'</li>',
					'<li>',
						'<a href="#/completed">Completed</a>',
					'</li>'
				].join("")
			}, {
				flex: 1,
				baseCls: null,
				xtype: 'container',
				items: [{
					xtype: 'button',
					baseCls: null,
					action: 'clearCompleted',
					cls: 'clear-completed',
					text: 'Clear completed'
				}]
			}]
		}, {
			cls: 'info',
			html: [
				'<p>Double-click to edit a todo</p>',
				'<p>Inspired by the official <a href="https://github.com/maccman/spine.todos">Spine.Todos</a></p>',
				'<p>Revised by Kevin Cassidy</p>'
			].join("")
		}]
	}
});
