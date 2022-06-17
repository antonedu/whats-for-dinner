export default function Popup(props) {
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