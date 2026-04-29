import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  user: {
    username: string
  } | null,
  showLogin: boolean,
  token: string | null,
  uc: number,
}

const initialState: UserState = {
  user: null,
  showLogin: false,
  token: localStorage.getItem('token') || null,
  uc: 0
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState['user']>) {
      state.user = action.payload;
    },
    setShowLogin(state, action: PayloadAction<UserState['showLogin']>) {
      state.showLogin = action.payload;
    },
    setToken(state, action: PayloadAction<UserState['token']>) {
      state.token = action.payload;
      if (action.payload) 
        localStorage.setItem('token', action.payload);
      else 
        localStorage.removeItem('token');
    },
    setCredit(state, action: PayloadAction<UserState['uc']>) {
      state.uc = action.payload
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.uc = 0;
      localStorage.removeItem('token');
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUser, setShowLogin, setToken, setCredit, logout } = userSlice.actions;

export default userSlice.reducer;