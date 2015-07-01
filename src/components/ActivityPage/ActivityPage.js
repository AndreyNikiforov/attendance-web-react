import React from 'react';
import Rx from 'rx';
import { getJSON as requestGetJSON } from 'rx-dom';
import 'rx-dom';
import 'react-addons';
import ActivityList from '../ActivityList';


class ActivityPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activityList: [],
      activities: []
    };
  }

  componentDidMount() {

    var eventUrlStream =
      // Rx.Observable.fromPromis(fetch(this.props.url)).select(function(request){
      //   return request.json();
      // })
      Rx.DOM.Request.getJSON(this.props.url)
      .selectMany(function(data) {
        console.log('stream loaded data:' + data);
        return Rx.Observable.fromArray(data);
      })
      ;

    var eventStream =
    eventUrlStream
    .selectMany(function(eventUrl) {
      console.log('loading event from url:' + eventUrl);
      return requestGetJSON(eventUrl);
    })
    .select(function(data) {
      console.log('loaded event:' + data);
      return data;
    })
    ;


    var setState = this.setState.bind(this);  //it is not autobound by react
    // var jsonFetchObservable = function(url) {
    //   return Rx.Observable.fromPromis(fetch(url)).select(function(request){
    //     return request.json();
    //   });
    // }

    var activitiesStream =
      requestGetJSON('activities.json')
        .selectMany(function(data) {
          console.log('stream loaded data for activities :' + data);
          return Rx.Observable.fromArray(data);
        })
        .selectMany(function(eventUrl) {
          console.log('loading activity event from url:' + eventUrl);
          return requestGetJSON(eventUrl);
        });


    var stateChangeStream =
      activitiesStream
      .merge(eventStream)
      .scan(this.state, function(state, eventData) {
        console.log('got event:' + eventData.eventType);
          //do hardcoding now
        if (eventData.eventType === 'ActivityAdded') {
          console.log(' added activity ' + eventData.activityId);
          return React.addons.update(state, {
            activityList: {
              $push: [{
                id: eventData.activityId
              }]
            }
          });
        }
        else {
          if (eventData.eventType === 'ActivityCreated') {
            console.log(' created activity ' + eventData.id);
            return React.addons.update(state, {
              activities: {
                $push: [{
                  id: eventData.id,
                  name: eventData.activityName
                }]
              }
            });
          }
          else {
            return state;
          }
        }
      }
    );

    stateChangeStream
    //.observeOn(Rx.Scheduler.requestAnimationFrame)  //seems like react works without forcing "update in UI thread", but it is needed for debugger; it is much slower too
    .subscribe(
        function(newState) {
          console.log('got state update:' + newState.activityList);
            // just update state
          setState( newState );
        },
        function() {
            // Log the error
          console.error('got error');
        }
    );

  }

  render() {
    return (
      <body>
      <button type="button" name="button"></button>
      <ActivityList activityList={this.state.activityList} activities={this.state.activities}/>
      </body>
    );
  }
}

export default ActivityPage;
