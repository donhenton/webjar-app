import React from 'react';
import ReactDOM from 'react-dom';

var Hello = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});


var loadedStates = ['complete', 'loaded', 'interactive'];

if (loadedStates.indexOf(document.readyState) > -1 && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}

function run() {

    ReactDOM.render(
      <Hello name="World" />,
      document.getElementById('container')
    );
}