import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../../api/admin";
import { IAdminListItemProps, IAdminListResponse } from "../../api/admin";
import { isEmpty } from "../../lib/util";

interface IAdminState extends IAdminListResponse, IAdminListItemProps {
  error: string;
  errorMessage: string;
  page: number;
  size: number;
  loginIdCheck: boolean;
  keyword: string;
  keyValue: string;
  startDate: string;
  endDate: string;
}

const initialState: IAdminState = {
  error: "",
  errorMessage: "",
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

  id: 0,
  loginId: "",
  password: "",
  name: "",
  phoneNumber: "",
  departmentName: "",
  authority: "",
  isActive: "",
  roleId: 0,
  loginIdCheck: true,
};

const name = "admin";

export const asyncGetAdminList = createAsyncThunk(
  `${name}/asyncGetAdminList`,
  async (pageInfo: any, { rejectWithValue }) => {
    try {
      const {
        page,
        size = 20,
        keyword,
        keyValue,
        startDate,
        endDate,
      } = pageInfo;
      const response = await API.getAdminList(
        page,
        size,
        keyword,
        keyValue,
        startDate,
        endDate
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.status);
    }
  }
);

export const asyncGetAdminInfo = createAsyncThunk(
  `${name}/asyncGetAdminInfo`,
  async (pageInfo: any, { rejectWithValue }) => {
    try {
      const { id } = pageInfo;
      const response = await API.getAdminInfo(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.status);
    }
  }
);

export const asyncEditAdminInfo = createAsyncThunk(
  `${name}/asyncEditAdminInfo`,
  async (adminData: any, { rejectWithValue }) => {
    const { data, id } = adminData;
    try {
      const response = await API.editAdminInfo(data, id);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.status);
    }
  }
);

export const asyncEditAdminInfoPassword = createAsyncThunk(
  `${name}/asyncEditAdminInfoPassword`,
  async (adminData: any, { rejectWithValue }) => {
    // const { changePassword, id } = adminData;
    try {
      const response = await API.editAdminInfoPassword(adminData);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.status);
    }
  }
);

export const asyncCheckAdminLoginId = createAsyncThunk(
  `${name}/asyncCheckAdminLoginId`,
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await API.checkAdminLoginId(userId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.status);
    }
  }
);

export const asyncSignup = createAsyncThunk(
  `${name}/asyncSignup`,
  async (signupData: any, { rejectWithValue }) => {
    const { loginId, password, name, phoneNumber, department } = signupData;
    try {
      const response = await API.onSignup(
        loginId,
        password,
        name,
        phoneNumber,
        department,
        "Y"
      );
      console.log("asyncSignup " + response);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

//????????? ?????? ?????? ??????
export const asyncOnMyInfoModify = createAsyncThunk(
  `${name}/asyncOnMyInfoModify`,
  async (myInfoData: any, { rejectWithValue }) => {
    console.log(myInfoData);
    const { name, phoneNumber, departmentName, password, changePassword } =
      myInfoData;
    try {
      console.log(name, phoneNumber, departmentName, password, changePassword);
      const response = await API.onMyInfoModify(
        name,
        phoneNumber,
        departmentName,
        password,
        changePassword
      );
      return response;
    } catch (err) {
      return rejectWithValue(err.response.status);
    }
  }
);

const admin = createSlice({
  name,
  initialState,
  reducers: {
    changeDepartmentName(state, { payload }: PayloadAction<string>) {
      state.departmentName = payload;
    },
    changeName(state, { payload }: PayloadAction<string>) {
      state.name = payload;
    },
    changePhoneNumber(state, { payload }: PayloadAction<string>) {
      state.phoneNumber = payload;
    },
    changeIsActive(state, { payload }: PayloadAction<string>) {
      state.departmentName = payload;
    },
    changePassword(state, { payload }: PayloadAction<string>) {
      state.password = payload;
    },
    changePage(state, { payload }: PayloadAction<number>) {
      state.page = payload;
    },
  },

  extraReducers: {
    [asyncGetAdminList.fulfilled.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      state.items = payload.items;
      state.pageMetadata = payload.pageMetadata;
    },
    [asyncGetAdminList.rejected.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      state.error = "???????????? ???????????? ?????? ????????? ?????????????????????.";
    },

    [asyncGetAdminInfo.fulfilled.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      state.id = payload.id;
      state.loginId = payload.loginId;
      state.password = payload.password;
      state.name = payload.name;
      state.phoneNumber = payload.phoneNumber;
      state.departmentName = payload.departmentName;
      state.authority = payload.authority;
      state.isActive = payload.isActive;
      state.roleId = payload.roleId;
    },
    [asyncGetAdminInfo.rejected.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      state.error = payload.message;
    },

    [asyncEditAdminInfo.fulfilled.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      state.name = payload.name;
      state.phoneNumber = payload.phoneNumber;
      state.departmentName = payload.departmentName;
    },
    [asyncEditAdminInfo.rejected.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      state.error = payload.message;
    },
    [asyncEditAdminInfoPassword.fulfilled.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      alert("???????????? ????????? ?????????????????????");
    },
    [asyncEditAdminInfoPassword.rejected.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      state.error = payload.message;
    },

    [asyncCheckAdminLoginId.fulfilled.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      state.loginIdCheck = payload;
      switch (payload) {
        case true:
          alert("?????? ??? ????????? ?????????");
          state.loginIdCheck = payload;
          break;
        case false:
          alert("?????? ????????? ????????? ?????????");
          state.loginIdCheck = payload;
          break;
      }
    },

    [asyncSignup.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.name = payload.name;
      state.phoneNumber = payload.phoneNumber;
      state.departmentName = payload.departmentName;
    },
    [asyncSignup.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.error = payload.message;
    },
    [asyncOnMyInfoModify.fulfilled.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      state.name = payload.name;
      state.phoneNumber = payload.phoneNumber;
      state.departmentName = payload.departmentName;
    },
    [asyncOnMyInfoModify.rejected.type]: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      console.log("payload " + JSON.stringify(payload));
      state.error = payload;
      console.log(isEmpty(payload));
      if (isEmpty(payload) || payload.code !== 200) {
        state.errorMessage = payload?.message;
        alert(
          isEmpty(payload)
            ? "????????? ?????????????????????. ?????? ??????????????? ?????? ?????? ??????????????????."
            : payload.message
        );
      }
    },
  },
});

export const {
  changeDepartmentName,
  changeName,
  changePhoneNumber,
  changeIsActive,
  changePassword,
  changePage,
} = admin.actions;

export default admin.reducer;
