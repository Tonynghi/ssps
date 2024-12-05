export const dateFormatter = (seconds: number): string => {
  const date = new Date(seconds);

  const hour = date.getHours();
  const minute = date.getMinutes();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute} ${
    day < 10 ? `0${day}` : day
  }/${month < 10 ? `0${month}` : month}/${year}`;
};
