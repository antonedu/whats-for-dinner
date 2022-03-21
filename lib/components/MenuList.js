import OutputDivider from "./OutputDivider.js";
import MenuItem from "./MenuItem.js";
import { generateUniqueID } from "../dishesFunctions.js";
export default function MenuList(props) {
  // React component displayed in output when menu is viewed.
  // if (props.menu == [] || props.menu == null) {
  //   return (<div></div>)
  // }
  const weekdaysStrs = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  let usedIDs = Object();
  let menu = Array();

  if (new Date().getISODay() != 0 && props.menu.length > 0) {
    menu.push( /*#__PURE__*/React.createElement(OutputDivider, {
      text: "Week " + new Date(props.menu[0].date).getISOWeek(),
      key: "firstWeek"
    }));
  }

  for (let i = 0; i < props.menu.length; i++) {
    const currentItem = props.menu[i];
    const d = new Date(props.menu[i].date);
    const name = props.dishes[currentItem.id].name;
    const weekday = weekdaysStrs[d.getISODay()];
    const day = d.toLocaleDateString('en-US', {
      day: "numeric"
    });
    const month = d.toLocaleDateString('en-US', {
      month: "long"
    }).slice(0, 3);
    let id = generateUniqueID(6, usedIDs);
    usedIDs[id] = null; // null can be any value (it's just a placeholder).

    if (d.getISODay() == 0) {
      let divID = generateUniqueID(6, usedIDs);
      usedIDs[divID] = null; // null can be any value (it's just a placeholder).

      menu.push( /*#__PURE__*/React.createElement(OutputDivider, {
        text: "Week " + d.getISOWeek(),
        key: divID
      }));
    }

    menu.push( /*#__PURE__*/React.createElement(MenuItem, {
      name: name,
      weekday: weekday,
      day: day,
      month: month,
      key: id
    }));
  }

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("ul", null, menu), /*#__PURE__*/React.createElement("button", {
    onClick: () => props.onShowMore()
  }, "Load more"));
}