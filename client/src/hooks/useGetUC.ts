import { useAppDispatch } from '../app/hooks';
import { useUnknowncreditQuery } from '../api/userApi';
import { setCredit, setUser } from '../features/user/userSlice';
import { toast } from 'react-toastify';

export const useLoadUnknownCredit = (): { loadUnknownCredit: () => Promise<void> } => {
  const dispatch = useAppDispatch();

  const { refetch } = useUnknowncreditQuery();

  const loadUnknownCredit = async (): Promise<void> => {
    const res = await refetch();

    if ('data' in res) {
      dispatch(setCredit(res.data?.uc));
      dispatch(setUser(res?.data?.user));
    } else if ('error' in res) {
      const err = res.error as any;
      // console.error('Cannot get uc', err);
      toast.error(err?.data?.message || 'Something went wrong');
    }
  };

  return { loadUnknownCredit };
};