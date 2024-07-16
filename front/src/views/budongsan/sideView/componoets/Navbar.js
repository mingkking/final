import { SideItemsData } from "../SideItemsData";
import '../SideView.css';

const Navbar = ({ setSelectedMenu }) => {

  const handleMenuClick = (title) => {
    setSelectedMenu(title);
  };

  return (
    <nav className="side-desktop-nav">
      <ul className="side-menus">
        {SideItemsData.map((menu, index) => {
          return (
            <li className="menu-items" key={index}>
              <a onClick={() => handleMenuClick(menu.title)}>{menu.title}</a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;