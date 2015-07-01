import React from 'react';
import Activity from '../Activity';

class ActivityList {
  render() {

    var activities = this.props.activities;
    var nodes = this.props.activityList.map(function(activityListItem) {
      var activity = activities.find(function(x) {
        return x.id === activityListItem.id;
      });
      // var activityView = {
      //   id: activityListItem.id,
      //   name: (activity == 'undefined' ? 'loading...' : activity.name)
      // };
      return (
        <Activity activity={activity}/>
      );
    });

    return (
      <ul>
        {nodes}
      </ul>
    );
  }
}

export default ActivityList;
