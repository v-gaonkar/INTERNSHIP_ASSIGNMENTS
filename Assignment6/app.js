var app = angular.module('chatApp', ['ngMaterial']);

app.controller('chatController', function($timeout) {
    var vm = this;
    vm.chatBoxes = [];
    vm.maxLimit = 10;
    vm.chatBoxIndex = 1; 

    vm.addChatBox = function() {
        if (vm.chatBoxes.length < vm.maxLimit) {
            var newIndex = vm.getNextAvailableIndex();
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
            for (var i = 0; i < vm.chatBoxes.length; i++) {
                if (i !== index) {
                    vm.chatBoxes[i].messages.push({ sender: 'Chat Box ' + chatBox.id, content: chatBox.message, sent: false });
                }
            }
            chatBox.message = ''; 
        }
    };

    vm.toggleTypingStatus = function(index) {
        var currentChatBox = vm.chatBoxes[index];
        if (currentChatBox.message) {
            for (var i = 0; i < vm.chatBoxes.length; i++) {
                if (i !== index) {
                    vm.chatBoxes[i].typing = 'Box ' + currentChatBox.id + ' is typing';
                }
            }
           
            $timeout(function() {
                for (var i = 0; i < vm.chatBoxes.length; i++) {
                    vm.chatBoxes[i].typing = false;
                }
            }, 2000); 
        }
    };

    
    vm.getNextAvailableIndex = function() {
        var nextIndex = vm.chatBoxIndex;
        while (vm.chatBoxes.some(box => box.id === nextIndex)) {
            nextIndex++;
        }
        return nextIndex;
    };
});
