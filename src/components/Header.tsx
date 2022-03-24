import SquareButton from "./SquareButton.js";

type ButtonInfo = {
  icon: string,
  title: string,
  visible: boolean,
  onClick: () => void
}

type TProps = {
  first: ButtonInfo,
  second: ButtonInfo,
  third: ButtonInfo,
}

export default function Header(props: TProps) {
  // React component for header of <App />.
  // props.first/second/third are info about the three buttons in header.
  // ..icon is font awesome icon of button.
  // ..title is title displayed on hover describing what happens when clicked.
  // ..visable is wether button is visable or not.
  // ..onClick is what happens when button is clicked.

  return (
    <header>
      <a href="../index.html" id="logo">
        <figure>
          <img src="../assets/logo.png" alt="logo" />
        </figure>
      </a>
      <div className="filler"></div>
      <SquareButton color="green" icon={props.first.icon} title={props.first.title} onClick={() => props.first.onClick()} visible={props.first.visible} />
      <SquareButton color="green" icon={props.second.icon} title={props.second.title} onClick={() => props.second.onClick()} visible={props.second.visible} />
      <SquareButton color="green" icon={props.third.icon} title={props.third.title} onClick={() => props.third.onClick()} visible={props.third.visible} />
    </header>
  );
}