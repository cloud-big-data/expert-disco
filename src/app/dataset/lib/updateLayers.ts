import {
  IColumnFormatting,
  IFilterLayer,
  IGroupLayer,
  IJoinLayer,
  ISmartColumn,
  ISortingLayer,
  LayersTypes,
} from '../types';

const updateLayers = (
  {
    layerKey,
    layerData,
  }: {
    layerKey: LayersTypes;
    layerData:
      | IFilterLayer
      | IGroupLayer
      | ISortingLayer
      | IJoinLayer
      | ISmartColumn[]
      | IColumnFormatting
      | Record<string, unknown>;
  },
  socket?: SocketIOClient.Socket,
  setLoading?: () => void,
  refresh = true,
) => {
  setLoading?.();
  socket?.emit('layer', {
    layerKey,
    layerData,
  });
};

export default updateLayers;
