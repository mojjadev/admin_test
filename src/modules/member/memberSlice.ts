import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../../api/member";
import {
  IMemberDetailResponse,
  IMemberListItemProps,
  IMemberListResponse,
} from "../../api/member";
import { isEmpty } from "../../lib/util";

interface IMemberState
  extends IMemberListItemProps,
    IMemberListResponse,
    IMemberDetailResponse {
  error: string;
  errorMessage: string;
  isSave: boolean;
  isModify: boolean;
  page: number;
  size: number;
  keyword?: string | null;
  keyValue?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  userType?: string | null;
  searchPushActive: string;
  nickNameChange: boolean;
}

const initialState: IMemberState = {
  error: "",
  errorMessage: "",
  isSave: false,
  isModify: false,
  items: [],
  pageMetadata: {
    size: 20,
    totalPages: 1,
    totalElements: 1,
    last: true,
  },
  page: 0,
  size: 20,
  keyword: "",
  keyValue: "",
  startDate: "",
  endDate: "",
  userType: "",
  pushActive: "",
  id: "",
  email: "",
  nickName: "",
  state: "",
  createdAt: "",
  channelActive: false,
  phoneNumber: "",
  nightPushActive: "",
  adPushActive: "",
  nickNameChange: false,
  searchPushActive: "",
};

const name = "member";

export const asyncGetMemberList = createAsyncThunk(
  `${name}/asyncGetMemberList`,
  async (pageInfo: any, { rejectWithValue }) => {
    try {
      const {
        page,
        size = 20,
        keyword,
        keyValue,
        startDate,
        endDate,
        userType,
        searchPushActive,
      } = pageInfo;
      const response = await API.getMemberList(
        page,
        size,
        keyword,
        keyValue,
        startDate,
        endDate,
        userType,
        searchPushActive
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.status);
    }
  }
);

export const asyncGetMemberDetail = createAsyncThunk(
  `${name}/asyncGetMemberDetail`,
  async (data: any, { rejectWithValue }) => {
    try {
      const { id } = data;
      const response = await API.getMemberDetail(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.status);
    }
  }
);

export const asyncNickNameValidationCheck = createAsyncThunk(
  `${name}/asyncNickNameValidationCheck`,
  async (data: any, { rejectWithValue }) => {
    try {
      const { nickName } = data;
      const response = await API.nickNameValidationCheck(nickName);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.status);
    }
  }
);

export const asyncEditMemberDetail = createAsyncThunk(
  `${name}/asyncEditMemberDetail`,
  async (data: any, { rejectWithValue }) => {
    try {
      const { id, email, nickName } = data;
      const response = await API.editMemberDetail(id, email, nickName);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.status);
    }
  }
);
const member = createSlice({
  name,
  initialState,
  reducers: {
    changePage(state, { payload }: PayloadAction<number>) {
      state.page = payload;
    },
    changeNickName(state, { payload }: PayloadAction<string>) {
      state.nickName = payload;
    },
    changeNickNamecheck(state, { payload }: PayloadAction<boolean>) {
      state.nickNameChange = payload;
    },
  },
  extraReducers: {
    [asyncGetMemberList.fulfilled.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      state.items = payload.items;
      state.pageMetadata = payload.pageMetadata;
    },
    [asyncGetMemberList.rejected.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      state.errorMessage = "???????????? ???????????? ?????? ????????? ?????????????????????.";
    },
    [asyncGetMemberDetail.fulfilled.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      state.email = payload.email;
      state.nickName = payload.nickName;
      state.pushActive = payload.pushActive;
      state.state = payload.state;
      state.channelActive = payload.channelActive;
      state.phoneNumber = payload.phoneNumber;
      state.nightPushActive = payload.nightPushActive;
      state.adPushActive = payload.adPushActive;
      state.createdAt = payload.createdAt;
    },
    [asyncGetMemberDetail.rejected.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      state.errorMessage = "????????? ???????????? ?????? ????????? ?????????????????????.";
    },
    [asyncNickNameValidationCheck.fulfilled.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      payload
        ? alert("?????? ????????? ??????????????????. ?????? ??????????????????.")
        : alert("?????? ????????? ??????????????????.");
      state.nickNameChange = payload;
    },
    [asyncNickNameValidationCheck.rejected.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      state.nickNameChange = true;
      alert("?????? ?????? ?????? ????????? ?????????????????????.");
      state.errorMessage = "?????? ?????? ?????? ????????? ?????????????????????.";
    },
    [asyncEditMemberDetail.fulfilled.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      state.isModify = true;
      state.nickNameChange = payload;
    },
    [asyncEditMemberDetail.rejected.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      state.isModify = false;
      state.nickNameChange = true;
      state.errorMessage = "????????? ???????????? ????????? ?????????????????????.";
    },
  },
});

export const { changePage, changeNickName, changeNickNamecheck } =
  member.actions;

export default member.reducer;
