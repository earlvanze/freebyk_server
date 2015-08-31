module.exports = function(Station) {
    var nearbySelectionAlgorithm = function(location, stations){
	var filter_function = function(station){
	    return (station.availableBikes / station.totalDocks) > 0.75;
	}
	return stations.filter(filter_function);
    };

    
    Station.nearby = function(location, distance, callback){
	Station.find({
	    where: {
		geolocation: {
		    near: location,
		    maxDistance: distance},
	    }
	},
		     function(error, stations){
			 if(error){
			     return error;
			 }
			 callback(null, nearbySelectionAlgorithm(location, stations));
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
