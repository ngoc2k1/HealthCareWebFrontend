export const getHours = (time) => {
  const date = new Date(time);

  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

export const getTime = (dateString) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  const formattedDate = `${hours}:${minutes} - ${day}/${month}/${year}`;

  return formattedDate;
};
