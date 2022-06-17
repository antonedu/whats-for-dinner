export default function Popup(props) {
  // TODO: Finish this component here and in css.
  // React Popup component.
  // props.icon is font awesome icon displayed together with popup.
  // props.actions are all actions that can be used on popup.
  let actions = Array(); // Loads buttons from given actions.

  for (let action in props.actions) {
    actions.push();
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "output-item"
  }, /*#__PURE__*/React.createElement("h1", null, props.title, /*#__PURE__*/React.createElement("i", {
    className: props.icon ? "fa fas-" + props.icon : ""
  })), /*#__PURE__*/React.createElement("button", null, /*#__PURE__*/React.createElement("i", {
    className: "fa fas-times"
  })), /*#__PURE__*/React.createElement("p", null, props.info), /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, actions));
}