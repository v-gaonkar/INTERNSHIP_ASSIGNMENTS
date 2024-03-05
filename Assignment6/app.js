var app = angular.module('chatApp', ['ngMaterial']);

app.controller('chatController', function($timeout) {
    var vm = this;
    vm.chatBoxes = [];
    vm.boxIndex = 1; 

    vm.addChatBox = function() {
        if (vm.chatBoxes.length < 10) {
            var newIndex = getNextIndex();
            vm.chatBoxes.push({ id: newIndex, messages: [], typing: false });
        } else {
            alert('You can only add up to 10 chat boxes.');
        }
    };

    vm.removeChatBox = function(index) {
        vm.chatBoxes.splice(index, 1);
    };

    vm.sendMessage = function(index) {
        var chatBox = vm.chatBoxes[index];
        if (chatBox && chatBox.message) {
            var newMessage = { sender: 'Chat Box ' + chatBox.id, content: chatBox.message, sent: true };
            chatBox.messages.push(newMessage);
            sendMessageToBoxes(index, chatBox);
            chatBox.message = ''; 
        }
    };

    vm.typingStatus = function(index) {
        var currentChatBox = vm.chatBoxes[index];
        if (currentChatBox.message) {
            notifyTyping(index, currentChatBox);
            resetTypingStatus();
        }
    };

    function getNextIndex() {
        var nextIndex = vm.boxIndex;
        while (isInUse(nextIndex)) {
            nextIndex++;
        }
        return nextIndex;
    }

    function isInUse(index) {
        return vm.chatBoxes.some(function(box) {
            return box.id === index;
        });
    }

    function sendMessageToBoxes(index, chatBox) {
        for (var i = 0; i < vm.chatBoxes.length; i++) {
            if (i !== index) {
                vm.chatBoxes[i].messages.push({ sender: 'Chat Box ' + chatBox.id, content: chatBox.message, sent: false });
            }
        }
    }

    function notifyTyping(index, currentChatBox) {
        for (var i = 0; i < vm.chatBoxes.length; i++) {
            if (i !== index) {
                vm.chatBoxes[i].typing = 'Box ' + currentChatBox.id + ' is typing';
            }
        }
    }

    function resetTypingStatus() {
        $timeout(function() {
            for (var i = 0; i < vm.chatBoxes.length; i++) {
                vm.chatBoxes[i].typing = false;
            }
        }, 2000); 
    }
});
