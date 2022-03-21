export default class RangeInput extends React.Component {
  // React component for range slider in <DishCreateWindow />
  // TODO: Should show value of range slider to left?/right?.
  // props.min/max defines max and min of range to make it more reusable if
  // needed.
  // props.value sets value show on range.
  // onChange function updates value of range saved in <DishCreateWindow />
  // onInput makes sure left side of slider is updated when slider thumb is
  // moved
  constructor(props) {
    super(props);
    this.state = {
      // Used to update color to the left of the range thumb.
      fraction: (this.props.value - this.props.min) / (this.props.max - this.props.min)
    };
  }

  onInput() {
    this.setState({
      fraction: (event.target.value - this.props.min) / (this.props.max - this.props.min)
    });
  }

  render() {
    return /*#__PURE__*/React.createElement("input", {
      type: "range",
      className: "green",
      min: this.props.min,
      value: this.props.value,
      style: {
        background: "linear-gradient(to right, var(--bg-color) calc(" + this.state.fraction + "*(100% - 10px) + 5px), var(--s-color) calc(" + this.state.fraction + "*(100% - 10px) + 5px))"
      },
      max: this.props.max,
      onChange: () => this.props.onChange(event.target.value),
      onInput: () => this.onInput()
    });
  }

}