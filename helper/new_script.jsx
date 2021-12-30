// Constants

// Variables
var activatedCookies = false;

class Dish {
  // Dish class
  constructor(name, weekdays, dates, freq, id) {
    this.name = name;
    this.weekdays = weekdays;
    this.dates = dates;
    this.freq = freq;
    this.id = id;
  };

  get weekdaysStr() {
    // Returns str with active weekdays
    let weekdaysStr = "";
    let weekdaysArray = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    // return "all"
    if (this.allWeekdays()) {
      if (this.weekdays[0] === true) {
        return "all";
      } else {
        return "any";
      }
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

  allWeekdays() {
    // If all days are true/all days are false return true else false
    if (this.weekdays.every((day, index, arr) => {
      return day == arr[0];
    })) {
      return true;
    } else {
      return false;
    };
  }
};

// REACT COMPONENTS
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfDishes: loadStoredDishes(),
      currentlyAddingDish: false,
      cookiesActivated: hasActivatedCookies(),
      headerButtons: {
        first: {
          title: "Add dish",
          icon: "plus",
          onClick: () => this.setState({currentlyAddingDish: true}),
          visable: true
        },
        second: {
          title: "Switch to menu",
          icon: "utensils",
          onClick: () => this.updateHeaderButtons("Menu"),
          visable: true
        },
        third: {
          title: "Settings",
          icon: "cog",
          onClick: () => this.updateHeaderButtons("Settings"),
          visable: true
        }
      },
      content: "Dishes"
    };
  };

  updateLocalStorage() {
    // Updates locale storage to include current version of dishes
    if (JSON.parse(localStorage.getItem("activatedCookies")) === true) {
      localStorage.setItem("dishes", JSON.stringify(this.state.listOfDishes));
    };
  };

  consentToCookies() {
    // Updates local storage if consent changes
    let activated = JSON.parse(localStorage.getItem("activatedCookies"));
    if (this.state.cookiesActivated) {
      this.updateLocalStorage();
    } else {
      localStorage.removeItem("dishes");
    };
    setCookies(!this.state.cookiesActivated);
    this.setState({cookiesActivated: !this.state.cookiesActivated});
  };

  updateHeaderButtons(content) {
    const back = this.state.content == "Dishes" ? "Dishes" : "Menu";
    const headerButtons = {
      Dishes: {
        first: {
          icon: "plus",
          onClick: () => this.setState({currentlyAddingDish: true}),
          visable: true
        },
        second: {
          icon: "utensils",
          onClick: () => this.updateHeaderButtons("Menu"),
          visable: true
        },
        third: {
          icon: "cog",
          onClick: () => this.updateHeaderButtons("Settings"),
          visable: true
        }
      },
      Menu: {
        first: {
          icon: "redo-alt",
          onClick: () => console.log("re-generate"),
          visable: true
        },
        second: {
          icon: "drumstick-bite",
          onClick: () => this.updateHeaderButtons("Dishes"),
          visable: true
        },
        third: {
          icon: "cog",
          onClick: () => this.updateHeaderButtons("Settings"),
          visable: true
        }
      },
      Settings: {
        first: {
          icon: "drumstick-bite",
          onClick: () => this.updateHeaderButtons("Dishes"),
          visable: false
        },
        second: {
          icon: "chevron-left",
          onClick: () => this.updateHeaderButtons(back),
          visable: true
        },
        third: {
          icon: "save",
          onClick: () => console.log("saved"),
          visable: true
        }
      }
    }

    this.setState({
      content: content,
      headerButtons: headerButtons[content]
    })
  }

  async addDish(name, weekdays, dates, freq, id = null) {
    // Creates a new Dish object with a unique ID (and saves it to cookies if enabled)
    let notUnique = true;
    let newDishesObj = Object.assign({}, this.state.listOfDishes);

    if (id === null) {
      do {
        id = generateID(4);
        if (!newDishesObj.hasOwnProperty(id)) {
          notUnique = false;
        };
      } while (notUnique);
    }

    newDishesObj[id] = new Dish(name, weekdays.slice(0), dates, freq, id);
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
    let creatingDish = false;

    if (this.state.currentlyAddingDish) {
      creatingDish = (
        <DishCreateWindow
          editing={false}
          name={""}
          freq={5}
          weekdays={Array(7).fill(false)}
          onClose={() => this.setState({currentlyAddingDish: false})}
          onDelete={() => null}
          onSave={(name, weekdays, freq) => this.addDish(name, weekdays, null, freq)}
        />
      )
    }

    return (
      <React.StrictMode>
      <div id="wrapper">
        <Header first={this.state.headerButtons.first} second={this.state.headerButtons.second} third={this.state.headerButtons.third} />
        <section id="main">
          <div id="output-wrapper">
            <OutputHeader text={this.state.content} />
            <div id="output-items">
              {creatingDish}
              <MenuItem name="def" weekday="mon" day="22" month="may" />
              <MenuItem name="abc" weekday="tue" day="23" month="may" />
              <OutputDivider text={"Week 44"} date={"24 may"} />
              <MenuItem name="sABKfjebvjhl<bsdvjhb<hsbvehilvbilzdfbhoutnajbarjiebvila<bijshueripgvbiarb" weekday="wed" day="24" month="may" />
              <DishesList
                dishes={this.state.listOfDishes}
                onDelete={id => this.removeDish(id)}
                onSave={(name, weekdays, freq, id) => this.addDish(name, weekdays, null, freq, id)}
              />
            </div>
            <button onClick={() => {let id = generateID(4); this.addDish(id, [false, false, false, false, false, false, false], null, 7, id);}}>Click me!</button>
          </div>
        </section>
      </div>
      </React.StrictMode>
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
    return (
      <header>
        <a href="../index.html" id="logo">
          <figure>
            <img src="../assets/logo.png" alt="logo" />
          </figure>
        </a>
        <SquareButton color="green" icon={this.props.first.icon} title={this.props.first.title} onClick={() => this.props.first.onClick()} visable={this.props.first.visable} />
        <SquareButton color="green" icon={this.props.second.icon} title={this.props.second.title} onClick={() => this.props.second.onClick()} visable={this.props.second.visable} />
        <SquareButton color="green" icon={this.props.third.icon} title={this.props.third.title} onClick={() => this.props.third.onClick()} visable={this.props.third.visable} />
      </header>
    );
  };
}

function SquareButton(props) {
  let styling = props.color;
  if (props.visable) {
    styling += " threed-button";
  } else {
    styling += " threed-button no-show"
  }

  return (
    <div className="big-button-wrapper">
      <button title={props.title} alt={props.title} className={styling} onClick={() => props.onClick()}>
        <figure><i className={'fas fa-' + props.icon}></i></figure>
      </button>
    </div>
  );
}

function OutputHeader(props) {
  return (
    <h1 id="output-head">{props.text}</h1>
  )
}

function OutputDivider(props) {
  return (
    <div className="output-divider">
      <p>{props.text}</p>
      <div className="line"></div>
    </div>
  )
}

class DishItem extends React.Component {
  // dish-output-item react component
  // TODO: see other button (setAttribute) when it's time
  // NOTE: remove should be an option after edit has been initialized
  state = {
    collapsed: true,
  }

  render() {
    return (
      <div className={'output-item dish-output-item ' + (this.props.collapsed ? 'collapsed' : 'not-collapsed')}>
        <div className="preview">
          <div className="title">
            <p>{this.props.name}</p>
          </div>
          <div className="collapse-button-wrapper">
            <button className="collapse" onClick={() => this.props.onCollapse(this.props.dishID)}>
              <i className={'fas fa-chevron-' + (this.props.collapsed ? 'down' : 'up')}></i>
            </button>
          </div>
        </div>
        <div className="output-footer">
          <div className="output-info">
            <p>{'Frequency: ' + (this.props.freq)}</p>
            <p>{'Weekdays: ' + (this.props.weekdaysStr)}</p>
          </div>
          <div className="output-button-wrapper">
            <button className="yellow threed-button" onClick={() => this.props.onEdit(this.props.dishID)}>Edit</button>
          </div>
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
      uncollapsedID: null,
      editingID: null
    }
  }

  handleCollapse(id) {
    if (this.state.uncollapsedID == id) {
      this.setState({uncollapsedID: null});
    } else {
      this.setState({uncollapsedID: id});
    }
  }

  handleEdit(id) {
    this.setState({editingID: id});
  }

  handleClose() {
    this.setState({editingID: null});
    this.setState({uncollapsedID: null});
  }

  render() {
    let dishes = Array();
    let currentDish = null;
    for (let key in this.props.dishes) {
      currentDish = this.props.dishes[key]
      if (currentDish.id == this.state.editingID) {
        dishes.push(
          <DishCreateWindow
            editing={true}
            name={currentDish.name}
            freq={currentDish.freq}
            weekdays={currentDish.weekdays}
            key={currentDish.id}
            onClose={() => {this.handleClose();}}
            onDelete={() => {this.props.onDelete(this.state.editingID); this.handleClose()}}
            onSave={(name, weekdays, freq) => {this.props.onSave(name, weekdays, freq, this.state.editingID); this.handleClose()}}
          />
        )
      } else {
        dishes.push(
          <DishItem
            name={currentDish.name}
            freq={currentDish.freq}
            weekdaysStr={currentDish.weekdaysStr}
            dishID={currentDish.id}
            key={key}
            onEdit={id => this.handleEdit(id)}
            collapsed={!(this.state.uncollapsedID == currentDish.id)}
            onCollapse={id => this.handleCollapse(id)}
          />
        )
      }
    }
    return (
      <ul>{dishes.reverse()}</ul>
    )
  }
}

function MenuItem(props) {
  return (
    <div className="output-item menu-output-item" title={props.name}>
      <div className="preview">
        <div className="title">
          <p>{props.name}</p>
        </div>
        <div className="menu-day">
          <div className="weekday">
            <p>{props.weekday}</p>
          </div>
          <div className="date">
            <p>{`${props.day} ${props.month}`}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MenuList(props) {
  return (
    <p></p>
  )
}

class Settings extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let cookiesButton;
    let cookiesWarning = false;

    if (this.props.cookiesActivated) {
      cookiesButton = "revoke access"
      cookiesWarning = " Note that this may cause your add dishes to disappear if you leave or refresh this webpage."
    } else {
      cookiesButton = "give access"
    }

    return (
      <div>
        <p>
          There currently isn't alot of things to do here but you can still <button
            onClick={() => this.props.onConsentToCookies()}
          >
            {cookiesButton}
          </button> to cookies. {cookiesWarning}</p>
      </div>
    )
  }
}

class DishCreateWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      freq: this.props.freq,
      weekdays: this.props.weekdays,
    }
  }

  handleNameChange(name) {
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
          <SquareButton color="yellow" icon="times" title="Cancel" onClick={() => this.props.onClose()} visable={true} />
          <div className="divider"></div>
          <SquareButton color="red" icon="trash-alt" title="Remove" onClick={() => this.props.onDelete()} visable={this.props.editing} />
          <SquareButton color="green" icon="save" title="Save" onClick={() => this.props.onSave(this.state.name, this.state.weekdays, this.state.freq)} visable={true} />
        </div>
      </div>
    )
  }
}

function DishNameInput(props) {
  return (
    <input type="text" placeholder="Dish name" value={props.value} onChange={() => props.onChange(event.target.value)} />
  )
}

class RangeInput extends React.Component {
  // TODO: Needs save/delete actions
  constructor(props) {
    super(props);
    this.state = {
      fraction: (this.props.value - this.props.min)/(this.props.max - this.props.min),
    }
  }

  onInput() {
    this.setState({fraction: (event.target.value - this.props.min)/(this.props.max - this.props.min)})
  }

  render() {
    return (
      <input
        type="range"
        min={this.props.min}
        value={this.props.value}
        style={{background: "linear-gradient(to right, #20a39e calc(" + this.state.fraction + "*(100% - 10px) + 5px), #156D69 calc(" + this.state.fraction + "*(100% - 10px) + 5px))"}}
        max={this.props.max}
        onChange={() => this.props.onChange(event.target.value)}
        onInput={() => this.onInput()}
      />
    )
  }
}

class WeekdayCheckbox extends React.Component {
  constructor(props) {
    super(props);
  }

  onChange() {
    this.setState({checked: event.target.checked})
  }

  render() {
    return (
      <div className="checkbox-container">
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

function Popup(props) {
  let actions = Array();
  for (action in props.actions) {
    actions.push(
      // TEMP: actions button syntax
    )
  }

  return (
    <div className="output-item">
      <h1>{props.title}<i className={props.icon ? "fa fas-" + props.icon : ""}></i></h1>
      <button><i className="fa fas-times"></i></button>
      <p>{props.info}</p>
      <div className="actions">
        {actions}
      </div>
    </div>
  )
}

class CookiesWindow extends React.Component {

}

ReactDOM.render(<App />, document.getElementById("root"))

// End of React components

function setCookies(consented) {
  if (typeof consented == "boolean") {
    localStorage.setItem("activatedCookies", consented.toString());
    return true;
  } else {
    return false;
  }
}

function hasActivatedCookies() {
  let activated = JSON.parse(localStorage.getItem("activatedCookies"));
  if (activated) {
    return true;
  } else {
    return false;
  }
}

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
// TODO: Generate menu function
// TODO: Create functions for date/week handeling
/* NOTE: Generate menu function should be entirely based on dishes and
their data in menu Array. So that data from it can be shared between devices. */

/* NOTE: What should be in settings?
  - Theme (light/dark)
  - Start of week (monday/sunday)
  - Numbers of meals in a day (1, 2, 3...)
  - Only use dishes with specified weekdays on their specified days (true/false)
  - Always show whole weeks (true/false)
  - Round down dish date on months with fewer days (true/false)
 */

 // QUESTION: Rewrite to use hooks instead of classes?
 // QUESTION: Firefox support?
