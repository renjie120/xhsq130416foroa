Ext.onReady(function() {
			// 复选框
			var sm = new Ext.grid.CheckboxSelectionModel();

			// 定义自动当前页行号
			var rownum = new Ext.grid.RowNumberer({
						header : 'NO',
						width : 28
					});

			// 定义列模型
			var cm = new Ext.grid.ColumnModel([rownum, sm, {
						header : '新建任务', // 列标题
						dataIndex : 'edit',
						width : 50,
						renderer : iconColumnRender
					}, {
						header : '任务类别名称', // 列标题
						dataIndex : 'name', // 数据索引:和Store模型对应
						sortable : true,
						width : 200
						// 是否可排序
				}	, {
						header : '版本',
						dataIndex : 'version',
						width : 150
						// 列宽
				}	, {
						header : '任务发布id',
						hidden : true, // 隐藏列
						dataIndex : 'deploymentId',
						width : 150
						// 列宽
				},{
						header : '任务发布id',
						hidden : true, // 隐藏列
						dataIndex : 'deploymentId',
						width : 150
						// 列宽
				}	, {
						header : '任务类别id',
						dataIndex : 'id',
						width : 100
					}]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store({
						// 获取数据的方式
						proxy : new Ext.data.HttpProxy({
									url : 'workflow.do?reqCode=initWorkflowList'
								}),
						// 数据读取器
						reader : new Ext.data.JsonReader({
									totalProperty : 'TOTALCOUNT', // 记录总数
									root : 'ROOT' // Json中的列表数据根节点
								}, [{
											name : 'name' // Json中的属性Key值
										}, {
											name : 'version'
										}, {
											name : 'deploymentId'
										}, {
											name : 'id'
										}])
					});

			// 翻页排序时带上查询条件
			store.on('beforeload', function() {
						this.baseParams = {
							xmmc : Ext.getCmp('name').getValue()
						};
					});
			// 每页显示条数下拉选择框
			var pagesize_combo = new Ext.form.ComboBox({
						name : 'pagesize',
						triggerAction : 'all',
						mode : 'local',
						store : new Ext.data.ArrayStore({
									fields : ['value', 'text'],
									data : [[10, '10条/页'], [20, '20条/页'],
											[50, '50条/页'], [100, '100条/页'],
											[250, '250条/页'], [500, '500条/页']]
								}),
						valueField : 'value',
						displayField : 'text',
						value : '20',
						editable : false,
						width : 85
					});
			var number = parseInt(pagesize_combo.getValue());
			// 改变每页显示条数reload数据
			pagesize_combo.on("select", function(comboBox) {
						bbar.pageSize = parseInt(comboBox.getValue());
						number = parseInt(comboBox.getValue());
						store.reload({
									params : {
										start : 0,
										limit : bbar.pageSize
									}
								});
					});

			// 分页工具栏
			var bbar = new Ext.PagingToolbar({
						pageSize : number,
						store : store,
						displayInfo : true,
						displayMsg : '显示{0}条到{1}条,共{2}条',
						plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
						emptyMsg : "没有符合条件的记录",
						items : ['-', '&nbsp;&nbsp;', pagesize_combo]
					});

			// 表格工具栏
			var tbar = new Ext.Toolbar({
						items : [{
									xtype : 'textfield',
									id : 'name',
									name : 'name',
									emptyText : '请输入流程名称',
									width : 150,
									enableKeyEvents : true,
									// 响应回车键
									listeners : {
										specialkey : function(field, e) {
											if (e.getKey() == Ext.EventObject.ENTER) {
												queryCatalogItem();
											}
										}
									}
								}, {
									text : '查询',
									iconCls : 'page_findIcon',
									handler : function() {
										queryCatalogItem();
									}
								}, '-', {
									text : '新增',
									iconCls : 'page_addIcon',
									handler : function() {
										ininEditCodeWindow();
									}
								}, '-', {
									text : '修改',
									iconCls : 'page_edit_1Icon',
									handler : function() {
										ininEditCodeWindow();
									}
								}, '-', {
									text : '删除',
									iconCls : 'page_delIcon',
									handler : function() {
										deleteCodeItems();
									}
								}, '-', {
									text : '刷新',
									iconCls : 'page_refreshIcon',
									handler : function() {
										store.reload();
									}
								}, '-', {
									text : '获取选择行',
									handler : function() {
										getCheckboxValues();
									}
								}]
					});

			// 表格右键菜单
			var contextmenu = new Ext.menu.Menu({
						id : 'theContextMenu',
						items : [{
							text : '查看详情',
							iconCls : 'previewIcon',
							handler : function() {
								// 获取当前选择行对象
								var record = grid.getSelectionModel()
										.getSelected();
								var xmmc = record.get('id');
								Ext.MessageBox.alert('提示', xmmc);
							}
						}, {
							text : '导出列表',
							iconCls : 'page_excelIcon',
							handler : function() {
								// 获取当前选择行对象
								var record = grid.getSelectionModel()
										.getSelected();
								var xmmc = record.get('id');
								Ext.MessageBox.alert('提示', xmmc);
							}
						}]
					});
			var editCodeWindow, editCodeFormPanel;
			editCodeFormPanel = new Ext.form.FormPanel({
						labelAlign : 'right',
						labelWidth : 60,
						defaultType : 'textfield',
						frame : false,
						bodyStyle : 'padding:5 5 0',
						id : 'editCodeFormPanel',
						name : 'editCodeFormPanel',
						items : [{
									fieldLabel : '任务类别',
									name : 'name',
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : false
								}, {
									fieldLabel : '版本',
									name : 'version',
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : false
								}, {
									xtype : 'numberfield',
									fieldLabel : '代码',
									name : 'code',
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : false
								}, {
									fieldLabel : '代码描述',
									name : 'codedesc',
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : false
								}, enabledCombo_E, editmodeCombo_E, {
									fieldLabel : '备注',
									name : 'remark',
									anchor : '100%',
									allowBlank : true
								}, {
									fieldLabel : '代码编号',
									name : 'codeid',
									anchor : '100%',
									hidden : true,
									hideLabel : true
								}]
					});

			editCodeWindow = new Ext.Window({
						layout : 'fit',
						width : 300,
						height : 273,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						title : '<span class="commoncss">修改字典</span>',
						modal : true,
						collapsible : true,
						titleCollapse : true,
						maximizable : false,
						buttonAlign : 'right',
						border : false,
						animCollapse : true,
						animateTarget : Ext.getBody(),
						constrain : true,
						items : [editCodeFormPanel],
						buttons : [{
							text : '保存',
							iconCls : 'acceptIcon',
							handler : function() {
								if (runMode == '0') {
									Ext.Msg
											.alert('提示',
													'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
									return;
								}
								updateCodeItem();
							}
						}, {
							text : '关闭',
							iconCls : 'deleteIcon',
							handler : function() {
								editCodeWindow.hide();
							}
						}]

					});
			// 表格实例
			var grid = new Ext.grid.GridPanel({
						// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
						title : '<span class="commoncss">已经部署流程列表</span>',
						height : 500,
						frame : true,
						autoScroll : true,
						region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
						store : store, // 数据存储
						stripeRows : true, // 斑马线
						cm : cm, // 列模型
						sm : sm, // 复选框
						tbar : tbar, // 表格工具栏
						bbar : bbar,// 分页工具栏
						viewConfig : {
			// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
						// forceFit : true
						},
						loadMask : {
							msg : '正在加载表格数据,请稍等...'
						}
					});
			store.load({
						params : {
							start : 0,
							limit : bbar.pageSize
						}
					});
			// 是否默认选中第一行数据
			bbar.on("change", function() {
						// grid.getSelectionModel().selectFirstRow();

					});

			// 监听单元格双击事件
			grid.addListener('rowdblclick', ininEditCodeWindow);

			// 给表格绑定右键菜单
			grid.on("rowcontextmenu", function(grid, rowIndex, e) {
						e.preventDefault(); // 拦截默认右键事件
						grid.getSelectionModel().selectRow(rowIndex); // 选中当前行
						contextmenu.showAt(e.getXY());
					});

			// 布局模型
			var viewport = new Ext.Viewport({
						layout : 'border',
						items : [grid]
					});

			// 查询表格数据
			function queryCatalogItem() {
				store.load({
							params : {
								start : 0,
								limit : bbar.pageSize,
								xmmc : Ext.getCmp('name').getValue()
							}
						});
			}

			// 获取选择行
			function getCheckboxValues() {
				// 返回一个行集合JS数组
				var rows = grid.getSelectionModel().getSelections();
				if (Ext.isEmpty(rows)) {
					Ext.MessageBox.alert('提示', '您没有选中任何数据!');
					return;
				}
				// 将JS数组中的行级主键，生成以,分隔的字符串
				var strChecked = jsArray2JsString(rows, 'name');
				Ext.MessageBox.alert('提示', strChecked);
				// 获得选中数据后则可以传入后台继续处理
			}

			// 生成一个图标列
			function iconColumnRender(value) {
				return "<a href='javascript:void(0);'><img src='" + webContext
						+ "/resource/image/ext/edit1.png'/></a>";;
			}

			function ininEditCodeWindow() {
				var record = grid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.Msg.alert('提示', '请先选中要修改的任务类别');
					return;
				}
				record = grid.getSelectionModel().getSelected();
				editCodeWindow.show();
				editCodeFormPanel.getForm().loadRecord(record);
			}

		});
