import fs from "fs/promises"
import { KdmContainer } from "./types.js"
import { BinaryReader } from "./misc.js"

async function main() {
	let file = await fs.readFile("out/kdm_worldmap_data.bin")
	let fileReader = new BinaryReader(file)
	
	let container = KdmContainer.fromBinaryReader(fileReader)
	
	await fs.writeFile("out/out.json", JSON.stringify(container, undefined, '\t'), 'utf8')
}

await main()
