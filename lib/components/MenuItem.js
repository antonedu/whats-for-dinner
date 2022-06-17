export default function MenuItem(props) {
  // React component for items displayed in <MenuList />
  // props.name is the name of the dish
  // props.weekday is the weekday that the <MenuItem /> is on.
  // props.day/month is day/month that the <MenuItem /> is on.
  return /*#__PURE__*/React.createElement("div", {
    className: "output-item menu-output-item",
    title: props.name
  }, /*#__PURE__*/React.createElement("div", {
    className: "preview"
  }, /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, /*#__PURE__*/React.createElement("p", null, props.name)), /*#__PURE__*/React.createElement("div", {
    className: "menu-day"
  }, /*#__PURE__*/React.createElement("div", {
    className: "weekday"
  }, /*#__PURE__*/React.createElement("p", null, props.weekday)), /*#__PURE__*/React.createElement("div", {
    className: "date"
  }, /*#__PURE__*/React.createElement("p", null, "".concat(props.day, " ").concat(props.month))))));
}