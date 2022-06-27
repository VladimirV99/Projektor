import { Fragment, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import moment, { Moment } from 'moment';
import useAsyncError from 'hooks/useAsyncError';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import { CircularProgress } from '@material-ui/core';
import { Backdrop } from '@mui/material';
import { GET_SCREENINGS_URL } from 'constants/index';
import { Helmet } from 'react-helmet';

const ScreeningCalendarPage = () => {
    const [screeningsRaw, setScreeningsRaw] = useState([]);
    const [screeningsStatus, setScreeningsStatus] = useState('loading');

    const throwAsyncError = useAsyncError();

    useEffect(() => {
        setScreeningsStatus('loading');
        axios
            .get(GET_SCREENINGS_URL)
            .then((response) => {
                setScreeningsStatus('success');
                setScreeningsRaw(response.data);
            })
            .catch(() => {
                setScreeningsStatus('error');
            });
    }, []);

    const screenings = useMemo(() => {
        return screeningsRaw.map(({ id, movie, movieStart, hall }) => {
            return {
                id,
                movieTitle: movie?.title ?? '',
                movieStart: moment(movieStart),
                movieEnd: moment(movieStart).add(movie?.length ?? 1, 'minutes'),
                hallId: hall.id,
                hallName: hall?.name ?? '',
            };
        });
    }, [screeningsRaw]);

    const timeStart = useMemo(() => {
        if (screenings.length === 0) {
            return moment();
        }

        return screenings
            .reduce((prev, curr) =>
                curr.movieStart.isBefore(prev.movieStart) ? curr : prev
            )
            .movieStart.subtract(1, 'days');
    }, [screenings]);

    const timeEnd = useMemo(() => {
        if (screenings.length === 0) {
            return moment();
        }

        return screenings
            .reduce((prev, curr) =>
                curr.movieStart.isAfter(prev.movieEnd) ? curr : prev
            )
            .movieEnd.add(1, 'days');
    }, [screenings]);

    const groups = useMemo(() => {
        let ids = Array.from(new Set(screenings.map(({ hallId }) => hallId)));
        ids.sort((a, b) => a - b);

        return ids.map((id) => ({
            id,
            title: screenings.find((s) => s.hallId === id).hallName,
            height: 100,
        }));
    }, [screenings]);

    const items = useMemo(() => {
        return screenings.map(
            ({ id, movieTitle, movieStart, movieEnd, hallId }) => ({
                id,
                group: hallId,
                title: movieTitle,
                start_time: movieStart,
                end_time: movieEnd,
            })
        );
    }, [screenings]);

    useEffect(() => {
        if (screeningsStatus === 'error') {
            throwAsyncError(new Error('Something went wrong.'));
        }
    }, [screeningsStatus]);

    if (screeningsStatus === 'loading' || screenings.length === 0) {
        return (
            <Backdrop open>
                <CircularProgress />
            </Backdrop>
        );
    }

    return (
        <Fragment>
            <Helmet>
                <title>Screenings Calendar | Projektor</title>
            </Helmet>
            <Timeline
                groups={groups}
                items={items}
                defaultTimeStart={timeStart}
                defaultTimeEnd={timeEnd}
            />
        </Fragment>
    );
};

export default ScreeningCalendarPage;
