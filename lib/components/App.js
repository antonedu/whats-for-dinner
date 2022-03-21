import Settings from './Settings.js';
import OutputHeader from "./OutputHeader.js";
import Header from "./Header.js";
import MenuList from "./MenuList.js";
import DishesList from './DishesList.js';
import DishCreateWindow from './DishCreateWindow.js';
import { setCookies, editDishes, removeFromDishes, loadStoredDishes, resetMenu, loadStoredMenu, hasActivatedCookies } from '../dishesFunctions.js';
export default class App extends React.Component {
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
    let storedDishes = loadStoredDishes();
    this.state = {
      dishes: storedDishes,
      menu: loadStoredMenu(storedDishes),
      currentlyAddingDish: false,
      cookiesActivated: hasActivatedCookies(),
      headerButtons: {
        first: {
          title: "Add dish",
          icon: "plus",
          onClick: () => this.setState({
            currentlyAddingDish: true
          }),
          visable: true
        },
        second: {
          title: "Switch to menu",
          icon: "utensils",
          onClick: () => {
            this.updateHeaderButtons("Menu");
          },
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
  }

  consentToCookies() {
    // Updates local storage if consent changes
    let activated = !this.state.cookiesActivated;
    setCookies(activated, this.state.dishes, this.state.menu);
    this.setState({
      cookiesActivated: activated
    });
  }

  updateHeaderButtons(content) {
    // Updates state.headerButtons and state.content when user switches
    // displayed content.
    const back = this.state.content == "Dishes" ? "Dishes" : "Menu";
    const headerButtons = {
      Dishes: {
        first: {
          icon: "plus",
          onClick: () => this.setState({
            currentlyAddingDish: true
          }),
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
    };
    this.setState({
      content: content,
      headerButtons: headerButtons[content]
    });
  }

  addDish(name, weekdays, dates, freq) {
    let id = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    // Creates a new Dish object with a unique ID (and saves it to cookies if
    // enabled)
    // Also used when editing dishes and saving, then id is id of dish that
    // should change.
    let newDishesObj = editDishes(this.state.dishes, name, weekdays, dates, freq, id);
    this.setState({
      dishes: newDishesObj
    });
  }

  removeDish(id) {
    // Removes an added dish.
    this.setState(removeFromDishes(id, this.state.dishes, this.state.menu));
  }

  handleResetMenu() {
    // Resets menu and generates first 7 days of a new one.
    this.setState(resetMenu(this.state.dishes));
  }

  render() {
    let renderedOutput;

    if (this.state.content == "Dishes") {
      let creatingDish = false;

      if (this.state.currentlyAddingDish) {
        creatingDish = /*#__PURE__*/React.createElement(DishCreateWindow, {
          editing: false,
          name: "",
          freq: 5,
          weekdays: Array(7).fill(false),
          onClose: () => this.setState({
            currentlyAddingDish: false
          }),
          onDelete: () => null,
          onSave: (name, weekdays, freq) => this.addDish(name, weekdays, null, freq)
        });
      }

      renderedOutput = /*#__PURE__*/React.createElement("div", null, creatingDish, /*#__PURE__*/React.createElement(DishesList, {
        dishes: this.state.dishes,
        onDelete: id => this.removeDish(id),
        onSave: (name, weekdays, freq, id) => this.addDish(name, weekdays, null, freq, id)
      }));
    } else if (this.state.content == "Menu") {
      renderedOutput = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(MenuList, {
        menu: this.state.menu,
        dishes: this.state.dishes,
        onShowMore: () => {
          let extendedMenu = generateNextX(this.state.dishes, this.state.menu, 7);
          this.setState({
            menu: extendedMenu
          });
          updateStoredMenu(extendedMenu);
        }
      }));
    } else if (this.state.content == "Settings") {
      renderedOutput = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Settings, {
        onConsentToCookies: () => this.consentToCookies(),
        cookiesActivated: this.state.cookiesActivated
      }));
    }

    return /*#__PURE__*/React.createElement(React.StrictMode, null, /*#__PURE__*/React.createElement("div", {
      id: "wrapper"
    }, /*#__PURE__*/React.createElement(Header, {
      first: this.state.headerButtons.first,
      second: this.state.headerButtons.second,
      third: this.state.headerButtons.third
    }), /*#__PURE__*/React.createElement("section", {
      id: "main"
    }, /*#__PURE__*/React.createElement("div", {
      id: "output-wrapper"
    }, /*#__PURE__*/React.createElement(OutputHeader, {
      text: this.state.content
    }), /*#__PURE__*/React.createElement("div", {
      id: "output-items"
    }, renderedOutput)))));
  }

}
;