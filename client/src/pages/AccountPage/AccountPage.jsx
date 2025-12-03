import "./style.css";
import { Container, Row, Col } from "react-bootstrap";
import Profile from "./components/Profile/Profile";

function AccountPage() {
    return (
        <Container className="mt-3">
            <Row>
                <Col className="col-6 offset-3">
                    <Profile />
                </Col>
            </Row>
        </Container>
    );
}

export default AccountPage;