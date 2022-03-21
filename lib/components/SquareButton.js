export default function SquareButton(props) {
  // React component of square buttons which have a font awesome icon and an
  // onClick function as props.
  // props.visable says wether button should be displayed or not.
  let styling = props.color;

  if (props.visable) {
    styling += " threed-button";
  } else {
    styling += " threed-button no-show";
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "big-button-wrapper"
  }, /*#__PURE__*/React.createElement("button", {
    title: props.title,
    alt: props.title,
    className: styling,
    onClick: () => props.onClick()
  }, /*#__PURE__*/React.createElement("figure", null, /*#__PURE__*/React.createElement("i", {
    className: 'fas fa-' + props.icon
  }))));
}