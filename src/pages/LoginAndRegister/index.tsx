import React, { useState } from "react";
import { Formik, Form } from "formik";
import { login, LoginResult, register, RegisterResult } from "./fetches";
import { FormikTextField } from "../../components/FormikTextField";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

export interface Values {
    username: string;
    password: string;
}

const validateForm = (values: Values): Partial<Values> => {
    const errors: Partial<Values> = {};
    if (!values.username) {
        errors.username = "Obrigatório";
    } else if (values.username.length < 3) {
        errors.username = "Usuário deve ter ao menos 3 caracteres";
    } else if (values.username.length > 20) {
        errors.username = "Usuário deve ter no máximo 20 caracteres";
    }
    if (!values.password) {
        errors.password = "Obrigatório";
    } else if (values.password.length < 8) {
        errors.password = "Senha deve ter no mínimo 8 caracteres";
    } else if (values.password.length > 64) {
        errors.password = "Senha muito longa!";
    }
    return errors;
};

const useStyles = makeStyles({
    successColor: (theme: Theme) => ({
        color: theme.palette.success.dark
    }),
    formContainer: {
        padding: "7.5% 0",
        maxWidth: "700px"
    }
});

interface LoginAndRegisterPageProps {
    updateAuthenticatedUser: (token: string) => void;
}

export function LoginAndRegisterPage(
    props: LoginAndRegisterPageProps
): JSX.Element {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [buttonAction, setButtonAction] = useState<"login" | "register">(
        "login"
    );
    const [actionDisplay, setActionDisplay] = useState<{
        status: "success" | "error" | "none";
        message: string;
    }>({ status: "none", message: "" });
    const togglePassword = (e: React.MouseEvent<HTMLButtonElement>): void => {
        setIsPasswordHidden(!isPasswordHidden);
    };
    const toggleAction = (e: React.MouseEvent): void => {
        e.preventDefault();
        setButtonAction(buttonAction === "login" ? "register" : "login");
    };
    const initialValues: Values = {
        username: "",
        password: ""
    };
    function handleRegisterResult(result: RegisterResult): void {
        if (result.success) {
            setButtonAction("login");
            setActionDisplay({
                status: "success",
                message: "Registro efetuado com sucesso!"
            });
        } else {
            setActionDisplay({
                status: "error",
                message: result.message ? result.message : "Erro"
            });
        }
    }
    function handleLoginResult(result: LoginResult): void {
        if (result.success) {
            if (result.token) {
                props.updateAuthenticatedUser(result.token);
            } else {
                console.log("no token when it should have been");
                setActionDisplay({
                    status: "error",
                    message: "Erro com token de autenticação."
                });
            }
        } else {
            setActionDisplay({
                status: "error",
                message: result.message ? result.message : "Erro"
            });
        }
    }
    return (
        <Grid
            container
            item
            xs={12}
            sm={10}
            justify="center"
            component={Paper}
            elevation={3}
            className={classes.formContainer}
        >
            <Formik
                initialValues={initialValues}
                onSubmit={(values, actions): void => {
                    if (buttonAction === "login") {
                        login(values)
                            .then((result) => {
                                handleLoginResult(result);
                            })
                            .catch((err) => {
                                console.log("Network error on login");
                                console.log(err);
                            });
                    } else {
                        register(values)
                            .then((result) => {
                                handleRegisterResult(result);
                            })
                            .catch((err) => {
                                console.log("Network error on register");
                                console.log(err);
                            });
                    }
                }}
                validate={validateForm}
            >
                <Grid
                    container
                    item
                    xs={10}
                    spacing={2}
                    component={Form}
                    wrap="wrap"
                    justify="center"
                >
                    <Grid item xs={12} className={classes.successColor}>
                        {actionDisplay.status !== "none" && (
                            <Grid
                                container
                                wrap="nowrap"
                                spacing={1}
                                alignItems="center"
                            >
                                <Grid item>
                                    {actionDisplay.status === "success" ? (
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
                                            actionDisplay.status === "error"
                                                ? "error"
                                                : "inherit"
                                        }
                                    >
                                        {actionDisplay.message}
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <FormikTextField
                            formikKey="username"
                            label="Usuário"
                            type="text"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircleOutlinedIcon />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormikTextField
                            formikKey="password"
                            label="Senha"
                            type={isPasswordHidden ? "password" : "text"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="show password"
                                            onClick={togglePassword}
                                            color="primary"
                                        >
                                            {isPasswordHidden ? (
                                                <VisibilityOffOutlinedIcon />
                                            ) : (
                                                <VisibilityOutlinedIcon />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {buttonAction === "login" ? (
                            <Button
                                type="submit"
                                color="primary"
                                variant="contained"
                                fullWidth
                                size="large"
                                endIcon={<ExitToAppIcon />}
                            >
                                Entrar
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                color="primary"
                                variant="contained"
                                fullWidth
                                size="large"
                                startIcon={<PersonAddIcon />}
                            >
                                Cadastrar
                            </Button>
                        )}
                    </Grid>
                    <Grid item xs={6}>
                        <Typography align="center" variant="body1">
                            <Link
                                component="button"
                                onClick={toggleAction}
                                underline="always"
                            >
                                {buttonAction === "login"
                                    ? "Não é cadastrado?"
                                    : "Já é cadastrado?"}
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Formik>
        </Grid>
    );
}
