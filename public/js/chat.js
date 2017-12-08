
var socket = io();
socket.on('connect', function(){
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function(err) {
        if(err){
            alert(err);
            window.location.href = '/';
        } else {
            console.log('Joined!');
        }        
    });
});

function scrollToBottom(){
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
    // console.log(clientHeight);
    // console.log(scrollTop);
    // console.log(scrollHeight);
    // console.log(newMessageHeight);
    // console.log(lastMessageHeight);
};

socket.on('newMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        text: message.text, 
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);    
    scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url, 
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();    
});

socket.on('disconnect', function() {
    console.log('Disconnected from Server');
});

socket.on('updateUserList', function(users) {
    console.log(users);
    var ol = jQuery('<ol></ol>')
    users.forEach(user => {
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);
});

var messageTextBox = jQuery('[name=message]');
jQuery('#message-form').on('submit', (e) => {
    e.preventDefault();
    socket.emit('createMessage', {        
        text: messageTextBox.val()
    }, function(data){
  //      console.log('ACK from Server: ', data);
        messageTextBox.val('');
        messageTextBox.focus(); //to focus the messageTextBox again
    });
});

var locationButon = jQuery('#send-location');
locationButon.on('click', function() {
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    locationButon.attr('disabled', 'disabled').text('Sending Location.....');

    navigator.geolocation.getCurrentPosition(function(position){
        locationButon.removeAttr('disabled').text('Send Location');
//        console.log(position);
        socket.emit('creationLocationMessage', {
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude
        });
    }, function() {
        locationButon.removeAttr('disabled').text('Send Location');
        alert('Unable to Fetch Location');
    });
});