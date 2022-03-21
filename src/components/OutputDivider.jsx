export default function OutputDivider(props) {
    // React component that divides items.
  
    // props.text is text displayed to the left of the line of the divider.
    return (
      <div className="output-divider">
        <p>{props.text}</p>
        <div className="line"></div>
      </div>
    )
  }