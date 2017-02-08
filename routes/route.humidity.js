var humidity = require('../controllers/control.humidity');
var device = require('../controllers/control.device');

module.exports = function(router){

    router.route('/api/v1/humidity/:device')
        .get(function(req, res){

            var page = req.query.page;
            var results = req.query.results;
            var order = req.query.order;
            var filter = req.query.filter;
            var mac = req.params.device;

            page = page ? page-1 : 0;
            results = results ? results : config.defaults.limit;
            filter = filter ? filter : config.defaults.filter;
            order = order ? order : 'asc';

            var params = {
                page:Number(page),
                results:Number(results),
                filter:filter,
                order:order
            };

            humidity.get(mac, params, function(err, data){
                if(err){
                    console.log(err);
                    res.status(500);
                    res.send(err);
                }else{
                    res.send(data);
                }
            })

        });

    router.route('/api/v1/humidity')
        .post(function(req, res){

            var data = req.body;

            if(typeof data == 'string')
                data=JSON.parse(data);

            data.mac = data.mac.toLowerCase();

            device.write(data, function(err){
                if(err)
                    console.log(err);
            });

            humidity.write(data, function(err, data){
                if(err){
                    console.log(err);
                    res.status(500);
                    res.send(err);
                }else{
                    res.send('Ok.')
                }
            });

        })

};