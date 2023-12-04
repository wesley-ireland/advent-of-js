import fs from "fs";

export async function readInput() {
    const fileName = `inputs/day${process.env.SAMPLE ? `${process.env.DAY}-sample` : `${process.env.DAY}`}.txt`
    return await fs.promises.readFile(fileName, 'utf8');
}
