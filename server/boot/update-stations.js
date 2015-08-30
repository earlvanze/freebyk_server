module.exports = function(app){
    var Station = app.models.Station;
    var request = require('request');

    var updateStationData = function(){
	request({
	    url: 'https://www.citibikenyc.com/stations/json',
	    json: true
	}, function(error, response, body){
	    if(error){
		throw error;
	    }
	    for(var index in body['stationBeanList']){
		var station = body['stationBeanList'][index];
		var tempStation = {};
		tempStation.id = station.id;
		tempStation.stationName = station.stationName;
		tempStation.streetAddress = station.stAddress1;
		tempStation.streetAddress2 = station.stAddress2;
		tempStation.geolocation = {
		    lat: station.latitude,
		    lng: station.longitude};
		tempStation.updated = station.lastCommunicationTime;
		tempStation.totalDocks = station.totalDocks;
		tempStation.availableDocks = station.availableDocks;
		tempStation.availableBikes = station.availableBikes;
		Station.upsert(tempStation, function(error, station){
		    if(error){
			throw error;
		    }
		});
	    }
	});
    };

    var delay = 60 * 60 * 1000;
    var stationUpdateInterval = setInterval(updateStationData, delay);
    updateStationData();
};
