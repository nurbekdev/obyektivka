import { string, z } from 'zod'

export const userSchema = z.object({
	name: z.string().min(3, "Ism kamida 3 ta harfdan iborat bo'lishi kerak."),
	surname: z
		.string()
		.min(3, "Familiya kamida 3 ta harfdan iborat bo'lishi kerak."),
	lastname: z
		.string()
		.min(3, "Sharif kamida 3 ta harfdan iborat bo'lishi kerak."),
	dataOfBirth: z
		.string()
		.min(
			9,
			"Sana kamida 9 ta belgidan iborat bo'lishi kerak (masalan, 01.01.2000)."
		),
	dateOfPosition: z.string().min(5),
	currentPosition: z.string().min(5),
	placeOfBirth: z.string().min(3),
	millati: z.string().min(3),
	malumoti: z.string().min(3),
	partiyaviyligi: z.string().min(3),
	profissional: z.string().min(0),
	member: z.string().min(3),
	reward: z.string().min(0),
})
