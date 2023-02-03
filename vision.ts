import { ImageAnnotatorClient } from "@google-cloud/vision";
import * as dotenv from "dotenv";

dotenv.config();

export const client = new ImageAnnotatorClient()