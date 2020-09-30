import React, { useState } from "react";
import { Formik, Form } from "formik";
import { FormikTextField } from "../../components/FormikTextField";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";
import { Event } from "./fetches";
import { convertDateToInputFormat } from "./utils";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

interface Values {
    begin: string;
    end: string;
    description: string;
}
const validateForm = (values: Values): Partial<Values> => {
    const errors: Partial<Values> = {};
    let beginConverted: Date, endConverted: Date;
    try {
        endConverted = new Date(values.begin);
    } catch (err) {
        console.log(err);
        errors.end = "Valor inválido";
    }
    try {
        beginConverted = new Date(values.end);
    } catch (err) {
        console.log(err);
        errors.begin = "Valor inválido";
    }
    try {
        if (!errors.end && !errors.begin) {
            beginConverted = new Date(values.begin);
            endConverted = new Date(values.end);
            if (endConverted < beginConverted) {
                errors.end =
                    "O final do evento deve ser depois do início do mesmo";
            }
        }
    } catch (err) {}
    if (values.description.length === 0) {
        errors.description = "Descrição deve ser não nula";
    } else if (values.description.length > 100) {
        errors.description = "Descrição deve ter no máximo 100 caracteres";
    }
    return errors;
};

const useStyles = makeStyles({
    eventButtons: {
        marginTop: "16px"
    }
});

interface EventComponentProps {
    event: Event;
    deleteEvent: (eventId: string) => Promise<void>;
    updateEvent: (eventInfo: Omit<Event, "username">) => Promise<void>;
}

export function EventComponent({
    event,
    deleteEvent,
    updateEvent
}: EventComponentProps): JSX.Element {
    const classes = useStyles();
    const [mode, setMode] = useState<"list" | "edit">("list");
    const handleDeleteClick = async (
        e: React.MouseEvent<HTMLButtonElement>
    ): Promise<void> => {
        await deleteEvent(event.id);
    };
    const initialValues: Values = {
        begin: convertDateToInputFormat(event.begin),
        end: convertDateToInputFormat(event.end),
        description: event.description
    };
    return (
        <ListItem disableGutters divider>
            {mode === "list" && (
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h6" color="textSecondary">
                            {"Início: "}
                            <Typography
                                variant="body1"
                                color="textPrimary"
                                display="inline"
                            >
                                {event.begin.toLocaleString("pt-BR", {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" color="textSecondary">
                            {"Fim: "}
                            <Typography
                                variant="body1"
                                color="textPrimary"
                                display="inline"
                            >
                                {event.end.toLocaleString("pt-BR", {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" color="textSecondary">
                            {"Criador: "}
                            <Typography
                                variant="body1"
                                color="textPrimary"
                                display="inline"
                            >
                                {event.username}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            {event.description}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <ButtonGroup
                            color="primary"
                            fullWidth
                            variant="contained"
                            className={classes.eventButtons}
                        >
                            <Button
                                onClick={handleDeleteClick}
                                startIcon={<DeleteIcon />}
                            >
                                Excluir
                            </Button>
                            <Button
                                onClick={(
                                    e: React.MouseEvent<HTMLButtonElement>
                                ): void => {
                                    setMode("edit");
                                }}
                                startIcon={<EditIcon />}
                            >
                                Editar
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            )}
            {mode === "edit" && (
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values: Values): void => {
                        updateEvent({
                            id: event.id,
                            begin: new Date(values.begin),
                            end: new Date(values.end),
                            description: values.description
                        })
                            .then(() => {
                                setMode("list");
                            })
                            .catch((err) => {
                                console.log(
                                    "Network error on event update:",
                                    err
                                );
                            });
                    }}
                    validate={validateForm}
                >
                    <Grid
                        container
                        component={Form}
                        justify="space-between"
                        spacing={2}
                    >
                        <Grid item xs={12} lg={5}>
                            <FormikTextField
                                formikKey="begin"
                                label="Início"
                                type="datetime-local"
                                InputLabelProps={{
                                    shrink: true
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} lg={5}>
                            <FormikTextField
                                formikKey="end"
                                label="Fim"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormikTextField
                                formikKey="description"
                                label="Descrição"
                                type="text"
                                multiline
                                fullWidth
                                rowsMax={3}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ButtonGroup
                                color="primary"
                                fullWidth
                                variant="contained"
                                className={classes.eventButtons}
                            >
                                <Button
                                    type="button"
                                    onClick={(
                                        e: React.MouseEvent<HTMLButtonElement>
                                    ): void => {
                                        setMode("list");
                                    }}
                                >
                                    Voltar
                                </Button>
                                <Button type="submit" startIcon={<EditIcon />}>
                                    Editar
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </Formik>
            )}
        </ListItem>
    );
}
