import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';


class UDDrag extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
    }
  }

  componentWillMount() {
    this.pubSubToken = PubSub.subscribe(this.props.id, this.onIncomingEvent.bind(this));
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.pubSubToken);
  }

  onIncomingEvent(eventName, event) {
    if (event.type === "requestState") {
      var data = {
        attributes: {
          hidden: this.state.hidden,
        }
      }
      UniversalDashboard.post(`/api/internal/component/element/sessionState/${event.requestId}`, data);
    }
    else if (event.type === "setState") {
      this.setState(event.state.attributes);
    }
    else if (event.type === "removeElement") {
      this.setState({
        hidden: true,
      });
    }
  }

  render() {
    if (this.state.hidden) {
      return null;
    }
    else {
      console.log(this.props.content);
      var content = this.props.content;
      if (!Array.isArray(content)) {
        content = [content]
      }
      content = content.map(x => {
        return UniversalDashboard.renderComponent(x);
      });
      const mystyle = {
        border: "5px dashed #1C6EA4",
        position: "absolute",
        'padding-left': "10px",
        'padding-right': "10px",
        'border-radius': "12px 12px 12px 12px",
        'background-color': "#f7f7f7",
        '-webkit-box-shadow': "7px 8px 10px 1px rgba(0,0,0,0.61)",
        'box-shadow': "7px 8px 10px 1px rgba(0,0,0,0.61)"
      };
      const imgstyle = {
        'border-radius': "12px"
      };
      return (
        <Draggable
          axis="both"
          handle=".box"
          defaultPosition={{ x: this.props.x, y: this.props.y }}
          position={null}
          grid={[5, 5]}
          scale={1}
          onStart={this.handleStart}
          onDrag={this.handleDrag}
          onStop={this.handleStop}>
          <div className="box" style={mystyle}>
            <h5 style={{ 'text-align': "center" }}>{this.props.title}</h5>
            <p>{this.props.text}</p>
            {content}
          </div>
        </Draggable>
      );
    }
  }
}

export default UDDrag
