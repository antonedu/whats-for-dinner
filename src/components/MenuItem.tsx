type IProps = {
  name: string,
  weekday: string,
  day: string | number,
  month: string | number
}

export default function MenuItem(props: IProps) {
    // React component for items displayed in <MenuList />
  
    // props.name is the name of the dish
    // props.weekday is the weekday that the <MenuItem /> is on.
    // props.day/month is day/month that the <MenuItem /> is on.
    return (
      <div className="output-item menu-output-item" title={props.name}>
        <div className="preview">
          <div className="title">
            <p>{props.name}</p>
          </div>
          <div className="menu-day">
            <div className="weekday">
              <p>{props.weekday}</p>
            </div>
            <div className="date">
              <p>{`${props.day} ${props.month}`}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }