const makeDatasetLink = (datasetId: string, addHost = true): string =>
  addHost
    ? `${window.location.protocol}//${window.location.host}/dataset/${datasetId}`
    : `/dataset/${datasetId}`;

export default makeDatasetLink;
