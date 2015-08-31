module.exports = function(Station) {
    var selectionAlgorithm = function(location, stations){
	return stations;
    };

    
    Station.nearby = function(location, distance, callback){
	Station.find({
	    where: {
		geolocation: {
		    near: location,
		    maxDistance: distance}
	    }
	},
		     function(error, stations){
			 if(error){
			     return error;
			 }
			 callback(null, selectionAlgorithm(location, stations));
		     });
    };
    Station.remoteMethod(
	"nearby",
	{
	    http: {path: "/nearby", verb: "get"},
	    accepts: [{arg: "location", type: "geopoint"},
		      {arg: "distance", type: "number"}],
	    returns: {arg: "stations", type: "array"}
	});
};
