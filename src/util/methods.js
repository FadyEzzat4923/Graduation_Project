export function timeFormate(timestamp) {
  let time;
  const messageTime = new Date(timestamp);
  const hours = messageTime.getHours();
  const minutes = messageTime.getMinutes();
  const now = new Date();
  const offsetMinutes = now.getTimezoneOffset();
  const offsetHours = -offsetMinutes / 60;
  time = `${
    (hours + offsetHours) % 12 === 0 ? 12 : (hours + offsetHours) % 12
  }:${minutes < 10 ? "0" : ""}${minutes} ${
    (hours + offsetHours) % 24 >= 12 ? "PM" : "AM"
  }`;
  return time;
}

export const egpFormat = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
});

export function isNewDay(currentTimestamp, previousTimestamp) {
  const currentDate = new Date(currentTimestamp);
  const previousDate = new Date(previousTimestamp);
 
  return (
    currentDate.getFullYear() !== previousDate.getFullYear() ||
    currentDate.getMonth() !== previousDate.getMonth() ||
    currentDate.getDate() !== previousDate.getDate()
  );
}

export function getYesterdayDate() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return yesterday;
}
