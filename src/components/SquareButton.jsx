export default function SquareButton(props) {
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