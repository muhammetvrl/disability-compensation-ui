import { FC } from 'react';
import { Formik, Form as FormikForm, Field } from 'formik';
import { Input, Select, Switch, Button, SelectItem, DatePicker, Textarea } from '@nextui-org/react';
import { FormField, SelectOption } from './types';
import {I18nProvider, useDateFormatter} from "@react-aria/i18n";
import { getLocalTimeZone, parseAbsoluteToLocal, ZonedDateTime, CalendarDate } from '@internationalized/date';

interface FormProps {
    initialValues: Record<string, any>;
    onSubmit?: (values: any) => void;
    fields: FormField[];
    validationSchema?: any;
    formRef?: any;
    hideSubmitButton?: boolean;
    defaultCol?: number;
}

export const Form: FC<FormProps> = ({
    initialValues,
    onSubmit,
    fields,
    validationSchema,
    formRef,
    hideSubmitButton = false,
    defaultCol = 6,
}) => {
    let formatter = useDateFormatter({dateStyle: "full"});

    const renderField = (field: FormField, form: any) => {
        const switchProps = {
            name: field.name,
            label: field.label,
            placeholder: field.placeholder,
            disabled: field.disabled,
            startContent: field.startContent,
            endContent: field.endContent,
        };

        const commonProps = {
            name: field.name,
            label: field.label,
            placeholder: field.placeholder,
            isRequired: field.required,
            isDisabled: field.disabled,
            startContent: field.startContent,
            endContent: field.endContent,
        };

        const error = form.touched[field.name] && form.errors[field.name];

        switch (field.type) {
            case 'select':
                return (
                    <Field name={field.name}>
                        {({ field: formikField, meta }: any) => (
                            <Select
                                {...commonProps}
                                {...formikField}
                                description={field.helperText}
                                errorMessage={error}
                                isInvalid={!!error}
                                items={field.options || []}
                                selectionMode="single"
                                selectedKeys={form.values[field.name] ? [form.values[field.name]] : []}
                                onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                                onBlur={() => form.setFieldTouched(field.name, true)}
                            >
                                {(field.options || []).map((option: SelectOption) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        )}
                    </Field>
                );

            case 'switch':
                return (
                    <Field name={field.name}>
                        {({ field: formikField }: any) => (
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1">
                                    <Switch
                                        {...switchProps}
                                        {...formikField}
                                        description={field.helperText}
                                        isSelected={form.values[field.name]}
                                        onValueChange={(value) => form.setFieldValue(field.name, value)}
                                        classNames={{
                                            base: error ? "border-danger" : ""
                                        }}
                                    >
                                        {field.label}
                                    </Switch>
                                    {field.required && (
                                        <span className="text-danger">*</span>
                                    )}
                                </div>
                                {error && (
                                    <div className="text-danger text-xs">{error}</div>
                                )}
                            </div>
                        )}
                    </Field>
                );

            case 'date':
                return (
                    <Field name={field.name}>
                        {({ field: formikField, form, meta }: any) => (
                             <I18nProvider locale="tr-TR">
                            <DatePicker
                                {...commonProps}
                                onChange={(date) => form.setFieldValue(field.name, date)}
                                value={formikField.value ? new CalendarDate(
                                    formikField.value.year,
                                    formikField.value.month,
                                    formikField.value.day
                                ) : null}
                                description={field.helperText}
                                errorMessage={error}
                                isInvalid={!!error}
                                placeholder={field.placeholder || "GG/AA/YYYY"}
                                onBlur={() => form.setFieldTouched(field.name, true)}
                            />
                            </I18nProvider>
                        )}
                    </Field>
                );

            case 'textarea':
                return (
                    <Field name={field.name}>
                        {({ field: formikField, meta }: any) => (
                            <Textarea
                                {...commonProps}
                                {...formikField}
                                description={field.helperText}
                                errorMessage={error}
                                isInvalid={!!error}
                                value={form.values[field.name]}
                                onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                                onBlur={() => form.setFieldTouched(field.name, true)}
                            />
                        )}
                    </Field>
                );

            case 'file':
                return (
                    <Field name={field.name}>
                        {({ field: formikField, meta }: any) => (
                            <div className="flex flex-col gap-2">
                                <input
                                    type="file"
                                    accept={field.accept}
                                    onChange={(event) => {
                                        const file = event.currentTarget.files?.[0];
                                        form.setFieldValue(field.name, file);
                                    }}
                                    className="hidden"
                                    id={field.name}
                                />
                                <Button
                                    as="label"
                                    htmlFor={field.name}
                                    color="primary"
                                    variant="bordered"
                                    startContent={<span>📎</span>}
                                >
                                    Dosya Yükle
                                </Button>
                                {formikField.value && (
                                    <div className="text-sm">
                                        {formikField.value.name}
                                    </div>
                                )}
                                {meta.touched && meta.error && (
                                    <div className="text-danger text-sm">
                                        {meta.error}
                                    </div>
                                )}
                            </div>
                        )}
                    </Field>
                );

            default:
                return (
                    <Field name={field.name}>
                        {({ field: formikField, meta }: any) => (
                            <Input
                                {...commonProps}
                                {...formikField}
                                type={field.type}
                                description={field.helperText}
                                errorMessage={error}
                                isInvalid={!!error}
                                value={form.values[field.name]}
                                onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                                onBlur={() => form.setFieldTouched(field.name, true)}
                            />
                        )}
                    </Field>
                );
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit || (() => { })}
            validationSchema={validationSchema}
            innerRef={formRef}
        >
            {({ isSubmitting, values, errors, touched, setFieldValue, setFieldTouched }) => (
                <FormikForm>
                    <div className="grid grid-cols-12 gap-4">
                        {fields.map((field) => (
                            <div
                                key={field.name}
                                className={`col-span-12 ${[
                                    'sm:col-span-1', 'sm:col-span-2', 'sm:col-span-3', 'sm:col-span-4',
                                    'sm:col-span-5', 'sm:col-span-6', 'sm:col-span-7', 'sm:col-span-8',
                                    'sm:col-span-9', 'sm:col-span-10', 'sm:col-span-11', 'sm:col-span-12'
                                ][(field.col || defaultCol) - 1]}`}
                            >
                                {renderField(field, { 
                                    values, 
                                    errors, 
                                    touched,
                                    setFieldValue,
                                    setFieldTouched 
                                })}
                            </div>
                        ))}
                    </div>
                    {!hideSubmitButton && (
                        <div className="mt-4">
                            <Button
                                type="submit"
                                color="primary"
                                isLoading={isSubmitting}
                                className="w-full"
                            >
                                Gönder
                            </Button>
                        </div>
                    )}
                </FormikForm>
            )}
        </Formik>
    );
}; 