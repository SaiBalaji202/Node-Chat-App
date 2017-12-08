var moment = require('moment');
// var date = new Date();
// console.log(date.getMonth());

var date = moment();
// console.log(date.format('MMM Do, YYYY'));

// console.log(date.add(1, 'year').format('MMM Do, YYYY'));
// console.log(date.add(1, 'year').subtract(12, 'month').format('MMM Do, YYYY'));
// console.log(date.format('h:mm a'));

// console.log(date.add(1, 'h').format('h:mm A'));
var createdAt = 0;
var date = moment(createdAt);
console.log(createdAt, date.format('MMM Do, YYYY - h:mm a'));

var createdAt = 60000;
var date = moment(createdAt);
console.log(createdAt, date.format('MMM Do, YYYY - h:mm a'));

var sampleTimeStamp = moment().valueOf();
console.log(sampleTimeStamp);