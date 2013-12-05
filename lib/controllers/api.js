'use strict';

exports.sites = function(req, res) {
	res.json([ {
		id : '234491-93490',
		name : 'foo.com',
		referers : [ '//foo.com', '//foo.com:80' ],
		primaryAdmin : 'ed',
		otherAdmins : []
	} ]);
};
