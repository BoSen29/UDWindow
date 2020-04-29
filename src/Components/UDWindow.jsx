import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';


class UDWindow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
      minimized: false,
      minimizedPos: 0,
      minimizedLine: 0,
      disabled: this.props.disabled,
      screenHeight: 0,
      screenWidth: 0,
      pos: null,
      x: 0,
      y: 0,
      clientX: 0,
      clientY: 0,
      lastX: 0,
      lastY: 0,
      minimizedSize: this.props.minimizedSize
    }
  }

  componentWillMount() {
    this.pubSubToken = PubSub.subscribe(this.props.id, this.onIncomingEvent.bind(this));
    this.setState({
        x: this.props.x,
        y: this.props.y
    })
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.pubSubToken);
    window.removeEventListener('resize', this.updateWindowDimensions());
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions());
  }

  updateWindowDimensions() {
      this.setState({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight
    });
  };

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

  minimizeHandler() {
    var currentPos = null;
    var currentLine = null
    var maxCount = (this.state.screenWidth / (this.state.minimizedSize + 10)) - 1
    
    for (let h = 0; h < 5; h++) {
      if (currentPos === null) {
        for (let i = 0; i < maxCount; i++) {
          var className = "minrow" + h + " minimized" + i;
          if(document.getElementsByClassName(className).length === 0) {
            if (currentPos === null) {
                currentPos = i;
                currentLine = h;
            }
          }
        }
      }
    }
    
    if (currentPos === null) {
        currentPos = 0;
        currentLine = 0;
    }

    var newX = 10 + (currentPos * (this.state.minimizedSize + 10))
    var newY = 0 - 70 + (-50 * currentLine)
    this.setState({
        pos: {
            x: newX,
            y: newY 
        },
        disabled: true,
        minimizedPos:currentPos,
        minimizedLine:currentLine,
        minimized:true
    })
  }
  closeHandler() {
    if (this.props.onClose) {
      UniversalDashboard.publish('element-event', {
          type: "clientEvent",
          eventId: this.props.onClose,
          eventName: 'onClose',
          eventData: this.props.id
      });
    }
    else {
      this.setState({hidden:true})
    }
  }
  reOpenHandler() {
    this.setState({
        pos: null,
        disabled: false,
        minimized:false
    })
  }

  render() {
    if (this.state.hidden) {
      return null;
    }
    else {
      var content = this.props.content;
      if (!Array.isArray(content)) {
        content = [content]
      }
      content = content.map(x => {
        return UniversalDashboard.renderComponent(x);
      });
      const buttonStyle = {
          'float': 'right'
      }
      const RedButton = {
          'background-color': 'red',
          'color': 'white',
          'width' : '30px',
          'border': 'none',
          'border-radius': '3px',
          'font-size': '22px',
          'padding-top': '8px',
          'padding-bottom': '4px'
      }
      const YellowButton = {
          'background-color': 'orange',
          'color': 'white',
          'width' : '30px',
          'border': 'none',
          'border-radius': '3px',
          'font-size': '22px',
          'padding-top': '8px',
          'padding-bottom': '4px'
      }
      const titlestyle = {
          "width": "100%"
      }
      const headerStyle = {
        'overflow': 'hidden',
        'margin-left': '5px'
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
          offsetParent={document.body}
          bounds={document.body}>
          <div className="box" style={
            this.state.minimized === false ? 
            {
              position: "absolute",
              left: "0px",
              bottom: "0px"
            }
            :
            {
              position: "absolute",
              left: "0px",
              bottom: "0px",
              width: this.state.minimizedSize + "px"
            }
            } id={this.props.id}>
            <div className={this.state.minimized ? "card ud-card minrow" + this.state.minimizedLine + " minimized" + this.state.minimizedPos: "card ud-card"} >
                <div className="card-title left-align" style={titlestyle}>
                    <span style={headerStyle}>
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

export default UDWindow
