export default class DishItem extends React.Component {
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
  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: 'output-item dish-output-item ' + (this.props.collapsed ? 'collapsed' : 'not-collapsed')
    }, /*#__PURE__*/React.createElement("div", {
      className: "preview"
    }, /*#__PURE__*/React.createElement("div", {
      className: "title"
    }, /*#__PURE__*/React.createElement("p", null, this.props.name)), /*#__PURE__*/React.createElement("div", {
      className: "collapse-button-wrapper"
    }, /*#__PURE__*/React.createElement("button", {
      className: "collapse",
      onClick: () => this.props.onCollapse(this.props.dishID)
    }, /*#__PURE__*/React.createElement("i", {
      className: 'fas fa-chevron-' + (this.props.collapsed ? 'down' : 'up')
    })))), /*#__PURE__*/React.createElement("div", {
      className: "output-footer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "output-info"
    }, /*#__PURE__*/React.createElement("p", null, 'Frequency: ' + this.props.freq), /*#__PURE__*/React.createElement("p", null, 'Weekdays: ' + this.props.weekdaysStr)), /*#__PURE__*/React.createElement("div", {
      className: "output-button-wrapper"
    }, /*#__PURE__*/React.createElement("button", {
      className: "yellow threed-button",
      onClick: () => this.props.onEdit(this.props.dishID)
    }, "Edit"))));
  }

}