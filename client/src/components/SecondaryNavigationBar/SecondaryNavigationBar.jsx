import "./style.css";
import { Navbar, Nav } from 'react-bootstrap';

function SecondaryNavigationBar({ setView, views, activeView }) {
    return (
        <div>
            <Navbar className="fw-bold">
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="nav-link">
                        {[...views.keys()].map((viewName) => (
                            <Nav.Link onClick={() => setView(viewName)} className={viewName === activeView ? "disabled" : ""}>
                                {viewName}
                            </Nav.Link>
                        ))}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default SecondaryNavigationBar;