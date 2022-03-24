export default function DishNameInput(props) {
  // React component for name input in <DishCreateWindow />
  return /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Dish name",
    value: props.value,
    onChange: event => props.onChange(event.target.value)
  });
}