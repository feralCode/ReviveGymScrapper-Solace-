'use strict';
var uuid = require('node-uuid');
var scraperjs = require('scraperjs');
var moment = require('moment');
var _ = require('lodash');
var reviveDb = require(__dirname + '/../db');

var reqUrl = 'http://fitnesssf.com/events/oakland/';
var gymID = 'H06qs259Mc5652n3mC3wD7h4xB5y519Z';


scraperjs.StaticScraper.create(reqUrl)
  .scrape(function($) {
    return $('.single-event').map(function() {
      var eventTitle = $(this).find('h4').text();

      // timeString example 7:00pm - 8:00pm
      var timeString = $(this).find('.event-time').text();
      var eventStart = timeString.split('-')[0].trim();
      var eventEnd = timeString.split('-')[1].trim();
      var eventDay = $(this).parent().find('.schedule-day-name').text().trim();

      var trainerName = $(this).find('.event-trainer').text();
      var trainerId = null;

      var eventDomId = $(this).find('a').attr('data-remodal-target');
      var eventDescription = null;
      if (eventDomId) {
        eventDescription = $('[data-remodal-id="' + eventDomId + '"]')
          .find('.event-description-content p').text();
      }

      var eventCategory = null;
      var eventCategoryId = null;

      return {
        eventTitle: eventTitle,
        trainerName: trainerName,
        eventDay: eventDay,
        eventStart: moment(eventStart, 'h:mma'),
        eventEnd: moment(eventEnd, 'h:mma'),
        eventDescription: eventDescription,
        eventCategory: eventCategory,
        eventCategoryId: eventCategoryId,
        trainerId: trainerId
      };
    }).get();
  })
  .then(function(events) {
    var recordsToInsert = monthlyEventFactory(events);
    //console.log(recordsToInsert);
    _.each(recordsToInsert, function(record) {
      reviveDb
        .Event
        .create(record)
        .catch(function(e) {
          console.error('Error: failed to insert event record');
          console.error(e.message);
          console.error(e.message);
        })
        .finally(function afterInsert() {
          console.error('Processed event - ' + record.title);
        });
    });
  });


function monthlyEventFactory(events) {
  var startOfMonth = moment().startOf('month');
  var endOfMonth = moment().endOf('month');
  var daysCount = endOfMonth.diff(startOfMonth, 'days');

  var dayIndex = 0;
  var dateIndex = moment().startOf('month');
  var eventsToInsert = [];
  // roll through each day of the month adding classes
  _.times(daysCount, function() {
    dateIndex.add(dayIndex, 'day');
    dayIndex = dayIndex + 1;
    //Sunday Monday ... Friday Saturday
    var dayString = dateIndex.format('dddd');
    // get events that day on this day
    var eventsOnCurrentDay = _.filter(events, {eventDay: dayString});
    console.log('events for ' +
        dateIndex.format() + ' Count - ' + eventsOnCurrentDay.length);
    console.log('------------------------------------------------------------');
    _.each(eventsOnCurrentDay, function onEachEventToday(ev) {
      // set correct minute and hour
      var startDate = moment(dateIndex)
        .utcOffset(8)
        .minute(ev.eventStart.minute())
        .hour(ev.eventStart.hour())
        .second(0)
        .millisecond(0);
      var endDate = moment(dateIndex)
        .utcOffset(8)
        .minute(ev.eventEnd.minute())
        .hour(ev.eventEnd.hour())
        .second(0)
        .millisecond(0);
      var parsedEvent = {
        id: uuid.v4(),
        startDate: startDate,
        endDate: endDate,
        title: ev.eventTitle,
        trainer: ev.trainerName,
        trainerId: ev.trainerId,
        gymId: gymID,
        gymName: 'Fitness SF Oakland',
        category: ev.eventCategory,
        categoryId: ev.eventCategoryId,
        description: ev.eventDescription
      };
      //console.log(parsedEvent);
      // push parsed event to insert Object
      eventsToInsert.push(parsedEvent);
    });
  });
  return eventsToInsert;
}
