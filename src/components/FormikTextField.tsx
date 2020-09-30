import React from "react";
import { useField } from "formik";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";

type FormikTextFieldProps = { formikKey: string } & TextFieldProps;

export function FormikTextField({
    formikKey,
    ...props
}: FormikTextFieldProps): JSX.Element {
    const [field, meta] = useField(formikKey);
    return (
        <TextField
            id={field.name}
            name={field.name}
            helperText={meta.touched ? meta.error : ""}
            error={meta.touched && Boolean(meta.error)}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            {...props}
        />
    );
}
