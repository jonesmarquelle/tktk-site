import type { NextApiRequest, NextApiResponse } from "next";
import * as fs from 'node:fs';
import path from "node:path";

export const config = {
    api: {
        responseLimit: '50mb',
    }
}

const download = async (req: NextApiRequest, res: NextApiResponse) => {
    const {
        query: { filename },
        method,
    } = req; 

    try {
        switch (method) {
            case 'GET':
                if(!filename) return res.status(500).end(`Parameter: filename missing`);
                const fn: string = filename as string;

                const filePath = path.resolve('.', fn);
                const fileBuffer = fs.createReadStream(filePath);
                await new Promise ((resolve) => {
                    res.setHeader('Content-Type', 'video/mp4');

                    fileBuffer.pipe(res);
                        fileBuffer.on('end', () => {
                            fs.unlink(filePath,() => {
                                resolve(fileBuffer);
                            });
                        });
                        fileBuffer.on('error', (e) => {
                            res.status(500).json({
                                error: true,
                                message: `File not found\n${e}`
                            });
                            res.end();
                        });
                })
                return;
            default:
                res.setHeader('Allow', ['GET'])
                return res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (e) {
        res.status(500).send({error: true, message: e});
        res.end();
    }
};

export default download;