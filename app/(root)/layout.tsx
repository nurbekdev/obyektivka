import { ChildProps } from '@/types'

function Layout({ children }: ChildProps) {
	return (
		<div>
			{/* <Navbar /> */}
			<h1 className='text-center font-bold text-4xl text-blue-500'>
				Obyektivka
			</h1>
			<main>{children}</main>
		</div>
	)
}

export default Layout
