import React from 'react';

class Activity {
  render() {
    return (
      <li>{this.props.activity.id} - {this.props.activity.name}</li>
    );
  }
}

export default Activity;
