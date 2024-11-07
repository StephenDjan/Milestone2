import { Link } from 'react-router-dom';
import { useUserContext } from './providers/UserContext'; // Adjust the path if necessary
import './Navbar.css';

const Navbar = () => {
  const { userInfo } = useUserContext();

  return (
    <nav className="navbar">
      <h1>Student Portal</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/registration">Registration</Link></li>
        <li><Link to="/admin/login">Admin Login</Link></li>
        <li><Link to="/advising-history">Advising History</Link></li>
        <li><Link to="/course-plans">Course Plans</Link></li>
        <li><Link to="/advising-entry">Adv Entry</Link></li>


        {/* Only show the Advising link if the user is a student */}
        {userInfo && userInfo.role === 'student' && (
          <li><Link to="/advising">Advising</Link></li>
          
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
