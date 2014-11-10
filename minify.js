'use strict';

var esprima = require('esprima');
var escodegen = require('escodegen');
var estraverse = require('estraverse');
var requirejs = require('requirejs');
var uglifyjs = require('uglify-js');
var fs = require('fs');
var path = require('path');

var output = 'forge.js';
var outputMin = 'forge.min.js';

requirejs.optimize({
    baseUrl: 'node_modules/node-forge',
    include: [
        'js/hmac',
        'js/md',
        'js/util'
    ],
    exclude: [],
    out: output,
    wrap: {
        start: "(function(root){\nroot.forge={};\n",
        end: "\nangular.module('forge', ['ng']).factory('forge', function(){\nreturn root.forge;\n});\n}(this));"
    },
    optimize: 'none',
    preserveLicenseComments: false,
    generateSourceMaps: false,
    onBuildWrite: function (moduleName, path, contents) {
        var ast = esprima.parse(contents);
        var func = [];

        func.push("\n// " + moduleName + "\n(function(forge){");

        estraverse.traverse(ast, {
            enter: function (node, parent) {
                if (node.type === 'FunctionDeclaration' && node.id.name === 'initModule') {
                    var functionBody = node.body;
                    functionBody.body.forEach(function (expr) {
                        func.push(escodegen.generate(expr));
                    })
                }
                ;
            }
        });

        func.push("\n}(root.forge));\n");

        return func.join("\n");
    }
}, function (res) {
    console.log(res);

    var inputFile = path.resolve(__dirname, output);
    var outputFile = path.resolve(__dirname, outputMin);
    var outputMap = path.resolve(__dirname, outputMin + '.map');

    try {
        var compressed = uglifyjs.minify(inputFile, {
            outSourceMap: outputMap
        });
    } catch (err) {
        console.log(err);
        return -1;
    }

    fs.writeFile(outputFile, compressed.code, function (err) {
        if (err) console.log(err);
        else console.log(outputFile);
    });

    fs.writeFile(outputMap, compressed.map, function (err) {
        if (err) console.log(err);
        else console.log(outputFile);
    });
}, function (err) {
    console.log(err);
});