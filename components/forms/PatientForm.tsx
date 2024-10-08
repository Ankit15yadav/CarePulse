"use client"

// import { zodResolver } from "@hookform/resolvers/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"

export enum FormFieldtype {
    INPUT = 'input',
    CHECKBOX = 'checkbox',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    DATE_PICKER = 'date',
    SELECT = 'select',
    SKELETON = 'skeleton',

}


const PatientForm = () => {
    const router = useRouter();

    const [isLoading, setIsloading] = useState(false);

    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    })



    async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>) {

        setIsloading(true);

        try {

            const userData = { name, email, phone }

            console.log("data of the patient form", userData);

            const user = await createUser(userData);

            if (user) router.push(`/patients/${user.$id}/register`)

        } catch (error) {
            console.log(error);
        }
        finally {
            setIsloading(false);
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section>
                    <h1 className="header">Hi there 👋 </h1>
                    <p className="text-dark-700">Schedule your first appointment</p>
                </section>
                <CustomFormField
                    fieldType={FormFieldtype.INPUT}
                    control={form.control}
                    name="name"
                    label="Full name"
                    placeholder="Ankit"
                    iconSrc="assets/icons/user.svg"
                    iconAlt="user"

                />
                <CustomFormField
                    fieldType={FormFieldtype.INPUT}
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="abc@gmail.com"
                    iconSrc="assets/icons/email.svg"
                    iconAlt="email"

                />
                <CustomFormField
                    fieldType={FormFieldtype.PHONE_INPUT}
                    control={form.control}
                    name="phone"
                    label="Phone Number"
                    placeholder="12345 - 67890"

                />
                <SubmitButton
                    isLoading={isLoading}
                >
                    Get started
                </SubmitButton>
            </form>
        </Form>
    )
}

export default PatientForm
