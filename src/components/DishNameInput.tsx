type IProps = {
  value: string,
  onChange: (name: string) => void
}

export default function DishNameInput(props: IProps) {
    // React component for name input in <DishCreateWindow />
    return (
      <input type="text" placeholder="Dish name" value={props.value} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value)} />
    )
  }