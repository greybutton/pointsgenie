/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;

var EventStore = require("../stores/event");
var EventForm = require("../components/event-form");

var ReactRouter = require("react-router");

module.exports = React.createClass({
  displayName: "AdminEvent",
  propTypes: {
    params: PropTypes.object,
  },
  componentWillMount: function () {
    EventStore.init();
  },
  componentDidMount: function () {
    EventStore.addChangeListener(this.updateEvent);
  },
  componentWillUnmount: function() {
    EventStore.removeChangeListener(this.updateEvent);
  },
  getInitialState: function () {
    if (this.props.params.id === undefined) {
      return { event : {} };
    }
    return {
     event : EventStore.getEvent(this.props.params.id),
    };
  },
  updateEvent: function () {
    if(!this.isMounted()) {
      return;
    }
    this.setState({
      event: EventStore.getEvent(this.props.params.id),
    });
  },
  handleSubmit: function (e) {
    e.preventDefault();
    if (this.refs.form.isValid()) {
      var method = "updateEvent";
      if (this.props.params.id === undefined) {
        method = "addEvent";
      }
      EventStore[method](this.refs.form.getFormData(), function () {
        ReactRouter.transitionTo("/");
      });
    }
  },
  render: function () {
    var isNew = this.props.params.id === undefined;

    return (
      <div className="event-form">
        <h3>{isNew ? "Créer un événement" : "Modifier un événement"}</h3>
        <EventForm ref="form" onSubmit={this.handleSubmit} event={this.state.event}/>
      </div>
    );
  }
});