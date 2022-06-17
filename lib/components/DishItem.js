export default function DishItem(props) {
  // React component for items displayed in <DishesList />
  // props.collapsed says wether item should be displayed as collapsed or
  // not.
  // props.name is the name of the dish associated with <DishItem />.
  // props.dishID ID of dish associated with <DishItem />.
  // props.freq frequency of dish associated with <DishItem />.
  // props.weekdaysStr is a String of all days that the dish is activated.
  // onCollapse tells <DishesList /> that dish currently to toggle collapsed on
  // associated dish.
  // onEdit tells <DishesList /> that dish being displayed as being edited
  // should be this one.
  return /*#__PURE__*/React.createElement("div", {
    className: 'output-item dish-output-item ' + (props.collapsed ? 'collapsed' : 'not-collapsed')
  }, /*#__PURE__*/React.createElement("div", {
    className: "preview"
  }, /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, /*#__PURE__*/React.createElement("p", null, props.name)), /*#__PURE__*/React.createElement("div", {
    className: "collapse-button-wrapper"
  }, /*#__PURE__*/React.createElement("button", {
    className: "collapse",
    onClick: () => props.onCollapse(props.dishID)
  }, /*#__PURE__*/React.createElement("i", {
    className: 'fas fa-chevron-' + (props.collapsed ? 'down' : 'up')
  })))), /*#__PURE__*/React.createElement("div", {
    className: "output-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "output-info"
  }, /*#__PURE__*/React.createElement("p", null, 'Frequency: ' + props.freq), /*#__PURE__*/React.createElement("p", null, 'Weekdays: ' + props.weekdaysStr)), /*#__PURE__*/React.createElement("div", {
    className: "output-button-wrapper"
  }, /*#__PURE__*/React.createElement("button", {
    className: "yellow threed-button",
    onClick: () => props.onEdit(props.dishID)
  }, "Edit"))));
}