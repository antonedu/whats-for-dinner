import SquareButton from "./SquareButton.js";
export default function Header(props) {
  // React component for header of <App />.
  // props.first/second/third are info about the three buttons in header.
  // ..icon is font awesome icon of button.
  // ..title is title displayed on hover describing what happens when clicked.
  // ..visable is wether button is visable or not.
  // ..onClick is what happens when button is clicked.
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
    icon: props.first.icon,
    title: props.first.title,
    onClick: () => props.first.onClick(),
    visible: props.first.visible
  }), /*#__PURE__*/React.createElement(SquareButton, {
    color: "green",
    icon: props.second.icon,
    title: props.second.title,
    onClick: () => props.second.onClick(),
    visible: props.second.visible
  }), /*#__PURE__*/React.createElement(SquareButton, {
    color: "green",
    icon: props.third.icon,
    title: props.third.title,
    onClick: () => props.third.onClick(),
    visible: props.third.visible
  }));
}