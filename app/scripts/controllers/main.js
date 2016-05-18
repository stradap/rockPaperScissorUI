'use strict';

/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var myApp = angular.module('workspaceApp');

myApp.controller('MainCtrl', function($scope, $http, $timeout, fileUpload) {
  $scope.message = '';
  $scope.messageDelete = '';
  $scope.user = {};
  $scope.winnerTournament = '';
  $scope.topWinners = ['Click on Get Top to get results'];
  $scope.topWinnersList = {};
  $scope.counter = 1;
  $scope.spinner = false;

  $scope.uploadFile = function() {
    $scope.spinner = true;
    var file = $scope.myFile;
    console.log('file is ');
    console.dir(file);
    var uploadUrl = 'https://web-api-spr-stradajp.c9users.io/api/championship/new';
    var test = fileUpload.uploadFileToUrl(file, uploadUrl);
    test.then(function(result) {
      $timeout(function() {
        $scope.winnerTournament = result.data.winner;
        $scope.getTopList();
        $scope.spinner = false;
      }, 2000);
    });
  };
  // calling our submit function.
  $scope.submitForm = function() {
    $scope.spinner = true;
    $http({
        method: 'POST',
        url: 'https://web-api-spr-stradajp.c9users.io/api/championship/result',
        data: $scope.user, //forms user object
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .success(function(result) {
        if (result.status === 'fail') {
          $scope.message = result;
        }
        else {
          $scope.message = 'All the data save ' + result.status;
          $scope.messageForm = true;
          $scope.user = {};
          $scope.getTopList();
          $timeout(function() {
            $scope.messageForm = false;
            $scope.spinner = false;
          }, 2000);
        }
      });
  };

  $scope.deleteAll = function() {
    var answer = confirm("Are you sure you want to delete all the history ?");
    if (answer) {
      event.preventDefault();
      $scope.spinner = true;
      $http({
          method: 'GET',
          url: 'https://web-api-spr-stradajp.c9users.io/api/championship/deleteAll'
        })
        .success(function(result) {
          if (result === 'fail') {
            $scope.message = result;
          }
          else {
            $scope.messageDelete = 'All the data was delete';
            $scope.messageDeleteShow = true;
            $scope.topWinners = {};
            $scope.topWinnersList = {};
            $timeout(function() {
              $scope.messageDeleteShow = false;
              $scope.spinner = false;
            }, 2000);
          }
        });
    }
    else {
      $scope.messageDelete = 'Nothing delete';
      $scope.messageDeleteShow = true;
      $timeout(function() {
        $scope.messageDeleteShow = false;
      }, 2000);
    }
  };

  $scope.getTop = function() {
    $scope.spinner = true;
    $http({
        method: 'GET',
        url: 'https://web-api-spr-stradajp.c9users.io/api/championship/top',
        params: {
          count: $scope.counter
        }
      })
      .success(function(result) {
        if (result === 'fail') {
          $scope.message = result;
        }
        else {
          if (result.players.length > 0) {
            $scope.topWinners = result.players;
            $scope.getTopList();
            $scope.spinner = false;
          }
          else {
            $scope.topWinners = ['No results available'];
            $scope.spinner = false;
          }
        }
      });
  };


  $scope.getTopList = function() {
    $scope.spinner = true;
    $http({
        method: 'GET',
        url: 'https://web-api-spr-stradajp.c9users.io/api/championship/top',
        params: {
          count: 10
        }
      })
      .success(function(result) {
        if (result === 'fail') {
          $scope.message = result;
        }
        else {
          if (result.players.length > 0) {
            $scope.topWinnersList = result.players;
            $scope.spinner = false;
          }
          else {
            $scope.topWinnersList = ['No results available'];
            $scope.spinner = false;
          }
        }
      });
  };

  $scope.playVSmachine = function(event) {
    $scope.won = false;
    $scope.machineRock = false;
    $scope.machinePaper = false;
    $scope.machineScissor = false;

    $scope.userRock = false;
    $scope.userPaper = false;
    $scope.userScissor = false;

    $scope.machineRock = true;

    var userChoice = event.target.id;
    var computerChoice = Math.random();
    if (computerChoice < 0.33) {
      computerChoice = 'rock';
      $scope.machineRock = true;
      $scope.machinePaper = false;
      $scope.machineScissor = false;
    }
    else if (computerChoice > 0.34 && computerChoice <= 0.66) {
      computerChoice = 'paper';
      $scope.machineRock = false;
      $scope.machinePaper = true;
      $scope.machineScissor = false;

    }
    else {
      computerChoice = 'scissors';
      $scope.machineRock = false;
      $scope.machinePaper = false;
      $scope.machineScissor = true;
    }

    var compare = function(choice1, choice2) {
      if (choice1 === choice2) {
        if (choice1 === 'rock') {
          $scope.userRock = true;
          $scope.userPaper = false;
          $scope.userScissor = false;
        }
        if (choice1 === 'paper') {
          $scope.userRock = false;
          $scope.userPaper = true;
          $scope.userScissor = false;
        }
        if (choice1 === 'scissors') {
          $scope.userRock = false;
          $scope.userPaper = false;
          $scope.userScissor = true;
        }
        return 'The result is a tie!';
      }
      if (choice1 === 'rock') {
        $scope.userRock = true;
        $scope.userPaper = false;
        $scope.userScissor = false;
        if (choice2 === 'scissors') {
          return 'You won using Rock';

        }
        else {
          $scope.won = true;
          return 'I won!! using Paper';
        }
      }
      if (choice1 === 'paper') {
        $scope.userRock = false;
        $scope.userPaper = true;
        $scope.userScissor = false;
        if (choice2 === 'rock') {
          return 'You won using Paper';
        }
        else {
          $scope.won = true;
          return 'I won!! using Scissors';
        }
      }
      if (choice1 === 'scissors') {
        $scope.userRock = false;
        $scope.userPaper = false;
        $scope.userScissor = true;
        if (choice2 === 'paper') {

          return 'You won using Scissors';
        }
        else {
          $scope.won = true;
          return 'I won!! using Rock';
        }
      }
    };
    document.getElementById('resultVrsMachine').innerHTML = compare(userChoice, computerChoice);
  };

  $scope.$on('$viewContentLoaded', function() {
    $scope.getTopList();
  });
});



myApp.directive('fileModel', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function() {
        scope.$apply(function() {
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);

myApp.service('fileUpload', ['$http', function($http) {
  this.uploadFileToUrl = function(file, uploadUrl) {
    var fd = new FormData();
    fd.append('file', file);
    return $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
      .success(function(result) {
        return result;
      })
      .error(function(err) {
        return err;
      });
  };
}]);
