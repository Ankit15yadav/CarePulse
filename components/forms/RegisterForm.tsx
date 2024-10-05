"use client"

// import { zodResolver } from "@hookform/resolvers/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
// import { userFormValidation } 
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldtype } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"

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

    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: "",
        },
    })



    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {

        setIsloading(true);

        // console.log(values);

        try {

            let formData;

            if (values.identificationDocument && values.identificationDocument.length > 0) {
                const blobFile = new Blob([values.identificationDocument[0]], {
                    type: values.identificationDocument[0].type,
                })

                formData = new FormData();
                formData.append('blob', blobFile)
                formData.append('fileName', values.identificationDocument[0].name);
            }

            try {

                const patientData = {
                    ...values,
                    userId: user.$id,
                    birthDate: new Date(values.birthDate),
                    identificationDocument: formData,

                }

                // @ts-ignore
                const patient = await registerPatient(patientData);
                if (patient) router.push(`/patients/${user.$id}/new-appointment`)

            } catch (err) {

            }

            console.log(formData);

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
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header hover:text-red-400">Personal Information</h2>
                    </div>
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
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldtype.INPUT}
                        control={form.control}
                        name="email"
                        label="Email"
                        placeholder="abc@gmail.com"
                        iconSrc="/assets/icons/email.svg"
                        iconAlt="email"

                    />
                    <CustomFormField
                        fieldType={FormFieldtype.PHONE_INPUT}
                        control={form.control}
                        name="phone"
                        label="Phone Number"
                        placeholder="12345 - 67890"

                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldtype.DATE_PICKER}
                        control={form.control}
                        name="birthDate"
                        label="Date of birth"

                    />
                    <CustomFormField
                        fieldType={FormFieldtype.SKELETON}
                        control={form.control}
                        name="gender"
                        label="Gender"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup
                                    className="flex h-11 gap-6 xl:justify-between"
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    {
                                        GenderOptions.map((option) => (
                                            <div key={option}
                                                className="radio-group"
                                            >
                                                <RadioGroupItem
                                                    value={option}
                                                    id={option}
                                                />
                                                <Label htmlFor={option}
                                                    className="cursor-pointer"
                                                >
                                                    {option}
                                                </Label>
                                            </div>
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                </div>



                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldtype.INPUT}
                        control={form.control}
                        name="address"
                        label="Address"
                        placeholder="69th street ,chennai"

                    />
                    <CustomFormField
                        fieldType={FormFieldtype.INPUT}
                        control={form.control}
                        name="occupation"
                        label="Occupation"
                        placeholder="Software Engineer"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldtype.INPUT}
                        control={form.control}
                        name="emergencyContactName"
                        label="Emergency Contact Name"
                        placeholder="Guardian's name"

                    />
                    <CustomFormField
                        fieldType={FormFieldtype.PHONE_INPUT}
                        control={form.control}
                        name="emergencyContactNumber"
                        label="Emergency contact number"
                        placeholder="12345 - 67890"

                    />
                </div>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header hover:text-red-400">Medical Information</h2>
                    </div>
                </section>

                <CustomFormField
                    fieldType={FormFieldtype.SELECT}
                    control={form.control}
                    name="primaryPhysician"
                    label="Primary Physician"
                    placeholder="select a physician"

                >
                    {
                        Doctors.map((doctor) => (
                            <SelectItem
                                key={doctor.name}
                                value={doctor.name}
                            >
                                <div className="flex cursor-pointer items-center gap-2">
                                    <Image
                                        src={doctor.image}
                                        alt="doctor image"
                                        width={32}
                                        height={32}
                                        className=" rounded-full border border-dark-500"
                                    />
                                    <p>{doctor.name} </p>
                                </div>
                            </SelectItem>

                        ))
                    }
                </CustomFormField>

                <div className="flex flex-col gap-6 xl:flex-row">

                    <CustomFormField
                        fieldType={FormFieldtype.INPUT}
                        control={form.control}
                        name="insuranceProvider"
                        label="Insurance Provider"
                        placeholder="Policybazar"

                    />
                    <CustomFormField
                        fieldType={FormFieldtype.INPUT}
                        control={form.control}
                        name="insurancePolicyNumber"
                        label="Insurance Policy Number"
                        placeholder="ABCD12345"


                    />

                </div>
                <div className="flex flex-col gap-6 xl:flex-row">

                    <CustomFormField
                        fieldType={FormFieldtype.TEXTAREA}
                        control={form.control}
                        name="allergies"
                        label="Allergies (If Any)"
                        placeholder="Peanuts , Pollen ...."

                    />
                    <CustomFormField
                        fieldType={FormFieldtype.TEXTAREA}
                        control={form.control}
                        name="currentMedication"
                        label="Current medication (If Any)"
                        placeholder="Name of the medicine you are taking"
                    />

                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldtype.TEXTAREA}
                        control={form.control}
                        name="familyMedicalHistory"
                        label="Family Medical History"
                        placeholder="Mother / Father had ... disease "

                    />
                    <CustomFormField
                        fieldType={FormFieldtype.TEXTAREA}
                        control={form.control}
                        name="pastMedicalHistory"
                        label="Past Medical History"
                        placeholder="Appendectomy , Tonsillectomy"
                    />
                </div>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header hover:text-red-400">Identification and Verification</h2>
                    </div>
                </section>

                <CustomFormField
                    fieldType={FormFieldtype.SELECT}
                    control={form.control}
                    name="identificationType"
                    label="Identification type"
                    placeholder="select an identification type"

                >
                    {
                        IdentificationTypes.map((type) => (
                            <SelectItem
                                key={type}
                                value={type}
                            >
                                {type}
                            </SelectItem>

                        ))
                    }
                </CustomFormField>

                <CustomFormField
                    fieldType={FormFieldtype.INPUT}
                    control={form.control}
                    name="identificationNumber"
                    label="Identification Number"
                    placeholder="123456789"


                />

                <CustomFormField
                    fieldType={FormFieldtype.SKELETON}
                    control={form.control}
                    name="identificationDocument"
                    label="Scanned Copy of Identification Document"
                    renderSkeleton={(field) => (
                        <FormControl>
                            <FileUploader
                                files={field.value}
                                onChange={field.onChange}
                            />
                        </FormControl>
                    )}
                />

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header hover:text-red-400">Consent and Privacy</h2>
                    </div>
                </section>

                <CustomFormField
                    fieldType={FormFieldtype.CHECKBOX}
                    control={form.control}
                    name="treatmentConsent"
                    label="I consent to treatment"
                />
                <CustomFormField
                    fieldType={FormFieldtype.CHECKBOX}
                    control={form.control}
                    name="disclosureConsent"
                    label="I consent to disclosure of information"
                />
                <CustomFormField
                    fieldType={FormFieldtype.CHECKBOX}
                    control={form.control}
                    name="privacyConsent"
                    label="I consent to privacry policy"
                />

                <SubmitButton
                    isLoading={isLoading}
                >
                    Get started
                </SubmitButton>
            </form>
        </Form >
    )
}

export default RegisterForm
