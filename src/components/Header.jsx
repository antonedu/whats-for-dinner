import SquareButton from "./SquareButton.js";

export default class Header extends React.Component {
    // React component for header of <App />.
    // props.first/second/third are info about the three buttons in header.
    // ..icon is font awesome icon of button.
    // ..title is title displayed on hover describing what happens when clicked.
    // ..visable is wether button is visable or not.
    // ..onClick is what happens when button is clicked.
    constructor(props) {
      super(props);
      this.state = {
        activeButtons: ["add", "change", "settings"],
      };
    };
  
    render() {
      return (
        <header>
          <a href="../index.html" id="logo">
            <figure>
              <img src="../assets/logo.png" alt="logo" />
            </figure>
          </a>
          <div className="filler"></div>
          <SquareButton color="green" icon={this.props.first.icon} title={this.props.first.title} onClick={() => this.props.first.onClick()} visible={this.props.first.visible} />
          <SquareButton color="green" icon={this.props.second.icon} title={this.props.second.title} onClick={() => this.props.second.onClick()} visible={this.props.second.visible} />
          <SquareButton color="green" icon={this.props.third.icon} title={this.props.third.title} onClick={() => this.props.third.onClick()} visible={this.props.third.visible} />
        </header>
      );
    };
  }