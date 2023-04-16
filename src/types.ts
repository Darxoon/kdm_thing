import { BinaryReader } from "./misc.js"
import { assert } from "./util.js"

export class KdmContainer {
	sections: Section[]
	
	constructor(sections: Section[]) {
		this.sections = sections
	}
	
	static fromBinaryReader(reader: BinaryReader): KdmContainer {
		const buffer = reader.arrayBuffer
		
		reader.position = 0
		
		// KDMR header, always consistently "KDMR" in ascii + 00 01 01 00 in hex
		let headerA = reader.readUint32()
		assert(headerA == 0x524d444b, "Invalid KDM file")
		let headerB = reader.readUint32()
		assert(headerB == 0x10100, "Invalid KDM file")
		
		// section header table
		// Contains 32-bit integer for each section, with this integer being the offset of the section divided by 4
		// There is no specific amount of sections given, the table simply ends when the first section starts
		let sectionOffsets = []
		
		while (sectionOffsets.length == 0 || sectionOffsets[0] > reader.position) {
			sectionOffsets.push(reader.readInt32() * 4)
		}
		
		let sections = []
		
		for (let i = 0; i < sectionOffsets.length; i++) {
			let start = sectionOffsets[i]
			
			let end = i == sectionOffsets.length - 1
				? buffer.byteLength
				: sectionOffsets[i + 1]
			
			let content = buffer.slice(start, end)
			
			sections.push(new Section(start, content.byteLength, content))
		}
		
		return new KdmContainer(sections)
	}
}

export class Section {
	offset: number
	size: number
	content: ArrayBuffer
	
	constructor(offset: number, size: number, content: ArrayBuffer) {
		this.offset = offset
		this.size = size
		this.content = content
	}
	
	getStringAt(offset: number): string {
		const view = new DataView(this.content)
			
		// find zero terminator
		let stringEnd = offset
		while (view.getUint8(stringEnd) != 0)
			stringEnd += 1
		
		return new TextDecoder('utf-8').decode(this.content.slice(offset, stringEnd))
	}
}
