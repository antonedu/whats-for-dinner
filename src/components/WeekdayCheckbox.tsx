type IProps = {
  weekday: string,
  checked: boolean,
  onChange: () => void
}

export default function WeekdayCheckbox(props: IProps) {
  // React component for checkboxes in <DishCreateWindow /> component.
  // Used by <DishCreateWindow /> to decide which weekdays should be activated
  // in a Dish object.

  // props.weekday is the weekday checkbox is associated with.
  // props.checked is used to keep track of checkbox value.
  // onChange functions updated weekdays array in <DishCreateWindow /> so that
  // correct weekdays are saved to Dish object.

  return (
    <div className="checkbox-container green">
      <input
        type="checkbox"
        title={props.weekday}
        checked={props.checked}
        data-letter={props.weekday[0].toUpperCase()}
        onChange={() => props.onChange()}
      />
    </div>
  )
}