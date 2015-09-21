module.exports = function(user) {
    var braintree = require("braintree");

	var gateway = braintree.connect({
	  environment: braintree.Environment.Sandbox,
	  merchantId: "hc43n4py8y2xssf7",
	  publicKey: "frn2ygcymnfkvsz6",
	  privateKey: "7cc0e8bb1a5353f7a3a158d4fbe8857a"
	});

	// Returns null if the access token is not valid
	function getCurrentuserId() {
		var ctx = loopback.getCurrentContext();
		var accessToken = ctx && ctx.get('accessToken');
		var userId = accessToken && accessToken.userId;
		return userId;
	}

	user.client_token = function(customer_id, callback) {
		gateway.clientToken.generate({}, function (err, response) {
		    callback(null, response.clientToken);
		});
	}

    user.remoteMethod("client_token",	{
	    http: {path: "/client_token", verb: "get"},
	    accepts: {arg: "customer_id", type: "string"},
	    returns: {arg: "client_token", type: "string"}
	});

	user.payment_methods = function(payment_method_nonce, callback) {
		var user_id = getCurrentuserId();
		if (!user_id) {
			callback(null, {success: false, "message": "Invalid user ID or not logged in."});
		} else {
			gateway.customer.update(user_id, {
	            paymentMethodNonce: payment_method_nonce
	        }, function (err, result) {
	            if (err) console.log("ERROR: " + err);
	            if (result.success) {
	                var token = result.customer.paymentMethods[0].token;
	                // Charge user with cost if failed to deliver
	                // gateway.transaction.sale({
	                //     amount: '10.00',
	                //     // paymentMethodNonce: nonce,
	                //     paymentMethodToken: token,
	                // }, function(err, result) {
		               //  if (err) {
		               //      log(err, req, "/users/:user_id/payment_methods")
		               //      callback(null, {success: false, "message": err, "payment_method_token": null });
		               //  }
		               //  else {
		               //      // console.log(token);
		               //      callback(null, {success: true, "message": "Payment processed successfully!", "payment_method_token": token });
		               //  }
	                // });
	            }
	        });
	    }
	}

    user.remoteMethod("payment_methods",	{
	    http: {path: "/payment_methods", verb: "post"},
	    accepts: {arg: "payment_method_nonce", type: "string"},
	    returns: {arg: "payment_method_token", type: "string"}
	});	
};
