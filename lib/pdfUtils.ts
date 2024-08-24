// Wrap text function
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

function wrapTextPage2(
	text: string,
	maxWidth: number,
	fontSize: number,
	font: any
): string[] {
	const words = text.split(' ')
	let lines: string[] = []
	let currentLine = ''

	words.forEach(word => {
		const lineWidth = font.widthOfTextAtSize(currentLine + word, fontSize)
		if (lineWidth <= maxWidth) {
			currentLine += word + ' '
		} else {
			lines.push(currentLine.trim())
			currentLine = word + ' '
		}
	})

	lines.push(currentLine.trim())
	return lines
}

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
	relatives: {
		name: string
		relationship: string
		address: string
		dateOfBirthAndPlace: string
		workplace: string
	}[]
}) {
	const pdfDoc = await PDFDocument.create()
	const page = pdfDoc.addPage([595.28, 841.89]) // A4 size
	const page2 = pdfDoc.addPage([595.28, 841.89])

	const fontSize = 14
	const textFontSize = 12
	const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
	const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
	// Load and embed the image
	const imageBytes = await fetch(formData.imageFile).then(res =>
		res.arrayBuffer()
	)

	const headers = [
		'Qarin-  doshligi',
		'Familyasi, ismi va otasining ismi',
		"Tug'ilgan yili va joyi",
		'Ish joyi va lavozimi',
		'Turar joyi',
	]

	const tableWidth = page2.getWidth() - 100 // Taking 50 units margin from each side
	// const columnWidth = tableWidth / headers.length
	const columnWidth = [60, 130, 130, 90, 90]
	const tableStartX = 50
	const tableStartY = page2.getHeight() - 150
	let yPositionpage2 = tableStartY

	// Draw headers
	let currentX = tableStartX
	headers.forEach(header => {
		page2.drawText(header, {
			x: currentX + 5, // Padding inside the cell
			y: yPositionpage2,
			size: fontSize - 2,
			font: boldFont,
			color: rgb(0, 0, 0),
			maxWidth: columnWidth[headers.indexOf(header)] - 10, // Padding inside the cell
		})
		currentX += columnWidth[headers.indexOf(header)]
	})

	// Draw horizontal line over headers
	yPositionpage2 -= fontSize + 5
	page2.drawLine({
		start: { x: tableStartX, y: yPositionpage2 + 34 },
		end: { x: tableStartX + 5 + tableWidth, y: yPositionpage2 + 34 },
		thickness: 1,
		color: rgb(0, 0, 0),
	})

	// Draw horizontal line under headers
	yPositionpage2 -= fontSize + 5
	page2.drawLine({
		start: { x: tableStartX, y: yPositionpage2 + 8 },
		end: { x: tableStartX + 5 + tableWidth, y: yPositionpage2 + 8 },
		thickness: 2,
		color: rgb(0, 0, 0),
	})

	// Draw vertical lines for columns (header row)
	currentX = tableStartX
	for (let i = 0; i <= headers.length; i++) {
		page2.drawLine({
			start: { x: currentX, y: yPositionpage2 + fontSize + 39 },
			end: { x: currentX, y: yPositionpage2 - 3 * fontSize }, // Adjust height accordingly
			thickness: 1,
			color: rgb(0, 0, 0),
		})
		currentX += columnWidth[i]
	}

	//Draw each relative's data in the table
	yPositionpage2 -= 15 // Move down for the first row
	formData.relatives.forEach(relative => {
		let currentX = tableStartX
		const relativeData = [
			relative.relationship,
			relative.name,
			relative.dateOfBirthAndPlace,
			relative.workplace,
			relative.address,
		]

		relativeData.forEach((data, i) => {
			const wrappedText = wrapTextPage2(
				data,
				columnWidth[i] - 10,
				fontSize,
				font
			)
			wrappedText.forEach((line, index) => {
				page2.drawText(line, {
					x: currentX + 5,
					y: yPositionpage2 - index * (fontSize + 2), // Adjust line height
					size: 11,
					font: font,
					color: rgb(0, 0, 0),
				})
			})
			currentX += columnWidth[i]
		})

		// Draw horizontal line after each row
		yPositionpage2 -= 3 * fontSize + 35
		page2.drawLine({
			start: { x: tableStartX, y: yPositionpage2 + fontSize },
			end: { x: tableStartX + 5 + tableWidth, y: yPositionpage2 + fontSize },
			thickness: 2,
			color: rgb(0, 0, 0),
		})

		// Draw vertical line after each row
		currentX = tableStartX
		for (let i = 0; i <= headers.length; i++) {
			page2.drawLine({
				start: { x: currentX, y: yPositionpage2 + fontSize + 70 },
				end: { x: currentX, y: yPositionpage2 + 5 }, // Adjust height accordingly
				thickness: 1,
				color: rgb(0, 0, 0),
			})
			currentX += columnWidth[i]
		}
	})

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

	let yLevel = yPosition - wrappedText.height - 11 * alwaysTabs
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

	let yPosition2 = page2.getHeight() - 50 // Start position from the top

	// Draw relatives title
	page2.drawText(
		`${formData.surname} ${formData.name}  ${formData.lastname}ning yaqin qarindoshlari haqida`,
		{
			x:
				(page.getWidth() -
					font.widthOfTextAtSize(
						`${formData.name} ${formData.surname} ${formData.lastname}ning yaqin qarindoshlari haqida`,
						fontSize
					)) /
				2,
			y: yPosition2 - 50,
			size: fontSize,
			font: boldFont,
			color: rgb(0, 0, 0),
		}
	)
	page2.drawText(`MA'LUMOT:`, {
		x: (page.getWidth() - font.widthOfTextAtSize("ma'lumot", fontSize)) / 2,
		y: yPosition2 - fontSize - 58,
		size: fontSize + 4,
		font: boldFont,
		color: rgb(0, 0, 0),
	})

	const pdfBytes = await pdfDoc.save()
	return new Blob([pdfBytes], { type: 'application/pdf' })
}
