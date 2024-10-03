"use client"

import React from 'react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Control } from 'react-hook-form'
import { Input } from './ui/input'
import { FormFieldtype } from './forms/PatientForm'
import Image from 'next/image'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { E164Number } from 'libphonenumber-js/core'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Checkbox } from './ui/checkbox'

interface CustomProps {
    control: Control<any>,
    fieldType: FormFieldtype,
    name: string,
    label?: string,
    placeholder?: string,
    iconAlt?: string,
    iconSrc?: string,
    disabled?: boolean,
    dateFormat?: string,
    showTimeSelect?: boolean,
    children?: React.ReactNode,
    renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderField = ({ field, props }: { field: any, props: CustomProps }) => {

    const { fieldType, iconSrc, iconAlt, placeholder, showTimeSelect, dateFormat, renderSkeleton } = props;

    switch (fieldType) {
        case FormFieldtype.INPUT:
            return (
                <div className='flex rounded-md border border-dark-500 bg-dark-400'>
                    {iconSrc && (
                        <Image
                            src={iconSrc}
                            height={24}
                            width={24}
                            alt={iconAlt || 'icon'}
                            className='ml-2'
                        />
                    )}
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            {...field}
                            className='shad-input border-0'

                        />
                    </FormControl>
                </div>
            )
        case FormFieldtype.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput
                        defaultCountry='IN'
                        placeholder={placeholder}
                        withCountryCallingCode
                        international
                        value={field.value as E164Number || undefined}
                        onChange={field.onChange}
                        className="input-phone"

                    />
                </FormControl>
            )

        case FormFieldtype.TEXTAREA:
            return (
                <FormControl>
                    <Textarea
                        placeholder={placeholder}
                        {...field}
                        className='shad-textArea'
                        disabled={props.disabled}
                    />
                </FormControl>
            )

        case FormFieldtype.DATE_PICKER:
            return (
                <div className=' flex rounded-md border border-dark-500 bg-dark-400'>
                    <Image
                        src="/assets/icons/calendar.svg"
                        height={24}
                        alt='calender'
                        width={24}
                        className='ml-2'
                    />
                    <FormControl>
                        <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            dateFormat={dateFormat ??
                                'MM/dd/yyyy'
                            }
                            showTimeSelect={showTimeSelect ?? false}
                            timeInputLabel='Time:'
                            wrapperClassName='date-picker'
                        />
                    </FormControl>
                </div>
            )

        case FormFieldtype.SELECT:
            return (
                <FormControl>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        <FormControl
                            className='shad-select-trigger'
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={placeholder}
                                />
                            </SelectTrigger>

                        </FormControl>
                        <SelectContent className='shad-select-content'>
                            {props.children}
                        </SelectContent>

                    </Select>
                </FormControl>
            )

        case FormFieldtype.SKELETON:
            return (
                renderSkeleton ? renderSkeleton(field)
                    : null
            )

        case FormFieldtype.CHECKBOX:
            return <FormControl>
                <div className='flex items-center gap-4'>
                    <Checkbox
                        id={props.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                    <label htmlFor={props.name}
                        className='checkbox-label'
                    >
                        {props.label}
                    </label>
                </div>
            </FormControl>

        default:
            break
    }
}

const CustomFormField = (props: CustomProps) => {

    const { control, fieldType, name, label } = props;

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className='flex-1'>
                    {fieldType !== FormFieldtype.CHECKBOX && label && (
                        <FormLabel>{label}</FormLabel>
                    )}
                    <RenderField
                        field={field} props={props}
                    />

                </FormItem>
            )}
        />
    )
}

export default CustomFormField
