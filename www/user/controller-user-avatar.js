angular.module('starter.controllers')
.controller('AvatarCtrl', function($scope, AvatarService,$ionicHistory) {
	$scope.avatarList = [
		"bird.png","chihuahua.png","duck.png","kitten.png","puppy.png",
		"tropical-fish.png","black-cat.png","cow.png","fish.png","lobster.png",
		"rabbit.png","tuna.png","bulldog.png","crab.png","frog.png","mouse.png",
		"seal.png","turkey.png","bunny.png","dachshund.png","gold-fish.png","octopus.png",
		"shark.png","turtle.png","cardinal.png","dog.png","hamster.png","parrot.png",
		"sheep.png","whale.png","cat.png","dolphin.png","horse.png","pig.png","squid.png",
		"chicken.png","donkey.png","jellyfish.png","pony.png","squirrel.png"];

	$scope.imgPath = "/img/avatar";

	//点击了头像
	$scope.chooseAvatar = function(avatar){
		//更新service状态
		AvatarService.chooseAvatar(avatar);
		$ionicHistory.goBack();
	};
});