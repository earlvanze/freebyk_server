module.exports = function($app){
    var $path = require("path");
    var $models = require($path.resolve(__dirname, "../model-config.json"));
    var $datasources = require($path.resolve(__dirname, "../datasources.json"));

    function autoupdate_all(){
	Object.keys($models).forEach(function($key){
	    if(typeof $models[$key].dataSource != "undefined"){
		if(typeof $datasources[$models[$key].dataSource] != "undefined"){
		    $app.dataSources[$models[$key].dataSource].autoupdate($key, function($error){
			if($error){
			    throw $error;
			}
			console.log("Model " + $key + " updated");
		    });
		}
	    }
	});
    }

    function automigrate_all(){
	Object.keys($models).forEach(function($key){
	    if(typeof $models[$key].dataSource != "undefined"){
		if(typeof $datasources[$models[$key].dataSource] != "undefined"){
		    $app.dataSources[$models[$key].dataSource].automigrate($key, function($error){
			if($error){
			    throw $error;
			}
			console.log("Model " + $key + " migrated");
		    });
		}
	    }
	});
    }

    // automigrate_all();
    autoupdate_all();
}