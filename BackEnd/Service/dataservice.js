const _ = require("lodash")
const baseservice = require("./baseservice");

function dataservice(){
    baseservice.call(this);
    this.serviceName = "dataservice";
}

dataservice.prototype.getData = function(){
    const cityDump = require("../data dump/city");
    const countryDump = require("../data dump/country");
    const languageDump = require("../data dump/language");

    this.addKeyValue(cityDump , "type" , "city");
    this.addKeyValue(countryDump , "type" , "country");
    this.addKeyValue(languageDump , "type" , "language");

    return _.union(cityDump , countryDump , languageDump);
}

dataservice.prototype.addKeyValue = function (list , key , value){

    list.forEach((eachObj) => {
        eachObj[key] = value;
    });

}

dataservice.prototype.filterData = function (list , filterBy){
   
    return _.filter(list, function(obj) {
        return (obj.Name && obj.Name.toLowerCase().includes(filterBy)) || (obj.Language && obj.Language.toLowerCase().includes(filterBy)) 
    });

}


module.exports = dataservice;