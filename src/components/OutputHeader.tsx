type IProps = {
  text: string
}

export default function OutputHeader(props: IProps) {
    // React component for header of outputs.
    return (
      <h1 id="output-head">{props.text}</h1>
    )
  }