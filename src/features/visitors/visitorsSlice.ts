import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../api/client";
import {
  approveVisitor as approveVisitorApi,
  createVisitor,
  deleteVisitor as deleteVisitorApi,
  getVisitors,
  rejectVisitor as rejectVisitorApi,
  type Visitor,
  type VisitorPayload,
} from "../../api/visitors";

type VisitorsState = {
  items: Visitor[];
  loading: boolean;
  saving: boolean;
  actionId: string | null;
  error: string | null;
};

const initialState: VisitorsState = {
  items: [],
  loading: false,
  saving: false,
  actionId: null,
  error: null,
};

export const fetchVisitors = createAsyncThunk(
  "visitors/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getVisitors();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load visitors"));
    }
  },
);

export const addVisitor = createAsyncThunk(
  "visitors/create",
  async (payload: VisitorPayload, { rejectWithValue }) => {
    try {
      return await createVisitor(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to add visitor"));
    }
  },
);

export const approveVisitor = createAsyncThunk(
  "visitors/approve",
  async (id: string, { rejectWithValue }) => {
    try {
      return await approveVisitorApi(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to approve"));
    }
  },
);

export const rejectVisitor = createAsyncThunk(
  "visitors/reject",
  async (id: string, { rejectWithValue }) => {
    try {
      return await rejectVisitorApi(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to reject"));
    }
  },
);

export const removeVisitor = createAsyncThunk(
  "visitors/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteVisitorApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to delete"));
    }
  },
);

function replaceVisitor(items: Visitor[], visitor: Visitor) {
  const index = items.findIndex((item) => item.id === visitor.id);
  if (index === -1) items.unshift(visitor);
  else items[index] = visitor;
}

const visitorsSlice = createSlice({
  name: "visitors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisitors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisitors.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVisitors.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to load visitors";
      })
      .addCase(addVisitor.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(addVisitor.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
      })
      .addCase(addVisitor.rejected, (state, action) => {
        state.saving = false;
        state.error = (action.payload as string) ?? "Failed to add visitor";
      })
      .addCase(approveVisitor.pending, (state, action) => {
        state.actionId = action.meta.arg;
        state.error = null;
      })
      .addCase(approveVisitor.fulfilled, (state, action) => {
        state.actionId = null;
        replaceVisitor(state.items, action.payload);
      })
      .addCase(approveVisitor.rejected, (state, action) => {
        state.actionId = null;
        state.error = (action.payload as string) ?? "Failed to approve";
      })
      .addCase(rejectVisitor.pending, (state, action) => {
        state.actionId = action.meta.arg;
        state.error = null;
      })
      .addCase(rejectVisitor.fulfilled, (state, action) => {
        state.actionId = null;
        replaceVisitor(state.items, action.payload);
      })
      .addCase(rejectVisitor.rejected, (state, action) => {
        state.actionId = null;
        state.error = (action.payload as string) ?? "Failed to reject";
      })
      .addCase(removeVisitor.pending, (state, action) => {
        state.actionId = action.meta.arg;
        state.error = null;
      })
      .addCase(removeVisitor.fulfilled, (state, action) => {
        state.actionId = null;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(removeVisitor.rejected, (state, action) => {
        state.actionId = null;
        state.error = (action.payload as string) ?? "Failed to delete";
      });
  },
});

export default visitorsSlice.reducer;
