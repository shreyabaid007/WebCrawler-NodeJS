var express = require('express');
var app = express();
var _ =require('underscore')
var url = require('url');
var http = require('http');
var Crawler = require("js-crawler");
var fs =require('fs');
var Chart = require('cli-chart');

var dict = {};
global.urls=[];
global.domains=[];
global.unique_domains={};
global.unique_urls=[];

//express
app.use( '/', function(req, res, next){
var that = this;

//Web crawler for Node.JS,
var crawler = new Crawler().configure({
  maxRequestsPerSecond: 5,      //requests the crawler is allowed to make 
  maxConcurrentRequests: 5,     //specify how should the crawler adjust its rate of requests 
  depth: 3

})
 
//onSuccess callback will be called for each page that the crawler has crawled.
.crawl({
  url: "https://google.com",
  success: function(page ) {
    urls.push(page.url);
    console.log(page.url);
   
    var parsedUrl = url.parse(page.url, true, true);
    domains.push(parsedUrl.hostname);
    unique_domains=(_.uniq(domains));  //getting domains
    unique_urls=(_.uniq(urls));        //getting urls

    //My assumption--> Crawler will crawl only 100 links and will stop
    if(urls.length==100){create_report(res,unique_domains,domains); 
      process.exit();
  }
}
});

//this function creates dictionary having key: domains and value: no.of domains
function create_report(res,unique_domains,domains){

  //TODO: with plotly: nothing displayed on UI 

  //creating chart in console
  for(var j=0;j<unique_domains.length;j++){
    x_axis_domain=unique_domains.toString();
  }
  var chart = new Chart({
    xlabel: x_axis_domain ,
    ylabel: 'Count of domains',
    direction: 'y',
    width: 80,
    height: 20,
    lmargin: 15,
      step: 4
  });

//creating dictionary
  var report = {};
  domains.forEach(function(el){
    report[el] = report[el] + 1 || 1;
  });
       
  var array_values=[]
  for (var key in report) {
    array_values.push(report[key]);
  }

  for(var i=0;i<array_values.length;i++){
    chart.addBar(array_values[i]);}   //adding to chart
    chart.draw();
    res.send(report);    //response in dict format
  }

});

app.listen(3000);