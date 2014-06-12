Ext.define('MyApp.view.ux.Indicator', {
	extend : 'Ext.Container',
	xtype : 'wizindicator',
	title : 'Indicator Highlighter',
	initComponent : function() {
		this.mainLayoutId = Ext.id();
		if (Ext.isEmpty(this.indicatorItems)) {
			this.indicatorItems = ['Indicator0', 'Indicator1', 'Indicator2',
					'Indicator3', 'Indicator4'];
		}
		this.indicators = [];
		Ext.apply(this, {
					html : '<div id="' + this.mainLayoutId
							+ '" style="margin-left: 20px;"></div>'
				});
		this.callParent(arguments);
	},
	listeners : {
		'afterrender' : function(mainLayout, eOpts) {
			this.renderDiagrammer(mainLayout);
		}
	},
	renderDiagrammer : function(mainLayout) {
		if (!mxClient.isBrowserSupported()) {
			mxUtils.error('Browser is not supported!', 200, false);
		} else {
			var graph = new mxGraph(document
					.getElementById(mainLayout.mainLayoutId));
			mainLayout.graph = graph;
			graph.setEnabled(false);
			graph.getStylesheet().putCellStyle('indicator-style',
					mainLayout.getIndicatorStyle(graph));
			graph.setHtmlLabels(true);
			graph.isCellFoldable = function(cell) {
				return false;
			}
			if (!Ext.isEmpty(this.indicatorItems)) {
				for (var i = 0; i < mainLayout.indicatorItems.length; i++) {
					var indicator = mainLayout.createIndicator(i,
							mainLayout.indicatorItems[i], graph, mainLayout);
					this.indicators.push(indicator);

				}
			}
			this.createEdges(mainLayout.indicators, graph);
			this.executeLayout(graph);
		}
	},
	getIndicatorStyle : function(graph) {
		var indicatorStyle = graph.getStylesheet().getDefaultVertexStyle();
		delete indicatorStyle[mxConstants.STYLE_STROKECOLOR];
		delete indicatorStyle[mxConstants.STYLE_FILLCOLOR];
		indicatorStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
		indicatorStyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
		indicatorStyle[mxConstants.STYLE_STROKECOLOR] = '#d3d3d3';
		return indicatorStyle;
	},
	executeLayout : function(graph) {
		graph.getModel().beginUpdate();
		var layout = new mxHierarchicalLayout(graph,
				mxConstants.DIRECTION_WEST, false);
		try {
			layout.execute(graph.getDefaultParent());
		} finally {
			graph.getModel().endUpdate();
		}
	},
	createIndicator : function(index, name, graph, mainLayout) {
		if (index === 0) {
			// TODO to fix Hierachical layout initial point
			var labelXPos = 1.8;
		} else {
			var labelXPos = 0.5;
		}
		graph.getModel().beginUpdate();
		try {
			var indicatorSize = mainLayout.indicatorSize | 20;
			var vertex = graph.insertVertex(graph.getDefaultParent(), null,
					index, 0, 0, indicatorSize, indicatorSize);
			var vertexSecondaryLabel = graph
					.insertVertex(vertex, null, name, labelXPos, 1, 0, 0,
							'align=center;verticalAlign=top;', true);
		} finally {
			graph.getModel().endUpdate();
		}
		var indicator = new Indicator(index, name, vertex);
		return indicator;
	},
	createEdges : function(indicators, graph) {
		var edgeStyle = 'startArrow=none;endArrow=none;strokeWidth=6;strokeColor=#d3d3d3';
		if (!Ext.isEmpty(indicators)) {
			for (var i = 1; i < indicators.length; i++) {
				graph.getModel().beginUpdate();
				try {
					var edge = graph.insertEdge(graph.getDefaultParent(), null,
							null, indicators[i - 1].vertex,
							indicators[i].vertex, edgeStyle);
				} finally {
					graph.getModel().endUpdate();
				}
			}
		}
	},
	highlightIndicator : function(index) {
		if (!Ext.isEmpty(this.indicators) && index <= this.indicators.length) {
			var highlightStyle = 'fillColor=#A3C0EE';
			for (var i = 0; i < this.indicators.length; i++) {
				if (i === index) {
					this.graph.getModel().setStyle(this.indicators[i].vertex,
							highlightStyle);
				} else {
					this.graph.getModel().setStyle(this.indicators[i].vertex,
							null);
				}
			}
		} else {
			console.error('Index out of bound');
		}
	}
});
function Indicator(id, name, vertex) {
	this.id = id;
	this.name = name;
	this.vertex = vertex;
}
