import { useNavigate } from 'react-router-dom';
import { useLoadUnknownCredit } from '../hooks/useGetUC';
import { useTextToImageMutation } from '../api/imageApi';
import { toast } from 'react-toastify';

export const useGenerateImage = (): [(prompt: string) => Promise<string | null>, boolean] => {
    const navigate = useNavigate();

    const { loadUnknownCredit } = useLoadUnknownCredit();

    const [textToImage, { isLoading: isGenImageLoading }] = useTextToImageMutation();

    const generateTextToImage = async (prompt: string): Promise<string | null> => {
        const response = await textToImage({ prompt });
    
        if ('data' in response) {
            const { data } = response;
            // console.log('Image generated:', data);
            await loadUnknownCredit();
            if (data?.uc === 0) {
                navigate('/buy-unknown-credit');
            }
            return data?.imageUrl;
        } else if ('error' in response) {
            const err = response.error as any;
            // console.error('Unable to generate image:', err);
            toast.error(err?.data?.message || 'Unable to generate image');
            if (err?.data?.message === 'Insufficient UC') {
                navigate('/buy-unknown-credit');
            }
        }

        return null;
    }

    return [generateTextToImage, isGenImageLoading];
}; 