import { createSlice, PayloadAction } from 'redux-starter-kit';

export type SelectedMetrics = {
  selectedMetricsList: Array<string>
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
 selectedMetricsList: [''] 
};

const slice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    userSelectedMetrics: (state, action: PayloadAction<SelectedMetrics>) => {
      const { selectedMetricsList } = action.payload;
     // selectedMetricsList.map((e)=>{console.log(e)})
      state.selectedMetricsList = [...selectedMetricsList];
   
    },
    selectedMetricApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
