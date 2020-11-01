import { IBoardData } from 'app/dataset/types';

export interface IViewProps {
  boardActions: any;
  setBoardData: (data: IBoardData) => void;
  closeModal: () => void;
}
