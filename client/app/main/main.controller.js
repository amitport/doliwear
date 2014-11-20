'use strict';

angular.module('doliwearApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $http.get('/api/dogs/Angie').success(function(dog) {
      $scope.dog = dog;
      var data = []
      for (var i=0; i < dog.activity.length; i++) {
        data.push([new Date(dog.activity[i].addedAt), dog.activity[i].level])
      }
      var gaugeOptions = {

        chart: {
          type: 'solidgauge'//, backgroundColor: 'rgb(67, 147, 185)'
        },

        title: null,

        pane: {
          center: ['50%', '85%'],
          size: '140%',
          startAngle: -90,
          endAngle: 90,
          background: {
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
          }
        },

        tooltip: {
          enabled: false
        },

        // the value axis
        yAxis: {
          stops: [
            [0.1, '#44cF3B'], // green
            [0.5, '#44cF3B'],//'#DDDF0D'], // yellow
            [0.9, '#44cF3B'],//'#DF5353']  // red
          ],
          lineWidth: 0,
          minorTickInterval: null,
          tickPixelInterval: 400,
          tickWidth: 0,
          title: {
            y: -70
          },
          labels: {
            y: 16
          }
        },

        plotOptions: {
          solidgauge: {
            dataLabels: {
              y: 5,
              borderWidth: 0,
              useHTML: true
            }
          }
        }
      };
      var gauge = $('#gauge');
      gauge.highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: 'Activity'
          }
        },

        credits: {
          enabled: false
        },

        series: [{
          name: 'Activity',
          data: [dog.activity[dog.activity.length-1].level],
          dataLabels: {
            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
            ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
            '<span style="font-size:12px;color:silver">Current</span></div>'
          },
          tooltip: {
            valueSuffix: 'Activity'
          }
        }]

      }));
      var plot = $('#container');
      plot.highcharts({
        chart: {
          type: 'spline'
        },
        title: {
          text: ''//dog.name
        },
        //subtitle: {
        //  text: dog.color + ' ' + dog.breed
        //},
        xAxis: {
          type: 'datetime',
          //dateTimeLabelFormats: { // don't display the dummy year
          //  month: '%e. %b',
          //  year: '%b'
          //},
          labels:
          {
            enabled: false
          },
          title: {
            text: ''
          }
        },
        yAxis: {
          title: {
            text: ''
          },
          min: 0
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br>',
          pointFormat: '{point.y}'
        },

        series: [{
          name: 'Activity',
          // Define the data points. All series have a dummy year
          // of 1970/71 in order to be compared on the same x axis. Note
          // that in JavaScript, months start at 0 for January, 1 for February etc.
          data: data
        }]
      });

      window.plot = plot.highcharts();
    });

    //setInterval(function() {
    //  //console.log('here');
    //},1000);
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
