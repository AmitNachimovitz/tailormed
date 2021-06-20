import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import ProgramsTable from '../components/ProgramsTable'
import img from '../assests/img/bg.jpg'

export default function ProgramsPage() {
    return (
        <Container>
            <Row>
                <Col>
                    <h1>Assistance Programs</h1>
                </Col>
                <Image id="bgImg" src={img} />
            </Row>
            <Row>
                <Col sm={12}>
                    <ProgramsTable />
                </Col>
            </Row>
        </Container>
    )
}
