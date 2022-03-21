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
      activeButtons: ["add", "change", "settings"]
    };
  }

  render() {
    return /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("a", {
      href: "../index.html",
      id: "logo"
    }, /*#__PURE__*/React.createElement("figure", null, /*#__PURE__*/React.createElement("img", {
      src: "../assets/logo.png",
      alt: "logo"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "filler"
    }), /*#__PURE__*/React.createElement(SquareButton, {
      color: "green",
      icon: this.props.first.icon,
      title: this.props.first.title,
      onClick: () => this.props.first.onClick(),
      visable: this.props.first.visable
    }), /*#__PURE__*/React.createElement(SquareButton, {
      color: "green",
      icon: this.props.second.icon,
      title: this.props.second.title,
      onClick: () => this.props.second.onClick(),
      visable: this.props.second.visable
    }), /*#__PURE__*/React.createElement(SquareButton, {
      color: "green",
      icon: this.props.third.icon,
      title: this.props.third.title,
      onClick: () => this.props.third.onClick(),
      visable: this.props.third.visable
    }));
  }

}