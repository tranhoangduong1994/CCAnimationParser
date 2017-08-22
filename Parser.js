var curves = {

	"cubicIn": "cc.easeCubicActionIn",
	"quadIn": "cc.easeQuadraticActionIn",
	"quartIn": "cc.easeQuarticActionIn",
	"quintIn": "cc.easeQuinticActionIn",
	"sineIn": "cc.easeSineIn",
	"expoIn": "cc.easeExponentialIn",
	"circIn": "cc.easeCircleActionIn",

	"cubicOut": "cc.easeCubicActionOut",
	"quadOut": "cc.easeQuadraticActionOut",
	"quartOut": "cc.easeQuarticActionOut",
	"quintOut": "cc.easeQuinticActionOut",
	"sineOut": "cc.easeSineOut",
	"expoOut": "cc.easeExponentialOut",
	"circOut": "cc.easeCircleActionOut",

	"cubicInOut": "cc.easeCubicActionInOut",
	"quadInOut": "cc.easeQuadraticActionInOut",
	"quartInOut": "cc.easeQuarticActionInOut",
	"quintInOut": "cc.easeQuinticActionInOut",
	"sineInOut": "cc.easeSineInOut",
	"expoInOut": "cc.easeExponentialInOut",
	"circInOut": "cc.easeCircleActionInOut"

};

var actions = {
	"position": "cc.moveTo",
	"scaleX": "cc.scaleTo",
	"scaleY": "cc.scaleTo",
	"rotation": "cc.rorateTo",
	"opacity": "cc.fadeTo"
};

function doMinus(obj1, obj2) {
	var result;
	if (typeof obj1 == "number" && typeof obj2 == "number") {
		result = obj1 - obj2;
		return result;
	} 
	if (obj1 instanceof Array && obj2 instanceof Array && obj1.length == obj2.length) {
		result = [];
		for (var i = 0; i < obj1.length; i++) {
			if (typeof obj1[i] == "number" && typeof obj2[i] == "number") {
				result.push(obj1[i] - obj2[i]);
			} else {
				break;
			}
		}
		return result;
	}
	console.log("Parameters not valid");
	console.assert(false);
}

function convertAnimToJs(paths) {
	try {
		paths = JSON.parse(paths);
	} catch (e) {
		// console.log(e);
	}
	var result = {};

	// var paths = searchKey(object, "paths");
	
	for (var name in paths) {
		result[name] = [];
		result[name].push(name + ".runAction(cc.spawn(")
		var pathObject = paths[name];

		var props = pathObject["props"];
		var actionKeys = Object.keys(props);//actionKeys: position, rotation, opacity, scaleX, scaleY
		for (var i = 0; i < actionKeys.length; i++) {
			var action = actionKeys[i];
			var property = props[action];
			var previousFrame = 0;

			if (property.length < 1) {
				continue;
			}
			var firstFrame = property[0]["frame"];
			result[name].push("cc.sequence(");
			if (firstFrame > 0) {
				result[name].push("cc.delayTime(" + property[0]["frame"] + "),");
			}

			for (var j = 0; j < property.length - 1; j++) {
				var currentMoment = property[j];
				var nextMoment = property[j + 1];
				var deltaFrame = (nextMoment["frame"] - currentMoment["frame"]).toFixed(2);
                var nextValue = nextMoment["value"];
				var curve = currentMoment["curve"]; 

				var newLine = "";

				if (action == "scaleX") {
					newLine = newLine.concat("h102.scaleXTo(" + deltaFrame + ", " + nextValue + ")");
				} else if (action == "scaleY") {
					newLine = newLine.concat("h102.scaleYTo(" + deltaFrame + ", " + nextValue + ")");
				} else if (action == "position") {
					newLine = newLine.concat("cc.moveTo(" + deltaFrame + ", cc.p(" + nextValue[0] + ", " + nextValue[1] + "))");
				} else if (action == "rotation") {
					newLine = newLine.concat("cc.rotateTo(" + deltaFrame + ", " + nextValue + ")");
				} else if (action == "opacity") {
					newLine = newLine.concat("cc.fadeTo(" + deltaFrame + ", " + nextMoment["value"] + ")");
				}

				if (curve) {
					if (typeof curve == "string") {
						newLine = newLine.concat(".easing(" + curves[curve] + "())");
					} else {
						newLine = newLine.concat(".easing(cc.easeBezierAction(0, " + curve[1] + ", " + curve[3] + ", 1))");
					}
				}

				if (j < property.length - 2) {
					newLine = newLine.concat(",");
				}

				result[name].push(newLine);
			}

			if (i < actionKeys.length - 1) {
				result[name].push("),");
			} else {
				result[name].push(")");
			}
		}

		result[name].push("));");
	}

	return result;
}

// //test
var exampleObject1 = {
    "mask-0": {
        "props": {
            "position": [
                {
                    "frame": 0.2,
                    "value": [
                        512,
                        332
                    ],
                    "curve": "circOut"
                },
                {
                    "frame": 0.7,
                    "value": [
                        512,
                        600
                    ]
                }
            ],
            "rotation": [
                {
                    "frame": 0.2,
                    "value": 0,
                    "curve": "circOut"
                },
                {
                    "frame": 0.7,
                    "value": 720
                }
            ],
            "opacity": [
                {
                    "frame": 0.2,
                    "value": 255
                },
                {
                    "frame": 0.7,
                    "value": 200
                },
                {
                    "frame": 1.7,
                    "value": 0
                }
            ]
        }
    },
    "mask-1": {
        "props": {
            "position": [
                {
                    "frame": 0.2,
                    "value": [
                        512,
                        332
                    ],
                    "curve": "circOut"
                },
                {
                    "frame": 0.7,
                    "value": [
                        312,
                        132
                    ]
                }
            ],
            "rotation": [
                {
                    "frame": 0.2,
                    "value": 0,
                    "curve": "circOut"
                },
                {
                    "frame": 0.7,
                    "value": 720
                }
            ],
            "opacity": [
                {
                    "frame": 0.2,
                    "value": 255
                },
                {
                    "frame": 0.7,
                    "value": 200
                },
                {
                    "frame": 1.7,
                    "value": 0
                }
            ]
        }
    },
    "mask-2": {
        "props": {
            "position": [
                {
                    "frame": 0.2,
                    "value": [
                        512,
                        332
                    ],
                    "curve": "circOut"
                },
                {
                    "frame": 0.7,
                    "value": [
                        712,
                        132
                    ]
                }
            ],
            "rotation": [
                {
                    "frame": 0.2,
                    "value": 0,
                    "curve": "circOut"
                },
                {
                    "frame": 0.7,
                    "value": 720
                }
            ],
            "opacity": [
                {
                    "frame": 0.2,
                    "value": 255
                },
                {
                    "frame": 0.7,
                    "value": 200
                },
                {
                    "frame": 1.7,
                    "value": 0
                }
            ]
        }
    }
};

var exampleObject2 = {
    "overlay1": {
        "props": {
            "opacity": [
                {
                    "frame": 0,
                    "value": 0
                },
                {
                    "frame": 0.16666666666666666,
                    "value": 150
                }
            ]
        }
    },
    "dialog1": {
        "props": {
            "opacity": [
                {
                    "frame": 0,
                    "value": 0
                },
                {
                    "frame": 0.23333333333333334,
                    "value": 255
                }
            ],
            "scaleX": [
                {
                    "frame": 0,
                    "value": 0.75,
                    "curve": "cubicOut"
                },
                {
                    "frame": 0.3333333333333333,
                    "value": 1.05,
                    "curve": [
                        0.41,
                        0.26,
                        0.5,
                        0.5
                    ]
                },
                {
                    "frame": 0.4,
                    "value": 1
                }
            ],
            "scaleY": [
                {
                    "frame": 0,
                    "value": 0.75,
                    "curve": "cubicOut"
                },
                {
                    "frame": 0.3333333333333333,
                    "value": 1.05,
                    "curve": [
                        0.41,
                        0.22,
                        0.5,
                        0.5
                    ]
                },
                {
                    "frame": 0.4,
                    "value": 1
                }
            ]
        }
    }
}

function getParsedString(object) {
	var parseResults = convertAnimToJs(object);
	var string = "";
	for (var result in parseResults) {
		var object = parseResults[result];
		string = string.concat(object[0] + "\n");
		for (var i = 1; i < object.length - 1; i++)	{
			if (object[i] == "cc.sequence(" || object[i] == ")" || object[i] == "),") {
				string = string.concat("\t" + object[i] + "\n");
			} else {
				string = string.concat("\t\t" + object[i] + "\n");
			}
		}
		string = string.concat(object[object.length - 1] + "\n\n");
	}
	return string;
}