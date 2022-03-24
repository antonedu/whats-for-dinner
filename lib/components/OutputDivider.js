export default function OutputDivider(props) {
  // React component that divides items.
  if (props.text != null && props.text.length > 0) {
    // props.text is text displayed to the left of the line of the divider.
    return /*#__PURE__*/React.createElement("div", {
      className: "output-divider"
    }, /*#__PURE__*/React.createElement("p", null, props.text), /*#__PURE__*/React.createElement("div", {
      className: "line"
    }));
  } else {
    return /*#__PURE__*/React.createElement("div", {
      className: "output-divider"
    }, /*#__PURE__*/React.createElement("div", {
      className: "line"
    }));
  }
}