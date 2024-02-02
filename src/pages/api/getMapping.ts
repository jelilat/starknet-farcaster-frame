import type { NextApiRequest, NextApiResponse } from "next";
import { getMappingByStarknetAddress } from "./db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const starknetAddress = req.query.starknetAddress as string;

    try {
      const fid = await getMappingByStarknetAddress(starknetAddress);
      res.status(200).json({ fid });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
