// Constants

// Variables
var dishArray = new Array();
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
class OutputDish extends React.Component {
  // output-item react component
  // TODO: see other button (setAttribute) when it's time
  // NOTE: remove should be an option after edit has been initialized
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    }
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
          <button className="red threed-button" onClick={() => console.log("removed")}>Remove</button>
        </div>
      </div>
    )
  }
}

function DishesList(props) {
  // Unordered list of all dishes used when loadDishes is called
  const dishes = dishArray.map((dish) => {
    return (<OutputDish
      key={dish.id}
      name={dish.name}
      freq={dish.freq}
      weekdaysStr={dish.weekdaysStr}
      id={dish.id}
    />)});
    return (
      <ul>{dishes}</ul>
    )
}

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

function updateLocalStorage() {
  // Updates locale storage to include current version of dishes
  if (JSON.parse(localStorage.getItem("activatedCookies")) === true) {
    localStorage.setItem("dishes", JSON.stringify(dishArray));
  };
};

function loadDishes() {
  // Loads all dishes to html
  ReactDOM.render(<DishesList />, document.getElementById("output-items"))
};

function createDish(name, weekdays, dates, freq, id) {
  // Creates a new Dish object and saves it to cookies if enabled
  let dish = new Dish(name, weekdays.slice(0), dates, freq, id);
  addDish(dish);
  updateLocalStorage();
};

function addDish(dish) {
  // Adds dish to dishes array
  dishArray.push(dish);
};

function dishFromObject(obj) {
  // Converts a dish-like object into a dish
  // Used when loading dishes from local storage
  try {
    addDish(new Dish(obj.name, obj.weekdays, obj.dates, obj.freq, obj.id));
  } catch (err) {
    console.log(err);
  };
};

function loadStoredDishes() {
  let storedObjs = null;
  if (JSON.parse(localStorage.getItem('activatedCookies'))) {
    storedObjs = JSON.parse(localStorage.getItem('dishes'));
  }
  if (storedObjs) {
    for (let obj of storedObjs) {
      dishFromObject(obj)
    }
  }
}

loadStoredDishes();
loadDishes();

// TODO: Ask about cookies.
// TODO: Edit dish function.
// TODO: Generate menu function
/* NOTE: Generate menu function should be entirely based on dishes and
their data in menu Array. So that data from it can be shared between devices. */
