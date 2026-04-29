import axios from 'axios';
import type FormData from 'form-data';

// rate limit
export const apiData = async (formData: FormData): Promise<string> => {
    try {
        if (!process.env.CLIPDROP_API_URL || !process.env.CLIPDROP_API_KEY) {
            throw new Error('API URL or API Key is not set in environment variables');
        }

        const { data } = await axios.post(process.env.CLIPDROP_API_URL, formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY
            },
            responseType: 'arraybuffer'
        });

        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const imageUrl = `data:image/png;base64,${base64Image}`;
        return imageUrl;
    } catch (error: any) {
        console.error('Error fetching data from ClipDrop API:', error);
        throw new Error('Failed to fetch image from API');
    }
}