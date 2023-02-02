const _ = require("lodash")

function dataservice(){
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
   
    //Implement Filter Data

}


module.exports = dataservice;