import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';

const routeGenerator = require('./../shared/routeGenerator');

export default class EventCalendar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            events: [],
            redirect: null,
            calendarWeekends: true
        };
    }

    componentDidMount() {
        let api_uri = routeGenerator.getURI(`events`);
        axios.get(api_uri)
            .then(response => {
                this.setState({ events: response.data })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    handleDateClick = (dateClickInfo) => {
        // console.log(dateClickInfo.dateStr);
        let eventdate = moment(dateClickInfo.dateStr).format('dddd, Do MMMM YYYY');
        if (window.confirm('Would you like to add an event to ' + eventdate + ' ?')) {
            localStorage.setItem('eventDate', JSON.stringify(dateClickInfo.dateStr));
            this.setState({ redirect: `/create/event` });
        }
    }

    handleEventClick(eventClickInfo) {
        console.log(eventClickInfo.event.extendedProps);
        console.log(eventClickInfo.event.extendedProps._id);
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <div className='app-calendar'>
                <FullCalendar
                    defaultView="dayGridMonth"
                    header={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                    }}
                    plugins={[
                        dayGridPlugin, 
                        timeGridPlugin, 
                        interactionPlugin
                    ]}
                    weekends={ this.state.calendarWeekends }
                    events={this.state.events}
                    dateClick={this.handleDateClick}
                    eventClick={this.handleEventClick}
                />
            </div>
        )
    }

}