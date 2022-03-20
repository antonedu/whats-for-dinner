// Imports
import "../lib/ISO8601dates.js";

class Dish {
  // Dish class
  constructor(name, weekdays, dates, freq, id, lastSeen = null) {
    this.name = name;
    this.weekdays = weekdays;
    this.dates = dates;
    this.freq = freq;
    this.id = id;
    this.lastSeen = lastSeen;
  };

  get weekdaysStr() {
    // Returns str with active weekdays
    let weekdaysStr = "";
    let weekdaysArray = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
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
  // React component for whats-for-dinner app.
  // state.dishes should be all added dishes, already added dishes are
  // loaded from cookies if they are activated.
  // state.currentlyAddingDish says wether a <DishCreateWindow /> should be
  // displayed at the top of outputs (only if state.content is "Dishes").
  // state.cookiesActivated says wether user has cookies activated.
  // state.headerButtons are info passed to buttons of <Header /> component.
  // see Header class for more indepth explanation.
  // state.content describes what is currently being displayed as output.
  constructor(props) {
    super(props);
    let storedDishes = loadStoredDishes()
    this.state = {
      dishes: storedDishes,
      menu: loadStoredMenu(storedDishes),
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
          onClick: () => {this.updateHeaderButtons("Menu");},
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

  consentToCookies() {
    // Updates local storage if consent changes
    let activated = !this.state.cookiesActivated;
    setCookies(activated, this.state.dishes, this.state.menu);
    this.setState({cookiesActivated: activated});
  };

  updateHeaderButtons(content) {
    // Updates state.headerButtons and state.content when user switches
    // displayed content.
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
          onClick: () => this.handleResetMenu(),
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
          onClick: () => this.handleSaveSettings(),
          visable: true
        }
      }
    }

    this.setState({
      content: content,
      headerButtons: headerButtons[content]
    })
  }

  addDish(name, weekdays, dates, freq, id = null) {
    // Creates a new Dish object with a unique ID (and saves it to cookies if
    // enabled)
    // Also used when editing dishes and saving, then id is id of dish that
    // should change.
    let newDishesObj = Object.assign({}, this.state.dishes);

    if (id === null) {
      id = generateUniqueID(4, newDishesObj);
    }

    newDishesObj[id] = new Dish(name, weekdays.slice(0), dates, freq, id);
    this.setState({dishes: newDishesObj});
    updateStoredDishes(newDishesObj);
  };

  removeDish(id) {
    // Removes an added dish.
    let newDishesObj = Object.assign({}, this.state.dishes);
    if (newDishesObj.hasOwnProperty(id)) {
      delete newDishesObj[id];
    }
    this.setState({dishes: newDishesObj});
    updateStoredDishes(newDishesObj);
  }

  handleResetMenu() {
    // Resets menu and generates first 7 days of a new one.
    let updatedDishes = Object.assign({}, this.state.dishes)
    let resetMenu = regenerateMenu(updatedDishes, new Date());
    resetMenu = generateNextX(updatedDishes, resetMenu, 7);
    resetMenu = catchUpMenu(updatedDishes, resetMenu);
    updateStoredMenu(resetMenu);
    this.setState({
      dishes: updatedDishes,
      menu: resetMenu,
    })
    updateStoredDishes(updatedDishes)
    updateStoredMenu(resetMenu);
  }

  render() {
    let renderedOutput;

    if (this.state.content == "Dishes") {
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
      renderedOutput = (
        <div>
          {creatingDish}
          <DishesList
            dishes={this.state.dishes}
            onDelete={id => this.removeDish(id)}
            onSave={(name, weekdays, freq, id) => this.addDish(name, weekdays, null, freq, id)}
          />
        </div>
      )
    } else if (this.state.content == "Menu") {
      renderedOutput = (
        <div>
          <MenuList
            menu={this.state.menu}
            dishes={this.state.dishes}
            onShowMore={() => {
              let extendedMenu = generateNextX(this.state.dishes, this.state.menu, 7);
              this.setState({menu: extendedMenu});
              updateStoredMenu(extendedMenu);
            }
          }
          />
        </div>
      )
    } else if (this.state.content == "Settings") {
      renderedOutput = (
        <div>
          <Settings
            onConsentToCookies={() => this.consentToCookies()}
            cookiesActivated={this.state.cookiesActivated}
          />
        </div>
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
              {renderedOutput}
            </div>
          </div>
        </section>
      </div>
      </React.StrictMode>
    )
  }
};

class Header extends React.Component {
  // React component for header of <App />.
  // props.first/second/third are info about the three buttons in header.
  // ..icon is font awesome icon of button.
  // ..title is title displayed on hover describing what happens when clicked.
  // ..visable is wether button is visable or not.
  // ..onClick is what happens when button is clicked.
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
        <div className="filler"></div>
        <SquareButton color="green" icon={this.props.first.icon} title={this.props.first.title} onClick={() => this.props.first.onClick()} visable={this.props.first.visable} />
        <SquareButton color="green" icon={this.props.second.icon} title={this.props.second.title} onClick={() => this.props.second.onClick()} visable={this.props.second.visable} />
        <SquareButton color="green" icon={this.props.third.icon} title={this.props.third.title} onClick={() => this.props.third.onClick()} visable={this.props.third.visable} />
      </header>
    );
  };
}

function SquareButton(props) {
  // React component of square buttons which have a font awesome icon and an
  // onClick function as props.
  // props.visable says wether button should be displayed or not.
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
  // React component for header of outputs.
  return (
    <h1 id="output-head">{props.text}</h1>
  )
}

function OutputDivider(props) {
  // React component that divides items.

  // props.text is text displayed to the left of the line of the divider.
  return (
    <div className="output-divider">
      <p>{props.text}</p>
      <div className="line"></div>
    </div>
  )
}

class DishItem extends React.Component {
  // React component for items displayed in <DishesList />

  // props.collapsed says wether item should be displayed as collapsed or
  // not.
  // props.name is the name of the dish associated with <DishItem />.
  // props.dishID ID of dish associated with <DishItem />.
  // props.freq frequency of dish associated with <DishItem />.
  // props.weekdaysStr is a String of all days that the dish is activated.
  // onCollapse tells <DishesList /> that dish currently to toggle collapsed on
  // associated dish.
  // onEdit tells <DishesList /> that dish being displayed as being edited
  // should be this one.

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
  // React component with an unordered list of all added dishes.

  // state.uncollapsedID dishID of <DishItem /> not collapsed if any.
  // state.editingID dishID of <DishItem /> currently being edited if there is
  // one (<DishCreateWindow />).
  // props.dishes should be added dishes.
  constructor(props) {
    super(props);
    this.state = {
      uncollapsedID: null,
      editingID: null
    }
  }

  // handle function used when collapse button is pressed.
  // opens and closes based on previous state.
  // closes others that are open if there is any.
  handleCollapse(id) {
    if (this.state.uncollapsedID == id) {
      this.setState({uncollapsedID: null});
    } else {
      this.setState({uncollapsedID: id});
    }
  }

  // Handle functions passed on to buttons of <DishItem /> that is currently
  // being edited (so in reality <DishCreateWindow />).
  handleEdit(id) {
    this.setState({editingID: id});
  }

  handleCloseEdit() {
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
            onClose={() => {this.handleCloseEdit();}}
            onDelete={() => {this.props.onDelete(this.state.editingID); this.handleCloseEdit()}}
            onSave={(name, weekdays, freq) => {this.props.onSave(name, weekdays, freq, this.state.editingID); this.handleCloseEdit()}}
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
  // React component for items displayed in <MenuList />

  // props.name is the name of the dish
  // props.weekday is the weekday that the <MenuItem /> is on.
  // props.day/month is day/month that the <MenuItem /> is on.
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
  // React component displayed in output when menu is viewed.
  // if (props.menu == [] || props.menu == null) {
  //   return (<div></div>)
  // }

  const weekdaysStrs = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  let usedIDs = Object();
  let menu = Array();
  if (new Date().getISODay() != 0 && props.menu.length > 0) {
    menu.push(<OutputDivider text={"Week " + new Date(props.menu[0].date).getISOWeek()} key={"firstWeek"} />)
  }
  for (let i = 0; i < props.menu.length; i++) {
    const currentItem = props.menu[i];
    const d = new Date(props.menu[i].date);
    const name = props.dishes[currentItem.id].name;
    const weekday = weekdaysStrs[d.getISODay()];
    const day = d.toLocaleDateString('en-US', {day: "numeric"});
    const month = d.toLocaleDateString('en-US', {month: "long"}).slice(0, 3);
    let id = generateUniqueID(6, usedIDs);
    usedIDs[id] = null; // null can be any value (it's just a placeholder).
    if (d.getISODay() == 0) {
      let divID = generateUniqueID(6, usedIDs);
      usedIDs[divID] = null; // null can be any value (it's just a placeholder).
      menu.push(<OutputDivider text={"Week " + d.getISOWeek()} key={divID} />)
    }
    menu.push(
      <MenuItem
        name={name}
        weekday={weekday}
        day={day}
        month={month}
        key={id}
      />
    )
  }
  return (
    <div>
      <ul>{menu}</ul>
      <button onClick={() => props.onShowMore()}>Load more</button>
    </div>
  )
}

class Settings extends React.Component {
  // React component displayed in output when settings are viewed/being edited.
  // Heavily WIP:
  /* TODO: What should be in settings?
    - Theme (light/dark)
    - Start of week (monday/sunday)
    - Numbers of meals in a day (1, 2, 3...)
    - Only use dishes with specified weekdays on their specified days (true/false)
    - Always show whole weeks (true/false)
    - Round down dish date on months with fewer days (true/false)
   */
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
  // React component displayed when a dish is being added/edited

  // props.name/freq/weekdays are used to display info already put in when
  // editing a dish
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      freq: this.props.freq,
      weekdays: this.props.weekdays,
    }
  }

  // functions for handeling input fields see components below.
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
  // React component for name input in <DishCreateWindow />
  return (
    <input type="text" placeholder="Dish name" value={props.value} onChange={() => props.onChange(event.target.value)} />
  )
}

class RangeInput extends React.Component {
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
        className="green"
        min={this.props.min}
        value={this.props.value}
        style={{background: "linear-gradient(to right, var(--bg-color) calc(" + this.state.fraction + "*(100% - 10px) + 5px), var(--s-color) calc(" + this.state.fraction + "*(100% - 10px) + 5px))"}}
        max={this.props.max}
        onChange={() => this.props.onChange(event.target.value)}
        onInput={() => this.onInput()}
      />
    )
  }
}

class WeekdayCheckbox extends React.Component {
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

function Popup(props) {
  // TODO: Finish this component here and in css.
  // React Popup component.
  // props.icon is font awesome icon displayed together with popup.
  // props.actions are all actions that can be used on popup.
  let actions = Array();
  // Loads buttons from given actions.
  for (let action in props.actions) {
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
  // TODO: Use <Popup /> component to finish this.
}

// Makes sure <App /> component is loaded into root div.
ReactDOM.render(<App />, document.getElementById("root"))

// End of React components

function setCookies(consented, dishes, menu) {
  // Sets wether cookies are activated or not based on [consented]
  if (typeof consented == "boolean") {
    if (consented) {
      updateStoredDishes(dishes);
      updateStoredMenu(menu);
    } else {
      localStorage.removeItem("dishes");
      localStorage.removeItem("menu");
    };
    localStorage.setItem("activatedCookies", consented.toString());
    return true;
  } else {
    return false;
  }
}

function hasActivatedCookies() {
  // Returns wether cookies are activated or not.
  return JSON.parse(localStorage.getItem("activatedCookies"));
}

function loadStoredDishes() {
  // Loads dishes from localStorage and convert them to Dish objects.
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
  return new Dish(obj.name, obj.weekdays, obj.dates, obj.freq, obj.id, obj.lastSeen);
}

function regenerateMenu(dishes, date) {
  // Returns new dishes object with lastSeen date set to a random date between
  // today - 1 and today - today.length - 1.
  // FIXME: menu index 0 with this is latest date should be earliest
  let shuffledDishes = shuffleArray(Object.keys(dishes));
  let currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() - shuffledDishes.length)
  let regeneratedMenu = Array();
  for (let i = 0; i < shuffledDishes.length; i++) {
    let copiedDate = new Date(currentDate);
    let id = shuffledDishes[i];
    dishes[id].lastSeen = copiedDate;
    regeneratedMenu.push({id: id, date: copiedDate});
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return regeneratedMenu;
}

function generateNextX(dishes, menu, x) {
  // Generates next x items in menu and returns a menu with those added. Also
  // changes lastSeen of dishes which when used.
  if (menu.length == 0) {
    menu = regenerateMenu(dishes, new Date());
  }
  let newMenuArray = menu.slice();
  let d = new Date(newMenuArray.at(-1).date);
  for (let i = 0; i < x; i++) {
    d.setDate(d.getDate() + 1);
    let id = getNextInMenu(dishes, d);
    let copiedDate = new Date(d);
    dishes[id].lastSeen = new Date(copiedDate);
    newMenuArray.push({id: id, date: copiedDate});
  }
  return newMenuArray;
}

function catchUpMenu(dishes, menu) {
  // Updates lastSeen date of enough dishes for dishes to have caught up with
  // the current date. Removes dishes from menu if date has passed.
  if (menu.length == 0) {
    menu = regenerateMenu(dishes, new Date())
  }
  const today = new Date();
  const lastUpdatedDate = menu.at(-1).date;
  const daysSinceLastUpdate = Date.daysBetween(today, new Date(menu[0].date));
  let currentDate = new Date(lastUpdatedDate);
  let caughtUpMenu = menu.slice();
  // let dishesButCaughtUp = Object.assign({}, dishes); not a deepclone so not useful
  for (let i = Date.daysBetween(today, lastUpdatedDate); i > 0; i--) {
    let id = getNextInMenu(dishes, currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
    let copiedDate = new Date(currentDate);
    dishes[id].lastSeen = new Date(copiedDate);
    caughtUpMenu.push({id: id, date: copiedDate});
  }
  return caughtUpMenu.slice(daysSinceLastUpdate);
}

function getNextInMenu(dishes, date) {
  // Gets which dish should be next in menu based on all dishes and a date.
  let currentBestID = null;
  let currentBestValue = -1;
  let weekday = date.getISODay();
  const numberWithNoSpecifiedDay = Object.keys(dishes).filter(dish => dishes[dish].allWeekdays()).length;
  const numberOfMatchingDay = Object.keys(dishes).filter(dish => dishes[dish].weekdays[weekday]).length;
  const numberOfTotalDays = Object.keys(dishes).length;
  const numberOfTotalSelectedDays = Object.keys(dishes).map(dish => dishes[dish].weekdays.reduce((before, x) => before + x)).reduce((before, a) => a + before);
  const numberOfTotalDaysSinceLastSeen = Object.keys(dishes).map(dish => Date.daysBetween(date, dishes[dish].lastSeen)).reduce((before, a) => a + before);
  for (let dish in dishes) {
    let value;
    if (dishes[dish].allWeekdays()) {
      value = 1/(numberWithNoSpecifiedDay**2);
    } else if (dishes[dish].weekdays[weekday]) {
      value = 3/(numberOfMatchingDay**2);
    } else {
      value = 0.1/(numberOfTotalDays**2);
    }
    value *= Date.daysBetween(date, dishes[dish].lastSeen) * dishes[dish].freq**1.2;

    if (currentBestValue < value) {
      currentBestID = dish;
      currentBestValue = value;
    }
  }
  return currentBestID;
}

function loadStoredMenu(dishes) {
  // Returns a fully updated menu from localStorage
  let storedMenu = JSON.parse(localStorage.getItem("menu"));
  if (storedMenu == null) {
    return [];
  }
  storedMenu = catchUpMenu(dishes, storedMenu);
  if (storedMenu.length < 7) {
    storedMenu = generateNextX(dishes, storedMenu, 7 - storedMenu.length)
  }
  updateStoredMenu(storedMenu);
  return storedMenu;
}

function updateStoredDishes(dishes) {
  // Updates locale storage to include current version of dishes
  if (hasActivatedCookies()) {
    localStorage.setItem("dishes", JSON.stringify(dishes));
  };
}

function updateStoredMenu(menu) {
  // Updates menu in localStorage
  if (hasActivatedCookies()) {
    localStorage.setItem("menu", JSON.stringify(menu));
  };
}

function generateID(length) {
  // Generates a base62 string of length [length] to identify dishes.
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generateUniqueID(length, obj) {
  let id = null;
  let notUnique = true;
  do {
    id = generateID(length);
    if (!obj.hasOwnProperty(id)) {
      notUnique = false;
    };
  } while (notUnique);
  return id;
}

function shuffleArray(arr) {
  // Returns a shuffled array.
  let shuffledArray = arr.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

// TODO: make all functions working with dates ignore hours if not needed.
// TODO: Ask about cookies.
// TODO: Move functions that don't use this.setState out of classes
// NOTE: Dates going through json will be string format but should be okay as
// long as functions always copies dates (let x = new Date(date));
// QUESTION: Rewrite to use hooks instead of classes?
// QUESTION: Firefox support?
// QUESTION: Safari support?
