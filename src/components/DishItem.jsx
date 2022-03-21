export default class DishItem extends React.Component {
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