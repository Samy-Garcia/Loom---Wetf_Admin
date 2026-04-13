import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-right">
        <div className="navbar-bell">
          🔔
          <span className="bell-dot"></span>
        </div>
        <div className="navbar-user">
          <div className="user-avatar">F</div>
          <span className="user-name">FRANCISCO SAMUEL GARCÍA</span>
        </div>
      </div>
    </header>
  )
}

export default Navbar