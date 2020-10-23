import moment from 'moment';

const humanizeTimeAgo = (timestamp: string) => {
  if (!timestamp) return null;
  const duration = moment.duration(moment.utc().diff(moment.utc(timestamp)));
  if (Math.floor(duration.asSeconds()) < 60) {
    return `${Math.floor(duration.asSeconds())} seconds ago`;
  }
  return `${duration.humanize()} ago`;
};

export default humanizeTimeAgo;
