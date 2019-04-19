

var pie = new d3pie("myPie", {
	"header": {
		"title": {
			"text": "Boston 311 Medium of Calls",
			"fontSize": 26,
			"font": "open sans"
		},
		"subtitle": {
			"text": "How Bostonians request 311 services",
			"color": "#999999",
			"fontSize": 15,
			"font": "open sans"
		},
		"titleSubtitlePadding": 11
	},
	"footer": {
		"color": "#999999",
		"fontSize": 10,
		"font": "open sans",
		"location": "bottom-left"
	},
	"size": {
		"canvasHeight": 700,
		"canvasWidth": 800,
		"pieOuterRadius": "94%"
	},
	"data": {
		"content": [
			{
				"label": "Citizen Connect App",
				"value": 330570,
				"color": "#01c9ff"
			},
			{
				"label": "City Worker App",
				"value": 110319,
				"color": "#097bee"
			},
			{
				"label": "Constituent Calls",
				"value": 459601,
				"color": "#ffd009"
			},
			{
				"label": "Employee Generated",
				"value": 72299,
				"color": "#ff00dd"
			},
			{
				"label": "Maximo Integration",
				"value": 4104,
				"color": "#990000"
			},
			{
				"label": "Self Service",
				"value": 70124,
				"color": "#07fdac"
			},
			{
				"label": "Twitter",
				"value": 1558,
				"color": "#65cc32"
			}
		]
	},
	"labels": {
		"outer": {
			"pieDistance": 32
		},
		"inner": {
			"hideWhenLessThanPercentage": 1
		},
		"mainLabel": {
			"fontSize": 14
		},
		"percentage": {
			"color": "#ffffff",
			"fontSize": 17,
			"decimalPlaces": 1
		},
		"value": {
			"color": "#ffffff",
			"fontSize": 13
		},
		"lines": {
			"enabled": true
		},
		"truncation": {
			"enabled": true
		}
	},
	"tooltips": {
		"enabled": true,
		"type": "placeholder",
		"string": "{label}: {percentage}%, {value} calls",
		"styles": {
			"backgroundColor": "#13e4f8",
			"backgroundOpacity": 0.71,
			"color": "#030303",
			"fontSize": 14
		}
	},
	"effects": {
		"pullOutSegmentOnClick": {
			"effect": "linear",
			"speed": 400,
			"size": 8
		}
	},
	"misc": {
		"gradient": {
			"enabled": true,
			"percentage": 100
		}
	}
});
