module.exports = function(app){

    app.get("/update_stations", function($request, $response){
	var $request = require("request");

	$request({
	    url: "https://www.citibikenyc.com/stations/json",
	    json: true
	}, function($error, $request_response, $body){
	    if($error){
		throw $error;
	    }
	    for(var $index in $body["stationBeanList"]){
		$station = $body["stationBeanList"][$index];
		$temp_station = {};
		$temp_station.station_name = $station.stationName;
		$temp_station.street_adress = $station.stAddress1;
		$temp_station.street_adress_2 = $station.stAddress2;
		$temp_station.geolocation = {
		    lat: $station.latitude,
		    lng: $station.longitude};
		$temp_station.updated = $station.lastCommunicationTime;
		$temp_station.total_docks = $station.totalDocks;
		$temp_station.available_docks = $station.availableDocks;
		$temp_station.available_bikes = $station.availableBikes;
		// save data!

	    }
	    $response.send($temp_station);
	});
    });
}
