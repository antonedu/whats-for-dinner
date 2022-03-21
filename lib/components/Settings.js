export default class Settings extends React.Component {
  // React component displayed in output when settings are viewed/being edited.
  // Heavily WIP:

  /* TODO: What should be in settings?
    - Theme (light/dark)
    - Start of week (monday/sunday)
    - Numbers of meals in a day (1, 2, 3...)
    - Only use dishes with specified weekdays on their specified days (true/false)
    - Always show whole weeks (true/false)
    - Round down dish date on months with fewer days (true/false)
   */
  constructor(props) {
    super(props);
  }

  render() {
    let cookiesButton;
    let cookiesWarning = false;

    if (this.props.cookiesActivated) {
      cookiesButton = "revoke access";
      cookiesWarning = " Note that this may cause your add dishes to disappear if you leave or refresh this webpage.";
    } else {
      cookiesButton = "give access";
    }

    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "There currently isn't alot of things to do here but you can still ", /*#__PURE__*/React.createElement("button", {
      onClick: () => this.props.onConsentToCookies()
    }, cookiesButton), " to cookies. ", cookiesWarning));
  }

}