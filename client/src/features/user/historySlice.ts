import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface HistoryItem {
    _id: string;
    name: string;
    url: string;
    createdAt: string;
}

export interface HistoryState {
    history: HistoryItem[];
}

const initialState: HistoryState = {
    history: []
};

export const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        setHistory(state, action: PayloadAction<HistoryItem[]>) {
            state.history = action.payload.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        },
        addHistoryItem(state, action: PayloadAction<HistoryItem>) {
            state.history.unshift(action.payload);
        },
        updateHistoryItem(state, action: PayloadAction<HistoryItem>) {
            const index = state.history.findIndex(
                (item) => item._id === action.payload._id
            );
            if (index !== -1) {
                state.history[index] = action.payload;
            }
        },
        deleteHistoryItem(state, action: PayloadAction<string>) {
            state.history = state.history.filter(
                (item) => item._id !== action.payload
            );
        }
    },
});

export const {
    setHistory,
    addHistoryItem,
    updateHistoryItem,
    deleteHistoryItem
} = historySlice.actions;

export default historySlice.reducer;
