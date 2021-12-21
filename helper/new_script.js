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

  updateLocalStorage() {
    // Updates locale storage to include current version of dishes
    if (JSON.parse(localStorage.getItem("activatedCookies")) === true) {
      localStorage.setItem("dishes", JSON.stringify(this.state.listOfDishes));
    };
  };

  async addDish(name, weekdays, dates, freq) {
    // Creates a new Dish object with a unique ID (and saves it to cookies if enabled)
    let id;
    let notUnique = true;
    let newDishesObj = Object.assign({}, this.state.listOfDishes);

    do {
      id = generateID(4);
      if (!newDishesObj.hasOwnProperty(id)) {
        notUnique = false;
      };
    } while (notUnique);

    newDishesObj[id] = new Dish(id, weekdays.slice(0), dates, freq, id);
    await this.setState({listOfDishes: newDishesObj});
    this.updateLocalStorage();
  };

  async removeDish(id) {
    let newDishesObj = Object.assign({}, this.state.listOfDishes);
    if (newDishesObj.hasOwnProperty(id)) {
      delete newDishesObj[id];
    }
    await this.setState({listOfDishes: newDishesObj});
    this.updateLocalStorage();
  }

  render() {
    return (
      <div id="wrapper">
      <Header />
      <section id="main">
        <div id="output-wrapper">
          <OutputHead text={"Dishes"} />
          <div id="output-items">
            <DishesList onRemove={id => this.removeDish(id)} dishes={this.state.listOfDishes} />
          </div>
          <button onClick={() => {this.addDish("test", [false, false, false, false, false, false, false], null, 7)}}>Click me!</button>
        </div>
      </section>
      </div>
    )
  }
};

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeButtons: ["add", "change", "settings"],
    };
  };

  render() {
    const buttons = this.state.activeButtons.map((button) => {
        <HeaderButton onClick={() => console.log("temp")} />
      }
    );

    return (
      <header>
        <a href="../index.html" id="logo">
          <figure>
            <img src="../assets/logo.png" alt="logo" />
          </figure>
        </a>
        <HeaderButton icon="plus" onClick={() => console.log("createDish")} />
        <HeaderButton icon="redo-alt" onClick={() => console.log("regenerateMenu")} />
        <HeaderButton icon="utensils" onClick={() => console.log("changeToMenuView")} />
      </header>
    );
  };
}

function HeaderButton(props) {
  return (
    <div className="header-button-wrapper">
      <button className="green threed-button" onClick={() => props.onClick()}>
        <figure><i className={'fas fa-' + props.icon}></i></figure>
      </button>
    </div>
  );
}

function OutputHead(props) {
  return (
    <h1 id="output-head">{props.text}</h1>
  )
}

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
          <button className="red threed-button" onClick={() => this.props.onRemove(this.props.id)}>Remove</button>
        </div>
      </div>
    )
  }
}

class DishesList extends React.Component {
  // Unordered list of all dishes used when loadDishes is called
  constructor(props) {
    super(props);
    this.state = {
      collapsedID = null,
    }
  }

  handleCollapse(id) {
    if (this.state.collapsedID == id) {
      this.setState({collapsedID: null})
    } else {
      this.setState({collapsedID: id})
    }
  }

  render() {
    const dishes = Array();
    let currentDish = null;
    for (let key in this.props.dishes) {
      currentDish = this.props.dishes[key]
      // console.log(key)
      dishes.push(
        <OutputDish
          name={currentDish.name}
          freq={currentDish.freq}
          weekdaysStr={currentDish.weekdaysStr}
          id={currentDish.id}
          key={key}
          onRemove={id => this.props.onRemove(id)}
        />
      )
    }
    return (
      <ul>{dishes}</ul>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("root"))

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

function loadStoredDishes() {
  let storedDishes = null;
  let loadedDishes = Object();
  if (JSON.parse(localStorage.getItem('activatedCookies'))) {
    storedDishes = JSON.parse(localStorage.getItem('dishes'));
  };
  if (storedDishes) {
    for (let key in storedDishes) {
      loadedDishes[key] = dishFromObject(storedDishes[key])
    };
  };
  return loadedDishes;
}

function dishFromObject(obj) {
  // Converts a dish-like object into a dish
  // Used when loading dishes from local storage
  return new Dish(obj.name, obj.weekdays, obj.dates, obj.freq, obj.id);
}

function generateID(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// TODO: Ask about cookies.
// TODO: Edit dish function.
// TODO: Generate menu function
/* NOTE: Generate menu function should be entirely based on dishes and
their data in menu Array. So that data from it can be shared between devices. */
