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
// import { userFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"

export enum FormFieldtype {
    INPUT = 'input',
    CHECKBOX = 'checkbox',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',

}


const PatientForm = () => {
    const router = useRouter();

    const [isLoading, setIsloading] = useState(false);

    const userFormValidation = z.object({
        name: z.string()
            .min(2, "Username must be at least 2 characters.")
            .max(50, "name must be at most 50 characters"),

        email: z.string().email("invalid email address"),
        phone: z.string().refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number')
    })

    const form = useForm<z.infer<typeof userFormValidation>>({
        resolver: zodResolver(userFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    })



    async function onSubmit({ name, email, phone }: z.infer<typeof userFormValidation>) {

        setIsloading(true);

        try {

            // const userData = { name, email, phone }

            // const user = await createUser(userData);

            // if (user) router.push(`/patients/${user.$id}/register`)

        } catch (error) {
            console.log(error);
        }
        // finally {
        //     setIsloading(false);
        // }
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
