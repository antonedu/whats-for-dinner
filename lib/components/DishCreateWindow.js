import DishNameInput from "./DishNameOutput.js";
import RangeInput from "./RangeInput.js";
import WeekdayCheckbox from "./WeekdayCheckbox.js";
import SquareButton from "./SquareButton.js";
export default class DishCreateWindow extends React.Component {
  // React component displayed when a dish is being added/edited
  // props.name/freq/weekdays are used to display info already put in when
  // editing a dish
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      freq: this.props.freq,
      weekdays: this.props.weekdays
    };
  } // functions for handeling input fields see components below.


  handleNameChange(name) {
    this.setState({
      name: name
    });
  }

  handleWeekdayChange(weekday) {
    let newWeekdays = this.state.weekdays.slice();
    newWeekdays[weekday] = !newWeekdays[weekday];
    this.setState({
      weekdays: newWeekdays
    });
  }

  handleFreqChange(freq) {
    this.setState({
      freq: freq
    });
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "output-item create-output-item"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DishNameInput, {
      value: this.state.name,
      onChange: name => this.handleNameChange(name)
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "description"
    }, "How frequently do you want this dish to appear?"), /*#__PURE__*/React.createElement(RangeInput, {
      min: 1,
      max: 10,
      value: this.state.freq,
      onChange: freq => this.handleFreqChange(freq)
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "description"
    }, "On what weekdays do you want this dish to appear?"), /*#__PURE__*/React.createElement("div", {
      className: "weekday-selectors"
    }, /*#__PURE__*/React.createElement(WeekdayCheckbox, {
      weekday: "monday",
      checked: this.state.weekdays[0],
      onChange: () => this.handleWeekdayChange(0)
    }), /*#__PURE__*/React.createElement(WeekdayCheckbox, {
      weekday: "tuesday",
      checked: this.state.weekdays[1],
      onChange: () => this.handleWeekdayChange(1)
    }), /*#__PURE__*/React.createElement(WeekdayCheckbox, {
      weekday: "wednesday",
      checked: this.state.weekdays[2],
      onChange: () => this.handleWeekdayChange(2)
    }), /*#__PURE__*/React.createElement(WeekdayCheckbox, {
      weekday: "thursday",
      checked: this.state.weekdays[3],
      onChange: () => this.handleWeekdayChange(3)
    }), /*#__PURE__*/React.createElement(WeekdayCheckbox, {
      weekday: "friday",
      checked: this.state.weekdays[4],
      onChange: () => this.handleWeekdayChange(4)
    }), /*#__PURE__*/React.createElement(WeekdayCheckbox, {
      weekday: "saturday",
      checked: this.state.weekdays[5],
      onChange: () => this.handleWeekdayChange(5)
    }), /*#__PURE__*/React.createElement(WeekdayCheckbox, {
      weekday: "sunday",
      checked: this.state.weekdays[6],
      onChange: () => this.handleWeekdayChange(6)
    }))), /*#__PURE__*/React.createElement("div", {
      className: "actions"
    }, /*#__PURE__*/React.createElement(SquareButton, {
      color: "yellow",
      icon: "times",
      title: "Cancel",
      onClick: () => this.props.onClose(),
      visable: true
    }), /*#__PURE__*/React.createElement("div", {
      className: "divider"
    }), /*#__PURE__*/React.createElement(SquareButton, {
      color: "red",
      icon: "trash-alt",
      title: "Remove",
      onClick: () => this.props.onDelete(),
      visable: this.props.editing
    }), /*#__PURE__*/React.createElement(SquareButton, {
      color: "green",
      icon: "save",
      title: "Save",
      onClick: () => this.props.onSave(this.state.name, this.state.weekdays, this.state.freq),
      visable: true
    })));
  }

}