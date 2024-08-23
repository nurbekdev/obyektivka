import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'

const FamilyForm = () => {
	const form = useForm()

	return (
		<Form {...form}>
			<FormField
				control={form.control}
				name='relation'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Relation</FormLabel>
						<FormControl>
							<Input placeholder='Father' {...field} />
						</FormControl>
						<FormDescription>
							Type of relation with the person (e.g., Father, Mother).
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='fullname'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Full Name</FormLabel>
						<FormControl>
							<Input placeholder='John Doe' {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='residence'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Residence</FormLabel>
						<FormControl>
							<Input placeholder='123 Main St, Springfield' {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='birthYear'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Year of Birth</FormLabel>
						<FormControl>
							<Input type='number' placeholder='1980' {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='birthPlace'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Place of Birth</FormLabel>
						<FormControl>
							<Input placeholder='City, Country' {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='jobPosition'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Job Position</FormLabel>
						<FormControl>
							<Input placeholder='Software Engineer' {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='workplace'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Workplace</FormLabel>
						<FormControl>
							<Input placeholder='Tech Company' {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<Button type='submit'>Submit</Button>
		</Form>
	)
}

export default FamilyForm
