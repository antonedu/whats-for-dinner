export default class WeekdayCheckbox extends React.Component {
    // React component for checkboxes in <DishCreateWindow /> component.
    // Used by <DishCreateWindow /> to decide which weekdays should be activated
    // in a Dish object.
  
    // props.weekday is the weekday checkbox is associated with.
    // props.checked is used to keep track of checkbox value.
    // onChange functions updated weekdays array in <DishCreateWindow /> so that
    // correct weekdays are saved to Dish object.
    constructor(props) {
      super(props);
    }
  
    render() {
      return (
        <div className="checkbox-container green">
          <input
            type="checkbox"
            title={this.props.weekday}
            checked={this.props.checked}
            data-letter={this.props.weekday[0].toUpperCase()}
            onChange={() => this.props.onChange()}
          />
        </div>
      )
    }
  }