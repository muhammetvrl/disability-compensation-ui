import { FC, RefObject } from 'react';
import { Formik, Form as FormikForm, Field, FormikProps, FormikHelpers } from 'formik';
import { Input, Select, Switch, Button, SelectItem, DatePicker, Textarea, ButtonProps } from "@heroui/react";
import { FormField, SelectOption } from './types';
import { I18nProvider, useDateFormatter } from "@react-aria/i18n";
import { CalendarDate } from '@internationalized/date';

interface FormProps {
    initialValues: Record<string, any>;
    onSubmit?: (values: any, formikHelpers: FormikHelpers<any>) => void | Promise<any>;
    fields: FormField[];
    validationSchema?: any;
    formRef?: RefObject<FormikProps<any>>;
    hideSubmitButton?: boolean;
    defaultCol?: number;
    submitButtonProps?: ButtonProps;
    onFieldChange?: (fieldName: string, value: any) => void;
}

export const Form: FC<FormProps> = ({
    initialValues,
    onSubmit,
    fields,
    validationSchema,
    formRef,
    hideSubmitButton = false,
    defaultCol = 6,
    submitButtonProps,
    onFieldChange,
}) => {
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

        const getNestedValue = (obj: any, path: string) => {
            return path.split('.').reduce((current, key) => {
                return current?.[key];
            }, obj);
        };

        const error = getNestedValue(form.errors, field.name);
        const value = getNestedValue(form.values, field.name);

        switch (field.type) {
            case 'select':
                return (
                    <Field name={field.name}>
                        {({ field: formikField, meta }: any) => (
                            <Select
                                {...commonProps}
                                description={field.helperText}
                                errorMessage={error || ""}
                                isInvalid={!!error}
                                items={field.options || []}
                                selectionMode="single"
                                selectedKeys={value ? [value] : []}
                                onChange={(e:any) => {
                                    form.setFieldValue(field.name, e.target.value);
                                    onFieldChange?.(field.name, e.target.value);
                                }}
                            >
                                {(field.options || []).map((option: SelectOption) => (
                                    <SelectItem key={option.value}>
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
                                        isSelected={value}
                                        onValueChange={(val:any) => {
                                            form.setFieldValue(field.name, val);
                                            onFieldChange?.(field.name, val);
                                        }}
                                        classNames={{
                                            base: error ? "border-danger" : ""
                                        }}
                                    >
                                        {field.label}
                                    </Switch>
                                    {field.required && <span className="text-danger">*</span>}
                                </div>
                                {field.helperText && (
                                    <div className="text-sm text-default-400">{field.helperText}</div>
                                )}
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
                                    onChange={(date) => {
                                        form.setFieldValue(field.name, date);
                                        onFieldChange?.(field.name, date);
                                    }}
                                    value={formikField.value ? new CalendarDate(
                                        formikField.value.year,
                                        formikField.value.month,
                                        formikField.value.day
                                    ) : null as any}  
                                    description={field.helperText}
                                    errorMessage={error || ""}
                                    isInvalid={!!error}
                                    placeholder={field.placeholder || "GG/AA/YYYY"}
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
                                errorMessage={error || ""}
                                isInvalid={!!error}
                                value={form.values[field.name]}
                                onChange={(e:any) => {
                                    form.setFieldValue(field.name, e.target.value);
                                    onFieldChange?.(field.name, e.target.value);
                                }}
                            />
                        )}
                    </Field>
                );

            case 'file':
                return (
                    <Field name={field.name}>
                        {({ field: formikField, meta }: any) => (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm">{field.label}</span>
                                    {field.required && <span className="text-danger">*</span>}
                                </div>
                                <input
                                    type="file"
                                    accept={field.accept}
                                    onChange={(event) => {
                                        const file = event.currentTarget.files?.[0];
                                        form.setFieldValue(field.name, file);
                                        onFieldChange?.(field.name, file);
                                    }}
                                    className="hidden"
                                    id={field.name}
                                />
                                <Button
                                    as="label"
                                    htmlFor={field.name}
                                    color={error ? "danger" : "primary"}
                                    variant="bordered"
                                    startContent={<span>📎</span>}
                                >
                                    {formikField.value ? formikField.value.name : 'Dosya Yükle'}
                                </Button>
                                {error && (
                                    <div className="text-danger text-sm">
                                        {error}
                                    </div>
                                )}
                            </div>
                        )}
                    </Field>
                );

            default:
                return (
                    <Field name={field.name}>
                        {({ field: formikField }: any) => (
                            <Input
                                {...commonProps}
                                {...formikField}
                                type={field.type}
                                description={field.helperText}
                                errorMessage={error || ""}
                                color={error ? "danger" : "default"}
                                isInvalid={!!error}
                                value={value || ''}
                                onChange={(e:any) => {
                                    const newValue = field.type === 'number' 
                                        ? e.target.value === '' 
                                            ? '' 
                                            : Number(e.target.value)
                                        : e.target.value;
                                    form.setFieldValue(field.name, newValue);
                                    onFieldChange?.(field.name, newValue);
                                }}
                            />
                        )}
                    </Field>
                );
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={async (values, formikHelpers) => {
                try {
                    if (onSubmit) {
                        await onSubmit(values, formikHelpers);
                    }
                } catch (error) {
                    Object.keys(values).forEach(key => {
                        formikHelpers.setFieldTouched(key, true, false);
                    });
                }
            }}
            validationSchema={validationSchema}
            validateOnChange={true}
            innerRef={formRef}
        >
            {({ isSubmitting, values, errors, touched, setFieldValue, setFieldTouched }) => { 
                return(
                <FormikForm noValidate>
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
                                {...submitButtonProps}
                            >
                                {submitButtonProps?.children || 'Gönder'}
                            </Button>
                        </div>
                    )}
                </FormikForm>
            )}}
        </Formik>
    );
}; 