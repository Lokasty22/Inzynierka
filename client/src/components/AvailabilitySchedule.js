import React from 'react';
import { Table } from 'react-bootstrap';

const AvailabilitySchedule = ({ availability }) => {
    const daysOfWeek = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];

    return (
        <div className="my-4">
            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>Dzień</th>
                    <th>Godziny</th>
                </tr>
                </thead>
                <tbody>
                {daysOfWeek.map((day) => {
                    const dayAvailability = availability.find((a) => a.day === day);
                    return (
                        <tr key={day}>
                            <td>{day}</td>
                            <td>
                                {dayAvailability && dayAvailability.times.length > 0 ? (
                                    dayAvailability.times.join(', ')
                                ) : (
                                    'Brak dostępności'
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </Table>
        </div>
    );
};

export default AvailabilitySchedule;
