type IProps = {
  text?: string
}

export default function OutputDivider(props: IProps) {
    // React component that divides items.
  
    if (props.text != null && props.text.length > 0) {
      // props.text is text displayed to the left of the line of the divider.
      return (
        <div className="output-divider">
          <p>{props.text}</p>
          <div className="line"></div>
        </div>
      )
    } else {
      return (
        <div className="output-divider">
          <div className="line"></div>
        </div>
      )
    }
  }