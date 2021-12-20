// Constants

// Variables
var activatedCookies = false;

class Dish {
  // Dish class
  constructor(name, weekdays, dates, freq, id) {
    this.name = name;
    this.weekdays = this.replaceWeekdays(weekdays);
    this.dates = dates;
    this.freq = freq;
    this.id = id;
  };

  get weekdaysStr() {
    // Returns str with active weekdays
    let weekdaysStr = "";
    let weekdaysArray = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    if (this.weekdays == 0) {
      return "all"
    };
    for (let i = 0; i < 7; i++) {
      if (this.weekdays[i] == true) {
        if (weekdaysStr.length == 0) {
          weekdaysStr += weekdaysArray[i];
        } else {
          weekdaysStr += ", " + weekdaysArray[i];
        };
      };
    };
    return weekdaysStr
  };

  replaceWeekdays(weekdays) {
    // Replaces a weekdays array with sure if all 7 indexes have the same value
    let equalsFirst = (day, index, arr) => {
      return day == arr[0];
    };
    if (weekdays === 0 || weekdays.every(equalsFirst)) {
      return 0
    } else {
      return weekdays
    };
  }
};

// REACT COMPONENTS
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfDishes: loadStoredDishes(),
    };
  };

  handleRemove() {
    this.setState({listOfDishes: this.state.listOfDishes.concat(dishFromObject({name: 'b', weekdays: 0, dates: null, freq: 8, id: 2}))})
  }

  updateLocalStorage() {
    // Updates locale storage to include current version of dishes
    if (JSON.parse(localStorage.getItem("activatedCookies")) === true) {
      localStorage.setItem("dishes", JSON.stringify(this.state.listOfDishes));
    };
  };

  render() {
    return (
      <DishesList onRemove={() => this.handleRemove()} dishes={this.state.listOfDishes} />
    )
  }
};

class OutputDish extends React.Component {
  // output-item react component
  // TODO: see other button (setAttribute) when it's time
  // NOTE: remove should be an option after edit has been initialized
  state = {
    collapsed: true,
  }

  render() {
    return (
      <div className={'output-item ' + (this.state.collapsed ? 'collapsed' : 'not-collapsed')}>
        <p>{this.props.name}</p>
        <button className="collapse" onClick={() => this.setState({collapsed: !this.state.collapsed})}>
          <i className={'fas fa-chevron-' + (this.state.collapsed ? 'down' : 'up')}></i>
        </button>
        <div className="output-info">
          <p>{'Frequency: ' + (this.props.freq)}</p>
          <p>{'Weekdays: ' + (this.props.weekdaysStr)}</p>
        </div>
        <div className="output-button-wrapper">
          <button className="red threed-button" onClick={() => this.props.onRemove()}>Remove</button>
        </div>
      </div>
    )
  }
}

class DishesList extends React.Component {
  // Unordered list of all dishes used when loadDishes is called
  render() {
    const dishes = this.props.dishes.map((dish) => {
      return (<OutputDish
        // key={dish.id}
        name={dish.name}
        freq={dish.freq}
        weekdaysStr={dish.weekdaysStr}
        id={dish.id}
        onRemove={() => this.props.onRemove()}
      />)});
      return (
        <ul>{dishes}</ul>
      )
  }
}

ReactDOM.render(<App />, document.getElementById("output-items"))

// End of React components

function consentToCookies(consented) {
  // Updates local storage if consent changes
  let activated = JSON.parse(localStorage.getItem("activatedCookies"));
  if (consented === true && activated != true) {
    updateLocalStorage();
    localStorage.setItem("activatedCookies", "true");
  } else if (consented === false && activated != false) {
    localStorage.removeItem("dishes");
    localStorage.setItem("activatedCookies", "false");
  };
};

function createDish(name, weekdays, dates, freq, id) {
  // Creates a new Dish object and saves it to cookies if enabled
  let dish = new Dish(name, weekdays.slice(0), dates, freq, id);
  updateLocalStorage();
};

function loadStoredDishes() {
  let storedDishes = null;
  let loadedDishes = Object();
  if (JSON.parse(localStorage.getItem('activatedCookies'))) {
    storedDishes = JSON.parse(localStorage.getItem('dishes'));
  };
  if (storedDishes) {
    for (let key in storedDishes) {
      loadedDishes[key] = dishFromObject
    };
  };
  return loadedDishes;
}

function dishFromObject(obj) {
  // Converts a dish-like object into a dish
  // Used when loading dishes from local storage
  return new Dish(obj.name, obj.weekdays, obj.dates, obj.freq, obj.id);
}

// TODO: Ask about cookies.
// TODO: Edit dish function.
// TODO: Generate menu function
// TODO: Figure out a way to have unique id's for dishes
// TODO: Rewrite dishes represenation to be a object with random 6> letter string in base62 for search speed in
/* NOTE: Generate menu function should be entirely based on dishes and
their data in menu Array. So that data from it can be shared between devices. */
