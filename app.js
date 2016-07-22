var ticTacToeApp = angular.module('ticTacToeApp', ["firebase"]);


ticTacToeApp.factory("savedWinner", ["$firebaseObject", 
	function($firebaseObject) {
		var ref = new Firebase("https://tic-tac-toe-9c56e.firebaseio.com/lastwin");
		return $firebaseObject(ref);
	}]);

ticTacToeApp.controller('BoardController', ['$scope', "savedWinner",
	function($scope, savedWinner) {
		
		$scope.lastWinner = savedWinner;
		$scope.displayWinner = savedWinner;
		//$scope.lastWinner.$add({"lastSavedWinner": "A"});
		

		$scope.newGame = function () {
			$scope.isDisabled = false;
			$scope.currentPlayer = 'X';
			$scope.won = false;
			//reset board
			$scope.gameBoard = [
			[{value: ""},{value: ""},{value: ""}],
			[{value: ""},{value: ""},{value: ""}],
			[{value: ""},{value: ""},{value: ""}]]
		}
		$scope.disableButton = function() {
        	$scope.isDisabled = true;
    	}

		var checkForMatch = function(tile1, tile2, tile3) {
			return (tile1.value === tile2.value &&
				tile2.value === tile3.value &&
				tile1.value !== "")
		}

		var gameOver = function() {
			var match = false;
			for(var i=0; i < 3; i++){
				//row & column matches
				if ((checkForMatch($scope.gameBoard[i][0], 
					$scope.gameBoard[i][1],
					$scope.gameBoard[i][2]) === true) ||
					(checkForMatch($scope.gameBoard[0][i], 
					$scope.gameBoard[1][i],
					$scope.gameBoard[2][i]) == true)) {
					return true;
				}
			}
			//diagonal matches
			if ((checkForMatch($scope.gameBoard[0][0], $scope.gameBoard[1][1], $scope.gameBoard[2][2])) || (checkForMatch($scope.gameBoard[2][0], $scope.gameBoard[1][1], $scope.gameBoard[0][2]))) {
				return true;
			} else {
				return false;
			}
		}


		$scope.play = function(tile) {
		//	console.log($scope.displayWinner = $scope.lastWinner[len-1]);
			if ((!tile.isDisabled) && ($scope.won === false)){
				tile.value = $scope.currentPlayer;
				$scope.winner = $scope.currentPlayer;
				if($scope.currentPlayer == 'X'){
					$scope.currentPlayer = 'O';
				} else {
					$scope.currentPlayer = 'X';
				}

			}

			if (gameOver()) {
				$scope.won = true;
				savedWinner.$value = $scope.winner;
				savedWinner.$save();

			}
		}
	}
]);


ticTacToeApp.directive('ngGame', function() {
	return {
		restrict: "A",
		template:'<span class="fr" ng-hide="won">Player {{ currentPlayer }}\'s turn!</span>'
	}
});