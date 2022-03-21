export default function DishNameInput(props) {
    // React component for name input in <DishCreateWindow />
    return (
      <input type="text" placeholder="Dish name" value={props.value} onChange={() => props.onChange(event.target.value)} />
    )
  }