import { FileChartColumn, Send } from 'lucide-react'
import Link from 'next/link'

function Navbar() {
	return (
		<div className=' h-[8vh] bg-blue-100 w-full px-60 py-4'>
			<div className='flex items-center justify-center gap-12 text-xl text-indigo-400 font-bold '>
				{/* <h1 className='hover:text-indigo-600'>Ma&apos;lumotnoma</h1> */}

				<div className='flex items-center justify-center gap-2 hover:text-indigo-600'>
					<FileChartColumn />
					<Link
						href={'/obyektivka-namuna.docx'}
						className='underline-offset-2 hover:text-indigo-600'
					>
						Namunaviy fayl
					</Link>
				</div>
				<div className='flex items-center justify-center gap-2 hover:text-indigo-600'>
					<Send />
					<Link href={'https://t.me/Ilhomdeveloper'}>Dasturchi: Ilhom</Link>
				</div>
			</div>
		</div>
	)
}

export default Navbar
