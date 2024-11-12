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
import { Separator } from '@/components/ui/separator'

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
	const [relatives, setRelatives] = useState([
		{
			name: '',
			relationship: '',
			address: '',
			dateOfBirthAndPlace: '',
			workplace: '',
		},
	])
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

	const addRelative = () => {
		setRelatives([
			...relatives,
			{
				name: '',
				relationship: '',
				address: '',
				dateOfBirthAndPlace: '',
				workplace: '',
			},
		])
	}
	const removeRelative = (index: number) => {
		const newRelatives = [...relatives]
		newRelatives.splice(index, 1)
		setRelatives(newRelatives)
	}

	const handleChange = (
		index: number,
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = event.target
		const key = name as keyof (typeof newRelatives)[0]
		const newRelatives = [...relatives]
		newRelatives[index][key] = value
		setRelatives(newRelatives)
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
			relatives,
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
					<div className='flex flex-col items-center justify-center gap-2'>
						<FormField
							control={form.control}
							name='surname'
							render={({ field }) => (
								<FormItem className='mt-2 w-full'>
									<FormLabel>
										Familiya <span className='text-red-500'>*</span>
									</FormLabel>
									<FormControl>
										<Input placeholder='Misol: Pulatov' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						></FormField>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem className='mt-2 w-full'>
									<FormLabel>
										Ism <span className='text-red-500'>*</span>
									</FormLabel>
									<FormControl>
										<Input placeholder='Misol: Nurbek' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						></FormField>
						<FormField
							control={form.control}
							name='lastname'
							render={({ field }) => (
								<FormItem className='mt-2 w-full'>
									<FormLabel>
										Sharif <span className='text-red-500'>*</span>
									</FormLabel>
									<FormControl>
										<Input placeholder='Misol: Xayrullayich' {...field} />
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
										placeholder="Toshkent Milliy Tadqidot universitite sun'iy intellekt fakulteti talabasi"
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
										placeholder='Misol: 05.06.2004  kun/oy/yil'
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
										placeholder='Misol: Qashqadaryo viloyati, Shahrisabz shahri'
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
										'Misol: Toshkent Milliy Tadqiqdot Universitite (bakalavriyat)'
									}
									onChange={e => handleJobChange(index, e.target.value)}
									className='flex-1'
								/>
								{/* "X" tugmasi */}
								<Button
									type='button'
									onClick={() => removeJobField(index)}
									className='ml-2 hover:text-red-700'
									variant={'destructive'}
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
									variant={'destructive'}
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
					<h2 className='mt-4'>Oila a&apos;zolari:</h2>
					{relatives.map((relative, index) => (
						<div key={index} className='flex flex-col gap-2'>
							<Separator className='bg-blue-500 mt-4 h-1' />
							<div className='flex items-center mt-4'>
								<Input
									name='relationship'
									placeholder='Qarindoshlik darajasi'
									value={relative.relationship}
									onChange={e => handleChange(index, e)}
									className='flex-1'
								/>
								<Button
									type='button'
									onClick={() => removeRelative(index)}
									className='ml-2 hover:text-sky-700'
									variant={'destructive'}
								>
									Olib tashlash
								</Button>
							</div>
							<Input
								name='name'
								placeholder="Oila a'zosining ismi, familiyasi va sharifi"
								value={relative.name}
								onChange={e => handleChange(index, e)}
								className='w-full mt-2'
							/>
							<Input
								name='dateOfBirthAndPlace'
								placeholder='Tugʻilgan yili va joyi (Misol: 1980-yil Qashqadaryo vil)'
								value={relative.dateOfBirthAndPlace}
								onChange={e => handleChange(index, e)}
								className='w-full mt-2'
							/>

							<Input
								name='workplace'
								placeholder='Ish joyi va lavozimi'
								value={relative.workplace}
								onChange={e => handleChange(index, e)}
								className='w-full mt-2'
							/>
							<Input
								name='address'
								placeholder='Yashash manzili'
								value={relative.address}
								onChange={e => handleChange(index, e)}
								className='w-full mt-2'
							/>
						</div>
					))}
					<Button
						type='button'
						onClick={addRelative}
						className='w-full mt-4'
						variant={'outline'}
					>
						Yangi oila a&apos;zosini qo&apos;shish
					</Button>
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
