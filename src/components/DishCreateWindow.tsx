import DishNameInput from "./DishNameOutput.js";
import RangeInput from "./RangeInput.js";
import WeekdayCheckbox from "./WeekdayCheckbox.js";
import SquareButton from "./SquareButton.js";

type Weekdays = [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];
type Freq = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type IProps = {
  name: string,
  freq: Freq,
  weekdays: Weekdays,
  onClose: () => void,
  onDelete: () => void,
  onSave: (name: string, weekdays: Weekdays, freq: Freq) => void
}

type IState = {
  name: string,
  freq: Freq,
  weekdays: Weekdays,
}

export default class DishCreateWindow extends React.Component<IProps, IState> {
    // React component displayed when a dish is being added/edited
  
    // props.name/freq/weekdays are used to display info already put in when
    // editing a dish
    constructor(props: IProps) {
      super(props);
      this.state = {
        name: this.props.name,
        freq: this.props.freq,
        weekdays: this.props.weekdays,
      }
    }
  
    // functions for handeling input fields see components below.
    handleNameChange(name: string) {
      this.setState({name: name});
    }
  
    handleWeekdayChange(weekday) {
      let newWeekdays = this.state.weekdays.slice()
      newWeekdays[weekday] = !newWeekdays[weekday]
      this.setState({weekdays: newWeekdays})
    }
  
    handleFreqChange(freq) {
      this.setState({freq: freq});
    }
  
    render() {
      return (
        <div className="output-item create-output-item">
          <div>
            <DishNameInput value={this.state.name} onChange={name => this.handleNameChange(name)} />
          </div>
          <div>
            <p className="description">How frequently do you want this dish to appear?</p>
            <RangeInput min={1} max={10} value={this.state.freq} onChange={freq => this.handleFreqChange(freq)} />
          </div>
          <div>
            <p className="description">On what weekdays do you want this dish to appear?</p>
            <div className="weekday-selectors">
              <WeekdayCheckbox weekday="monday" checked={this.state.weekdays[0]} onChange={() => this.handleWeekdayChange(0)} />
              <WeekdayCheckbox weekday="tuesday" checked={this.state.weekdays[1]} onChange={() => this.handleWeekdayChange(1)} />
              <WeekdayCheckbox weekday="wednesday" checked={this.state.weekdays[2]} onChange={() => this.handleWeekdayChange(2)} />
              <WeekdayCheckbox weekday="thursday" checked={this.state.weekdays[3]} onChange={() => this.handleWeekdayChange(3)} />
              <WeekdayCheckbox weekday="friday" checked={this.state.weekdays[4]} onChange={() => this.handleWeekdayChange(4)} />
              <WeekdayCheckbox weekday="saturday" checked={this.state.weekdays[5]} onChange={() => this.handleWeekdayChange(5)} />
              <WeekdayCheckbox weekday="sunday" checked={this.state.weekdays[6]} onChange={() => this.handleWeekdayChange(6)} />
            </div>
          </div>
          <div className="actions">
            <SquareButton color="yellow" icon="times" title="Cancel" onClick={() => this.props.onClose()} visible={true} />
            <div className="divider"></div>
            <SquareButton color="red" icon="trash-alt" title="Remove" onClick={() => this.props.onDelete()} visible={this.props.editing} />
            <SquareButton color="green" icon="save" title="Save" onClick={() => this.props.onSave(this.state.name, this.state.weekdays, this.state.freq)} visible={true} />
          </div>
        </div>
      )
    }
  }