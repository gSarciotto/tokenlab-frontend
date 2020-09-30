import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import { NewEventContainer, NewEventContainerProps } from "./NewEvent";
import {
    Event,
    getEvents,
    deleteEventFetch,
    updateEventFetch
} from "./fetches";
import { shouldElementBeSelected } from "./utils";
import { EventComponent } from "./EventComponent";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles({
    mainContainer: {
        padding: "40px 0"
    },
    successColor: (theme: Theme) => ({
        color: theme.palette.success.dark
    })
});

type CalendarPageProps = Pick<
    NewEventContainerProps,
    "token" | "updateAuthenticatedUser"
>;

export function CalendarPage(props: CalendarPageProps): JSX.Element {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [shouldFetchEvents, setShouldFetchEvents] = useState(true);
    const [actionStatus, setActionStatus] = useState<{
        status: "none" | "success" | "error";
        message: string;
    }>({ status: "none", message: "" });
    useEffect(() => {
        const getAllEvents = async (): Promise<void> => {
            const result = await getEvents(props.token);
            if (result.status) {
                if (result.events) {
                    setAllEvents(result.events);
                } else {
                    setActionStatus({
                        status: "error",
                        message: "Erro inesperado ao buscar eventos."
                    });
                }
            } else {
                setActionStatus({
                    status: "error",
                    message: result.message ? result.message : "Erro"
                });
            }
        };
        if (shouldFetchEvents) {
            getAllEvents();
            setShouldFetchEvents(false);
        }
    }, [props.token, shouldFetchEvents]);
    const deleteEvent = async (eventId: string): Promise<void> => {
        const result = await deleteEventFetch({
            token: props.token,
            eventId
        });
        setActionStatus({
            status: result.status ? "success" : "error",
            message: result.message
        });
        setShouldFetchEvents(result.status);
    };
    const updateEvent = async (
        eventInfo: Omit<Event, "username">
    ): Promise<void> => {
        const result = await updateEventFetch({
            token: props.token,
            ...eventInfo
        });
        setActionStatus({
            status: result.status ? "success" : "error",
            message: result.message
        });
        setShouldFetchEvents(result.status);
    };
    return (
        <Grid
            container
            item
            xs={12}
            sm={10}
            justify="center"
            spacing={3}
            component={Paper}
            elevation={3}
            className={classes.mainContainer}
        >
            <NewEventContainer
                token={props.token}
                updateAuthenticatedUser={props.updateAuthenticatedUser}
                updateEvents={(): void => {
                    setShouldFetchEvents(true);
                }}
            />
            <Grid item xs={10} className={classes.successColor}>
                {actionStatus.status !== "none" && (
                    <Grid
                        container
                        wrap="nowrap"
                        spacing={1}
                        alignItems="center"
                    >
                        <Grid item>
                            {actionStatus.status === "success" ? (
                                <CheckCircleIcon color="inherit" />
                            ) : (
                                <CancelIcon color="error" />
                            )}
                        </Grid>
                        <Grid item>
                            <Typography
                                variant="body1"
                                display="inline"
                                color={
                                    actionStatus.status === "error"
                                        ? "error"
                                        : "inherit"
                                }
                            >
                                {actionStatus.message}
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </Grid>
            <Grid item container xs={10} justify="space-between">
                <Grid item xs={12} md={5} lg={4}>
                    <Calendar
                        locale="pt-BR"
                        value={selectedDate}
                        onClickDay={(selectedDay: Date): void => {
                            setSelectedDate(selectedDay);
                        }}
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={5}
                    lg={7}
                    component={List}
                    disablePadding
                >
                    {allEvents
                        .reverse()
                        .filter((event) =>
                            shouldElementBeSelected(
                                selectedDate,
                                event.begin,
                                event.end
                            )
                        )
                        .map((event) => (
                            <EventComponent
                                event={event}
                                deleteEvent={deleteEvent}
                                updateEvent={updateEvent}
                                key={event.id}
                            />
                        ))}
                </Grid>
            </Grid>
        </Grid>
    );
}
