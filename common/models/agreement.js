module.exports = function(Agreement) {

    Agreement.ftd = function(since, grace_minutes, callback){
	var grace = new Date();
	grace.setMinutes(grace.getMinutes() - grace_minutes);
	console.log(grace);
	Agreement.find({
	    where: {
		and: [
		    {delivered: false},
		    {datetime: {lt: grace}},
		    {datetime: {gt: since}}]
	    }},
	    function(error, agreements){
		if(error){
		    return error;
		}
		callback(null, agreements);
	    });
    };

    Agreement.remoteMethod(
	"ftd",
	{
	    http: {path: "/ftd", verb: "get"},
	    accepts: [{arg: "since", type: "date"},
		      {arg: "grace_minutes", type: "number"}],
	    returns: {arg: "ftds", type: "array"}
	});
};
