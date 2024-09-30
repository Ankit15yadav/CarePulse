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
import { userFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { FormFieldtype } from "./PatientForm"

// export enum FormFieldtype {
//     INPUT = 'input',
//     CHECKBOX = 'checkbox',
//     TEXTAREA = 'textarea',
//     PHONE_INPUT = 'phoneInput',
//     DATE_PICKER = 'datePicker',
//     SELECT = 'select',
//     SKELETON = 'skeleton',

// }


const RegisterForm = ({ user }: { user: User }) => {
    const router = useRouter();

    const [isLoading, setIsloading] = useState(false);

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
                <section className="space-y-4">
                    <h1 className="header">Welcome 👋 </h1>
                    <p className="text-dark-700">Let us know more about yourself</p>
                </section>
                <section className="space-y-y">
                    <p className="sub-header">Personal Information</p>
                </section>
                <CustomFormField
                    fieldType={FormFieldtype.INPUT}
                    control={form.control}
                    name="name"
                    label="Full name"
                    placeholder="Ankit"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"

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

export default RegisterForm
