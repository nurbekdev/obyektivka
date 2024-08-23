// Wrap text function
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

function wrapText(
	text: string,
	maxWidth: number,
	font: any,
	size: number
): { lines: string[]; height: number } {
	const words = text.split(' ')
	const lines: string[] = []
	let currentLine = words[0]

	words.slice(1).forEach(word => {
		const width = font.widthOfTextAtSize(`${currentLine} ${word}`, size)
		if (width < maxWidth) {
			currentLine += ` ${word}`
		} else {
			lines.push(currentLine)
			currentLine = word
		}
	})
	lines.push(currentLine)
	const lineHeight = size + 5
	const totalHeight = lines.length * lineHeight
	return { lines, height: totalHeight }
}

export async function generatePDF(formData: {
	name: string
	surname: string
	lastname: string
	dataOfBirth: string
	imageFile: string
	imageType: string
	dateOfPosition: string
	currentPosition: string
	placeOfBirth: string
	malumoti: string
	millati: string
	partiyaviyligi: string
	jobData: string[]
	levelData: string[]
	profissional: string
	member: string
	reward: string
}) {
	const pdfDoc = await PDFDocument.create()
	const page = pdfDoc.addPage([595.28, 841.89]) // A4 size

	const fontSize = 14
	const textFontSize = 12
	const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
	const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
	// Load and embed the image
	const imageBytes = await fetch(formData.imageFile).then(res =>
		res.arrayBuffer()
	)

	// Determine the image format and embed accordingly
	let image
	if (formData.imageType === 'image/png') {
		image = await pdfDoc.embedPng(imageBytes)
	} else if (
		formData.imageType === 'image/jpeg' ||
		formData.imageType === 'image/jpg'
	) {
		image = await pdfDoc.embedJpg(imageBytes)
	} else {
		throw new Error(
			'Unsupported image format. Please upload a PNG or JPG image.'
		)
	}

	// Set the dimensions of the image
	const imgWidth = 113.38582677
	const imgHeight = 151.18110236
	const textYPosition = page.getHeight() - 140

	// Position the image in the top-right corner, after the text
	const imgX = page.getWidth() - imgWidth - 50 // 50 points from the right edge
	const imgY = textYPosition - imgHeight + 20 // Slightly below the text

	// Title
	const titleText = "Ma'lumotnoma"
	page.drawText(titleText, {
		x: (page.getWidth() - font.widthOfTextAtSize(titleText, fontSize)) / 2,
		y: page.getHeight() - 70,
		size: 16,
		color: rgb(0, 0, 0),
		font: boldFont,
	})

	const combinedInfo = `${formData.surname} ${formData.name} ${formData.lastname}`

	// Draw the combined text
	page.drawText(combinedInfo, {
		x: (page.getWidth() - font.widthOfTextAtSize(titleText, fontSize)) / 2 - 50,
		y: page.getHeight() - 100, // Position below the title
		size: textFontSize,
		font: boldFont,
		color: rgb(0, 0, 0),
	})

	// Draw the image
	page.drawImage(image, {
		x: imgX,
		y: imgY,
		width: imgWidth,
		height: imgHeight,
	})

	page.drawText(`${formData.dateOfPosition}:`, {
		x: 70,
		y: imgY + imgHeight - 20,
		size: textFontSize,
		font,
		color: rgb(0, 0, 0),
	})

	// Define the maximum width for text
	const maxWidthofCurrentposition = 350
	const wrappedText = wrapText(
		formData.currentPosition,
		maxWidthofCurrentposition,
		font,
		textFontSize
	)

	// Draw the wrapped text
	let alwaysTabs = textFontSize + 8
	let yPosition = imgY + imgHeight - textFontSize - 28
	wrappedText.lines.forEach(line => {
		page.drawText(line, {
			x: 70,
			y: yPosition,
			size: textFontSize,
			font,
			color: rgb(0, 0, 0),
		})
		yPosition -= textFontSize + 5 // Adjust y position for the next line
	})
	page.drawText("Tug'ilgan yili:", {
		x: 70,
		y: yPosition - wrappedText.height + alwaysTabs,
		size: textFontSize,
		font: boldFont,
		color: rgb(0, 0, 0),
	})
	page.drawText("Tug'ilgan joyi:", {
		x: 270,
		y: yPosition - wrappedText.height + alwaysTabs,
		size: textFontSize,
		font: boldFont,
		color: rgb(0, 0, 0),
	})
	page.drawText(formData.dataOfBirth, {
		x: 70,
		y: yPosition - wrappedText.height,
		size: textFontSize,
		font,
		color: rgb(0, 0, 0),
	})
	const maxWidthofplaceOfBirth = 120
	const wrappedTextOFplaceOfBirth = wrapText(
		formData.placeOfBirth,
		maxWidthofplaceOfBirth,
		font,
		textFontSize
	)

	wrappedTextOFplaceOfBirth.lines.map(line => {
		page.drawText(line, {
			x: 270,
			y: yPosition - wrappedText.height,
			size: textFontSize,
			font,
			color: rgb(0, 0, 0),
		})
		yPosition -= textFontSize + 5
	})

	page.drawText('Millati:', {
		x: 70,
		y: yPosition - wrappedText.height - alwaysTabs,
		size: textFontSize,
		font: boldFont,
		color: rgb(0, 0, 0),
	})
	page.drawText('Partiyaviyligi:', {
		x: 270,
		y: yPosition - wrappedText.height - alwaysTabs,
		size: textFontSize,
		font: boldFont,
		color: rgb(0, 0, 0),
	})
	page.drawText(formData.partiyaviyligi, {
		x: 270,
		y: yPosition - wrappedText.height - 2 * alwaysTabs,
		size: textFontSize,
		font,
		color: rgb(0, 0, 0),
	})
	page.drawText("Ma'lumoti:", {
		x: 70,
		y: yPosition - wrappedText.height - 4 * alwaysTabs,
		size: textFontSize,
		font: boldFont,
		color: rgb(0, 0, 0),
	})
	page.drawText(formData.millati, {
		x: 70,
		y: yPosition - wrappedText.height - 2 * alwaysTabs,
		size: textFontSize,
		font,
		color: rgb(0, 0, 0),
	})
	page.drawText(formData.malumoti, {
		x: 70,
		y: yPosition - wrappedText.height - 5 * alwaysTabs,
		size: textFontSize,
		font,
		color: rgb(0, 0, 0),
	})

	page.drawText(
		`${
			formData.profissional.length > 0
				? "Ma'lumoti bo'yicha mutaxassisligi:"
				: ''
		}`,
		{
			x: 70,
			y: yPosition - wrappedText.height - 9 * alwaysTabs,
			size: textFontSize,
			font: boldFont,
			color: rgb(0, 0, 0),
		}
	)
	page.drawText(formData.profissional, {
		x: 280,
		y: yPosition - wrappedText.height - 9 * alwaysTabs,
		size: textFontSize,
		font: font,
		color: rgb(0, 0, 0),
	})

	page.drawText('Tamomlagan:', {
		x: 270,
		y: yPosition - wrappedText.height - 4 * alwaysTabs,
		size: textFontSize,
		font: boldFont,
		color: rgb(0, 0, 0),
	})

	let yPos = yPosition - wrappedText.height - 5 * alwaysTabs
	const maxWidthofTamomlagan = 250
	formData.jobData.forEach(job => {
		const wrappedJob = wrapText(job, maxWidthofTamomlagan, font, textFontSize)

		wrappedJob.lines.forEach(line => {
			page.drawText(line, {
				x: 270,
				y: yPos,
				size: textFontSize,
				font,
				color: rgb(0, 0, 0),
			})
			yPos -= textFontSize + 5
		})

		yPos -= 10
	})

	page.drawText("Qaysi chet tillarini biladi (To'liq ko'rsatilishi lozim):", {
		x: 70,
		y: yPosition - wrappedText.height - 10 * alwaysTabs,
		size: textFontSize,
		font: boldFont,
		color: rgb(0, 0, 0),
	})

	let yLevel = yPos - 4 * alwaysTabs + 10
	const maxWidthofLevel = 250
	formData.levelData.forEach(job => {
		const wrappedJob = wrapText(job, maxWidthofLevel, font, textFontSize)

		wrappedJob.lines.forEach(line => {
			page.drawText(line, {
				x: 70,
				y: yLevel,
				size: textFontSize,
				font,
				color: rgb(0, 0, 0),
			})
			yLevel -= textFontSize + 5
		})

		yLevel -= 10
	})

	page.drawText(
		'Xalq deputatlari respublika, viloyat, shahar va tuman Kengashi deputatimi yoki',
		{
			x: 70,
			y: yPosition - wrappedText.height - 15 * alwaysTabs,
			size: textFontSize,
			font: boldFont,
			color: rgb(0, 0, 0),
		}
	)
	page.drawText("boshqa saylanadigan organlarning a'zosimi:", {
		x: 70,
		y: yPosition - wrappedText.height - 16 * alwaysTabs,
		size: textFontSize,
		font: boldFont,
		color: rgb(0, 0, 0),
	})

	page.drawText(formData.member, {
		x: 70,
		y: yPosition - wrappedText.height - 17 * alwaysTabs,
		size: textFontSize,
		font: font,
		color: rgb(0, 0, 0),
	})

	page.drawText('Davlat mukofotlari bilan taqdirlanganmi (qanaqa): ', {
		x: 70,
		y: yPosition - wrappedText.height - 18 * alwaysTabs,
		size: textFontSize,
		font: boldFont,
		color: rgb(0, 0, 0),
	})
	page.drawText(`${formData.reward}:`, {
		x: 70,
		y: yPosition - wrappedText.height - 19 * alwaysTabs,
		size: textFontSize,
		font: font,
		color: rgb(0, 0, 0),
	})

	page.drawText('Mehnat faoliyati:', {
		x: 200,
		y: yPosition - wrappedText.height - 21 * alwaysTabs,
		size: 16,
		font: boldFont,
		color: rgb(0, 0, 0),
	})

	page.drawText(`${formData.dateOfPosition}:`, {
		x: 70,
		y: yPosition - wrappedText.height - 22 * alwaysTabs,
		size: textFontSize,
		font,
		color: rgb(0, 0, 0),
	})

	const maxWidthofCurrentpositionFooter = 420
	const wrappedTextFooter = wrapText(
		formData.currentPosition,
		maxWidthofCurrentpositionFooter,
		font,
		textFontSize
	)

	wrappedTextFooter.lines.forEach(line => {
		page.drawText(line, {
			x: 70,
			y: yPosition - wrappedText.height - 23 * alwaysTabs,
			size: textFontSize,
			font,
			color: rgb(0, 0, 0),
		})
		yPosition -= textFontSize + 5 // Adjust y position for the next line
	})

	const pdfBytes = await pdfDoc.save()
	return new Blob([pdfBytes], { type: 'application/pdf' })
}
