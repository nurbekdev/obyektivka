import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { userSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { generatePDF } from '@/lib/pdfUtils'
import { Button } from '@/components/ui/button'
import { ChangeEvent, useState } from 'react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@/components/ui/select'
import { SelectValue } from '@radix-ui/react-select'
import { malumotlar } from '@/constanta'

const defaultVal = {
	name: '',
	surname: '',
	lastname: '',
	dataOfBirth: '',
	dateOfPosition: '',
	currentPosition: '',
	placeOfBirth: '',
	millati: '',
	malumoti: '',
	partiyaviyligi: '',
	tamomlagan: '',
	profissional: '',
	member: '',
	reward: '',
}

function UserForm() {
	const form = useForm<z.infer<typeof userSchema>>({
		resolver: zodResolver(userSchema),
		defaultValues: defaultVal,
	})
	const [imageFile, setImageFile] = useState<string | null>(null)
	const [imageType, setImageType] = useState<string | null>(null)
	const [tamomlagan, setTamomlagan] = useState<string[]>([''])
	const [levelOfScience, setLevelOfScience] = useState<string[]>([''])
	function onUpload(e: ChangeEvent<HTMLInputElement>) {
		const files = e.target.files
		if (!files) return null
		const file = files[0]

		const reader = new FileReader()
		setImageType(file.type) // Rasm turini saqlash

		reader.readAsDataURL(file)
		reader.onload = e => {
			const result = e.target?.result as string
			setImageFile(result)
		}
	}

	const addJobField = () => {
		setTamomlagan([...tamomlagan, ''])
	}

	const removeJobField = (index: number) => {
		setTamomlagan(tamomlagan.filter((_, i) => i !== index))
	}

	const handleJobChange = (index: number, value: string) => {
		const newJobFields = [...tamomlagan]
		newJobFields[index] = value
		setTamomlagan(newJobFields)
	}
	const addLevelField = () => {
		setLevelOfScience([...levelOfScience, ''])
	}

	const removeLevelField = (index: number) => {
		setLevelOfScience(levelOfScience.filter((_, i) => i !== index))
	}

	const handleLevelChange = (index: number, value: string) => {
		const newLevelFields = [...levelOfScience]
		newLevelFields[index] = value
		setLevelOfScience(newLevelFields)
	}
	const onSubmit = async (data: z.infer<typeof userSchema>) => {
		if (!imageFile || !imageType) {
			alert('Iltimos, rasmni yuklang!')
			return
		}

		const jobData = tamomlagan
			.filter(job => job.trim() !== '')
			.map(job => job.trim())

		const levelData = levelOfScience
			.filter(level => level.trim() !== '')
			.map(level => level.trim())

		const finalJobData = jobData.length > 0 ? jobData : ['-']
		const finalLevelData = levelData.length > 0 ? levelData : ['-']

		const pdfBlob = await generatePDF({
			...data,
			imageFile,
			imageType,
			jobData: finalJobData,
			levelData: finalLevelData,
		})

		const url = URL.createObjectURL(pdfBlob)
		const link = document.createElement('a')
		link.href = url
		link.download = `${data.name} ${data.surname} ${data.lastname}.pdf`
		document.body.appendChild(link)
		link.click()
		link.remove()
		URL.revokeObjectURL(url)
	}

	return (
		<div className='bg-green-100 p-8'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<h1 className='mb-4 font-bold'>Ma&apos;lumotlaringizni kiriting:</h1>
					<div className='flex items-center justify-center gap-4'>
						<FormField
							control={form.control}
							name='surname'
							render={({ field }) => (
								<FormItem className='mt-4'>
									<FormLabel>
										Familiya <span className='text-red-500'>*</span>
									</FormLabel>
									<FormControl>
										<Input placeholder='Misol: Qodirov' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						></FormField>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem className='mt-4'>
									<FormLabel>
										Ism <span className='text-red-500'>*</span>
									</FormLabel>
									<FormControl>
										<Input placeholder='Misol: Botir' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						></FormField>
						<FormField
							control={form.control}
							name='lastname'
							render={({ field }) => (
								<FormItem className='mt-4'>
									<FormLabel>
										Sharif <span className='text-red-500'>*</span>
									</FormLabel>
									<FormControl>
										<Input placeholder='Misol: Bahodirovich' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						></FormField>
					</div>
					<FormItem className='mt-4'>
						<FormLabel>
							Rasm (3x4)<span className='text-red-500'>*</span>
						</FormLabel>
						<Input
							className='bg-secondary bg-center'
							type='file'
							onChange={onUpload}
						/>
					</FormItem>
					<FormField
						control={form.control}
						name='dateOfPosition'
						render={({ field }) => (
							<FormItem className='mt-4'>
								<FormLabel>
									Joriy lavozim sanasi <span className='text-red-500'>*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder='Misol: 2024-yil 04-sentabrdan:'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					></FormField>
					<FormField
						control={form.control}
						name='currentPosition'
						render={({ field }) => (
							<FormItem className='mt-4'>
								<FormLabel>
									Joriy lavozim to&apos;liq{' '}
									<span className='text-red-500'>*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Samarqand Davlat Universiteti matematika fakulteti amaliy matematika yo'nalishi talabasi"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					></FormField>
					<FormField
						control={form.control}
						name='dataOfBirth'
						render={({ field }) => (
							<FormItem className='mt-4'>
								<FormLabel>
									Tug&apos;lugan sana <span className='text-red-500'>*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder='Misol: 15.12.1999  kun/oy/yil'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					></FormField>
					<FormField
						control={form.control}
						name='placeOfBirth'
						render={({ field }) => (
							<FormItem className='mt-4'>
								<FormLabel>
									Tug&apos;ulgan joy<span className='text-red-500'>*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder='Misol: Samarqand viloyati, Jomboy tumani'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					></FormField>
					<div className='flex items-center justify-around gap-4'>
						<FormField
							control={form.control}
							name='millati'
							render={({ field }) => (
								<FormItem className='mt-4 w-full'>
									<FormLabel>
										Millati<span className='text-red-500'>*</span>
									</FormLabel>
									<FormControl>
										<Input placeholder="Misol: O'zbek" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						></FormField>
						<FormField
							control={form.control}
							name='malumoti'
							render={({ field }) => (
								<FormItem className='mt-4 w-full'>
									<FormLabel>
										Ma&apos;lumoti<span className='text-red-500'>*</span>
									</FormLabel>
									<FormControl>
										<Select
											defaultValue={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger className='w-full bg-secondary'>
												<SelectValue placeholder="ma'lumoti" />
											</SelectTrigger>
											<SelectContent>
												{malumotlar.map(item => (
													<SelectItem key={item} value={item}>
														{item}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						></FormField>
					</div>
					<FormField
						control={form.control}
						name='partiyaviyligi'
						render={({ field }) => (
							<FormItem className='mt-4'>
								<FormLabel>
									Partiyaviyligi<span className='text-red-500'>*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Misol: Oʻzbekiston Xalq demokratik partiyasi a'zosi"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					></FormField>
					<h2 className='mt-4'>
						Tamomlagan: <span className='text-red-500'>*</span>
					</h2>
					<div className='flex flex-col items-center justify-center gap-2'>
						{tamomlagan.map((job, index) => (
							<div key={index} className='flex items-center mb-2 w-full'>
								<Input
									value={job}
									placeholder={
										'Misol: Samarqand Davlat Universiteti (bakalavriyat)'
									}
									onChange={e => handleJobChange(index, e.target.value)}
									className='flex-1'
								/>
								{/* "X" tugmasi */}
								<Button
									type='button'
									onClick={() => removeJobField(index)}
									className='ml-2 hover:text-red-700'
									variant={'outline'}
								>
									X
								</Button>
							</div>
						))}
						<Button
							type='button'
							onClick={addJobField}
							className='w-full'
							variant={'outline'}
						>
							Maydon qo&apos;shish
						</Button>
					</div>
					<FormField
						control={form.control}
						name='profissional'
						render={({ field }) => (
							<FormItem className='mt-4'>
								<FormLabel>
									Ma&apos;lumoti bo&apos;yicha mutaxassisligi
									<span className='text-red-500'>*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder='Misol: Dasturchi (ixtiyoriy)'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					></FormField>

					<h2 className='mt-4'>
						Qaysi chet tillarini biladi: <span className='text-red-500'>*</span>
					</h2>
					<div className='flex flex-col items-center justify-center gap-2'>
						{levelOfScience.map((level, index) => (
							<div key={index} className='flex items-center mb-2 w-full'>
								<Input
									value={level}
									placeholder={"Misol:ingliz (yoki yo'q)"}
									onChange={e => handleLevelChange(index, e.target.value)}
									className='flex-1'
								/>
								{/* "X" tugmasi */}
								<Button
									type='button'
									onClick={() => removeLevelField(index)}
									className='ml-2 hover:text-red-700'
									variant={'outline'}
								>
									X
								</Button>
							</div>
						))}
						<Button
							type='button'
							onClick={addLevelField}
							className='w-full'
							variant={'outline'}
						>
							Maydon qo&apos;shish
						</Button>
					</div>

					<FormField
						control={form.control}
						name='reward'
						render={({ field }) => (
							<FormItem className='mt-4'>
								<FormLabel>
									Davlat mukofotlari bilan taqdirlanganmi (qanaqa)
									<span className='text-red-500'>*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="agar bo'lmasa (yo'q )kiritilsin"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					></FormField>

					<FormField
						control={form.control}
						name='member'
						render={({ field }) => (
							<FormItem className='mt-4'>
								<FormLabel>
									Xalq deputatlari respublika, viloyat, shahar va tuman Kengashi
									deputatimi yoki boshqa saylanadigan organlarning
									a&apos;zosimi:<span className='text-red-500'>*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="A'zo bo'lmasa yo'q kiritilsin"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					></FormField>

					<Button
						type='submit'
						className='mt-4 bg-blue-500 text-white py-2 px-4 rounded'
					>
						PDF Yaratish
					</Button>
				</form>
			</Form>
		</div>
	)
}

export default UserForm
