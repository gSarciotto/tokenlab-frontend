import React, { useState } from "react";
import { Formik, Form } from "formik";
import { FormikTextField } from "../../components/FormikTextField";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { createEvent } from "./fetches";

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

export interface NewEventContainerProps {
    token: string;
    updateAuthenticatedUser: (token: string) => void;
    updateEvents: () => void;
}

const useStyles = makeStyles({
    successColor: (theme: Theme) => ({
        color: theme.palette.success.dark
    })
});

export function NewEventContainer(props: NewEventContainerProps): JSX.Element {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [isHidden, setIsHidden] = useState(true);
    const [createEventAction, setCreateEventAction] = useState<{
        status: "success" | "error" | "none";
        message: string;
    }>({
        status: "none",
        message: ""
    });
    const initialValues: Values = {
        begin: "",
        end: "",
        description: ""
    };
    const toggleIsHidden = (e: React.MouseEvent<HTMLButtonElement>): void => {
        setIsHidden(!isHidden);
        setCreateEventAction({ status: "none", message: "" });
    };
    return (
        <Grid container item xs={10} wrap="wrap" spacing={1}>
            <Grid
                container
                item
                xs={12}
                alignItems="center"
                justify="space-between"
            >
                <Grid item>
                    <Typography display="block" variant="h5">
                        Novo Evento
                    </Typography>
                </Grid>
                <Grid item>
                    <IconButton color="secondary" onClick={toggleIsHidden}>
                        {isHidden ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                    </IconButton>
                </Grid>
            </Grid>
            {!isHidden && (
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, action): void => {
                        createEvent({
                            token: props.token,
                            begin: new Date(values.begin),
                            end: new Date(values.end),
                            description: values.description
                        })
                            .then((result) => {
                                if (result.status) {
                                    setCreateEventAction({
                                        status: "success",
                                        message: result.message
                                    });
                                    props.updateEvents();
                                } else {
                                    setCreateEventAction({
                                        status: "error",
                                        message: result.message
                                    });
                                }
                            })
                            .catch((err) => {
                                console.log("Network error on event creation");
                                console.log(err);
                            });
                    }}
                    validate={validateForm}
                >
                    <Grid
                        container
                        item
                        xs={12}
                        component={Form}
                        justify="space-between"
                        spacing={2}
                    >
                        <Grid item xs={12} className={classes.successColor}>
                            {createEventAction.status !== "none" && (
                                <Grid
                                    container
                                    wrap="nowrap"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <Grid item>
                                        {createEventAction.status ===
                                        "success" ? (
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
                                                createEventAction.status ===
                                                "error"
                                                    ? "error"
                                                    : "inherit"
                                            }
                                        >
                                            {createEventAction.message}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={5}>
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
                        <Grid item xs={12} sm={5}>
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
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                fullWidth
                            >
                                Criar Evento
                            </Button>
                        </Grid>
                    </Grid>
                </Formik>
            )}
        </Grid>
    );
}
