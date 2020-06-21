import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as dashboardReducer } from '../Features/DashBoard/reducer';

export default {
  weather: weatherReducer,
  dashboard: dashboardReducer
};

