import { CarReport } from '../types/pet';

export type RootStackParamList = {
  Home: undefined;
  List: undefined;
  Form: undefined;
  Detail: { car: CarReport };
  Stats: undefined;
};