import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';


class UDDrag extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
      minimized: false,
      disabled: this.props.disabled,
      screenHeight: 0,
      screenWidth: 0,
      pos: null,
      x: this.props.x,
      y: this.props.y,
      disabled: this.props.disabled
    }
  }

  componentWillMount() {
    this.pubSubToken = PubSub.subscribe(this.props.id, this.onIncomingEvent.bind(this));
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.pubSubToken);
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight });
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
        minimized: false,
      });
    }
  }

  minimizeHandler() {
    console.log("PositionY", this.state.lastY);
    console.log("PositionX", this.state.lastX);
    console.log("Position", this.state.pos);
    console.log("ScreenHeight", this.state.screenHeight);
    console.log("ScreenWidth", this.state.screenWidth);
    var newX = 50
    var newY = 0
    this.setState({
        pos: {
            x: newX,
            y: newY 
        },
        disabled: true
    })
    this.setState({minimized:true})
  }
  closeHandler() {
    this.setState({hidden:true})
  }
  reOpenHandler() {
    this.setState({
        pos: null,
        x: 0,
        y: 0,
        disabled: false
    })
    this.setState({minimized:false})
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
        position: "absolute",
      };
      const buttonStyle = {
          'pull': 'right',
          'float': 'right'
      }
      const RedButton = {
          'background-color': 'red',
          'color': 'white',
          'height': '24px',
          'width' : '24px',
          'border': 'none',
          'border-radius': '3px',
          'font-size': '18px'
      }
      const YellowButton = {
          'background-color': 'orange',
          'color': 'white',
          'height': '24px',
          'width' : '24px',
          'border': 'none',
          'border-radius': '3px',
          'font-size': '18px'
      }
      return (
        <Draggable
          axis="both"
          handle=".box"
          defaultPosition={{ x: this.state.x, y: this.state.y }}
          position={this.state.pos}
          grid={[25, 25]}
          scale={1}
          onStart={this.handleStart}
          onDrag={this.handleDrag}
          onStop={this.handleStop}
          disabled={this.state.disabled}
          offsetParent={document.body}>
          <div className="box" style={mystyle}>
            <div className="card ud-card">
                <div className="card-title left-align">
                    <span>
                        {this.props.title}
                    </span>
                    <span style={buttonStyle}>
                        {this.state.minimized === true ? 
                            <button onClick={() => this.reOpenHandler()} style={YellowButton}>O</button>
                            :
                            <button onClick={() => this.minimizeHandler()} style={YellowButton}>_</button>
                        }
                        
                        <button onClick={() => this.closeHandler()} style={RedButton}>X</button>
                    </span>
                </div>
                {this.state.minimized === false ? <div className="card-content">
                    {content}
                </div>
                : ""}
            </div>
          </div>
        </Draggable>
      );
    }
  }
}

export default UDDrag
