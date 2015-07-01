import 'babel/polyfill';
import React from 'react';
import ActivityPage from './components/ActivityPage';

(function () {
  React.render(
    <ActivityPage url="events.json" pollInterval={2000}/>,
    document.body
  );
})();
