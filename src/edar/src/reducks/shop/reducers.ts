import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Shop, Genre, InitialState } from './types';

const initialState: InitialState = {
  position: {
    latitude: 0,
    longitude: 0,
  },
  isLoadedLocationInfo: false,
  isLoadedShopInfo: false,
  isProcessing: false,
  shops: [],
  url: '',
  positionErrorMessage: '',
  shopErrorMessage: '',
  genre: '',
  genres: [],
  expandedArray: [],
  range: {
    code: '3',
    label: '～1000m',
  },
  selectedShopIndex: 0,
};

const slice = createSlice({
  name: 'shopInformation',
  initialState,
  reducers: {
    setPosition: (
      state: InitialState,
      action: PayloadAction<{ latitude: number; longitude: number }>
    ) => {
      state.position = action.payload;
      state.isLoadedLocationInfo = true;
    },
    setPositionErrorMessage: (
      state: InitialState,
      action: PayloadAction<number>
    ) => {
      switch (action.payload) {
        case 1:
          state.positionErrorMessage = '位置情報の利用が許可されていません';
          break;
        case 2:
          state.positionErrorMessage = 'デバイスの位置が判定できません';
          break;
        case 3:
          state.positionErrorMessage = 'タイムアウトしました';
          break;
      }
      state.isProcessing = false;
      state.isLoadedLocationInfo = false;
    },
    createURL: (state: InitialState) => {
      state.isProcessing = true;
      let url =
        process.env['REACT_APP_RSTRNT_API_URL'] +
        '/hgs?lat=' +
        state.position.latitude +
        '&lng=' +
        state.position.longitude +
        '&range=' +
        state.range.code +
        '&order=1&genre=' +
        state.genre;
      if (state.url === url) {
        state.isProcessing = false;
      } else {
        state.url = url;
      }
    },
    updateRange: (
      state: InitialState,
      action: PayloadAction<{ code: string; label: string }>
    ) => {
      state.range = action.payload;
    },
    setShops: (state: InitialState, action: PayloadAction<Shop[]>) => {
      state.shops = action.payload;
      state.isLoadedShopInfo = true;
      state.isProcessing = false;
    },
    setIsProcessing: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setGenre: (state: InitialState, action: PayloadAction<string>) => {
      state.genre = action.payload;
    },
    setGenreList: (state: InitialState, action: PayloadAction<Genre[]>) => {
      state.genres = action.payload;
    },
    initExpandedList: (state: InitialState) => {
      let initExpanded: boolean[] = [];
      state.shops.forEach(() => {
        initExpanded.push(false);
      });
      state.expandedArray = initExpanded;
    },
    updateExpanded: (state: InitialState, action: PayloadAction<number>) => {
      state.expandedArray[action.payload] = !state.expandedArray[
        action.payload
      ];
    },
    setShopErrorMessage: (state: InitialState) => {
      state.shopErrorMessage =
        'お店の情報を取得できませんでした。再リロードしてください。';
      state.isLoadedShopInfo = false;
      state.isProcessing = false;
    },
    updateSelectedShopIndex: (
      state: InitialState,
      action: PayloadAction<number>
    ) => {
      state.selectedShopIndex = action.payload;
    },
  },
});

// action creatorをエクスポート
export const {
  setPosition,
  setPositionErrorMessage,
  createURL,
  setShops,
  setIsProcessing,
  setGenre,
  setGenreList,
  initExpandedList,
  updateExpanded,
  setShopErrorMessage,
  updateRange,
  updateSelectedShopIndex,
} = slice.actions;

// reducerをエクスポート
export const shopInformationReducer = slice.reducer;
