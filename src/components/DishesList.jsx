import DishItem from "./DishItem.js";
import DishCreateWindow from "./DishCreateWindow.js";

export default class DishesList extends React.Component {
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