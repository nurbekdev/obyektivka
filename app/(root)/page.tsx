'use client'

import { useState } from 'react'
import { PDFDocument, rgb } from 'pdf-lib'
import FamilyForm from './_components/family-form'
import UserForm from './_components/user-form'

interface FamilyMember {
	relation: string
	name: string
}
function Page() {
	const [firstname, setFirstname] = useState('')
	const [surname, setSurname] = useState('')
	const [lastname, setLastname] = useState('')
	const [image, setImage] = useState<File | null>(null)
	const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setImage(event.target.files[0])
		}
	}
	// Maydon qo'shish uchun
	const handleAddFamilyMember = () => {
		setFamilyMembers([...familyMembers, { relation: '', name: '' }])
	}

	const handleFamilyMemberChange = (
		index: number,
		field: string,
		value: string
	) => {
		const updatedMembers = [...familyMembers]
		updatedMembers[index] = { ...updatedMembers[index], [field]: value }
		setFamilyMembers(updatedMembers)
	}

	return (
		<div className='flex justify-center items-center gap-4 mt-10'>
			<UserForm />
			{/* <FamilyForm /> */}
		</div>
	)
}

export default Page
