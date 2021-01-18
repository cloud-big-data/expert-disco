import {
  IColumnFormatting,
  IFilterLayer,
  IGroupLayer,
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
      | ISmartColumn[]
      | IColumnFormatting;
  },
  socket?: SocketIOClient.Socket,
) =>
  socket?.emit('layer', {
    layerKey,
    layerData,
  });

export default updateLayers;
