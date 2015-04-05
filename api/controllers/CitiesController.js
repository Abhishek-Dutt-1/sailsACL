/**
 * CitiesController
 *
 * @description :: Server-side logic for managing Cities
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * Returns a hierachical list of Continents > Countries > States > Cities
     * Used in geo location settings modal form
     */
    fetchUniqueLocations: function(req, res) {
        Cities.find({}).exec(function(err, allCities) {
            if(err) return res.badReqest(err);

            var continents = [];
            var countries = [];
            var states = [];
            var cities = [];

            continents = _.chain(allCities).pluck('continent').unique().value();
            countries  = _.chain(allCities).pluck('country').unique().value();
            states     = _.chain(allCities).pluck('state').unique().value();
            cities     = _.chain(allCities).pluck('city').unique().value();

            var continent2 = [];
            continents.forEach(function(continent) {
                var country2 = [];
                 countries.forEach(function(country) {
                    var state2 = [];
                    states.forEach(function(state) {
                        var city2 = [];
                        var cityTmp = _.chain(_.filter(allCities, {continent: continent, country: country, state: state})).pluck('city').value();
                        if(cityTmp.length > 0) {
                            //city2.push( { city: _.chain(_.filter(allCities, {continent: continent, country: country, state: state})).pluck('city').value() } );
                            city2.push( { city: cityTmp[0] } );
                        }
                        if(city2.length > 0) {
                            state2.push({state: state, cities: city2});
                        }
                    });
                    if(state2.length > 0) {
                        country2.push({country:country, states: state2});
                    }
                });
                if(country2.length > 0) {
                    continent2.push({continent: continent, countries: country2});
                }
            });

            return res.json( [{ planet: 'Earth', continents: continent2 }] );
        });
    },

    /**
     * Returns array of all countries
     * Used in User Registration form
     */
     fetchUniqueCountries: function(req, res) {

         Cities.find().exec(function(err, allCountries) {
             if(err) return err;
             return res.json( _.chain(allCountries).pluck('country').unique().value() );

             //return res.json(allCountries);

         });

     },

};

