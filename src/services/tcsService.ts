// services/tcsService.ts

import { api } from "./api"; // Import the configured Axios instance
import axios from "axios";    // 💡 NEW: Import the original axios library

// ----------------------------------------------------
// TCS Shipping Label Types
// ----------------------------------------------------
interface LabelResponse {
    pdfBlob: Blob;
    fileName: string;
}

/**
 * 🏷️ Fetches the TCS shipping label PDF for a given consignment number.
 * @param consignmentNo The TCS consignment number (CN) to print the label for.
 * @returns A promise that resolves to a LabelResponse containing the PDF Blob and filename.
 */
export const getTcsShippingLabel = async (consignmentNo: string): Promise<LabelResponse> => {
    if (!consignmentNo) {
        throw new Error("Consignment number is required to fetch the label.");
    }

    const endpoint = `/tcs/label/${consignmentNo}`; 

    try {
        const response = await api.get(endpoint, {
            responseType: 'arraybuffer', // CRITICAL for binary file handling
        });

        // 1. Get the raw binary data and headers... (file extraction logic remains the same)
        const data = response.data;
        const contentDisposition = response.headers['content-disposition'];
        let fileName = `label-${consignmentNo}.pdf`;
        
        if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+?)"/i);
            if (match && match[1]) {
                fileName = decodeURIComponent(match[1]); 
            }
        }

        // 2. Convert the ArrayBuffer data into a Blob
        const pdfBlob = new Blob([data], { type: response.headers['content-type'] });

        return { pdfBlob, fileName };

    } catch (error) {
        // 💡 FIX APPLIED HERE: Use the imported 'axios' library instead of the 'api' instance
        if (axios.isAxiosError(error) && error.response) {
            // Error handling logic remains the same
            if (error.response.data instanceof ArrayBuffer) {
                const errorText = new TextDecoder().decode(error.response.data);
                try {
                    const errorJson = JSON.parse(errorText);
                    throw new Error(errorJson.details || errorJson.error || "Failed to generate label.");
                } catch {
                    throw new Error(`Server returned an error for the label request.`);
                }
            }
        }
        console.error("TCS Service Error:", error);
        throw new Error("Failed to connect or unknown error occurred during label fetch.");
    }
};