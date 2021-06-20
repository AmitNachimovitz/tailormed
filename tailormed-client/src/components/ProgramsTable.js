import React from 'react'
import { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import axios from 'axios'
import './programsTable.css'

export default function ProgramsTable() {
    const [programs, setPrograms] = useState([])

    async function getPrograms() {
        try {
            const response = await axios.get('/programs')
            if (response.status === 200) {
                return response.data.programs
            } else {
                return null
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const programs = await getPrograms()

                if (programs !== null) {
                    setPrograms(programs)
                } else {
                    setPrograms([])
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [])

    const tableRows = programs.map((program) => (
        <tr key={program.id}>
            <td>{program.name}</td>
            <td>{program.eligible_treatments.join(', ')}</td>
            <td>{program.grant_amount}</td>
            <td>{program.status}</td>
        </tr>
    ))

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th id="nameCol">Assistance Program Name</th>
                    <th>Eligible Treatment</th>
                    <th>Grant Amount</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>{tableRows}</tbody>
        </Table>
    )
}
