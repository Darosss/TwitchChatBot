const formatDate = (
  date: Date | string,
  format?: "date" | "time" | "days+time"
) => {
  let formatedDate = "";
  let dateInternal =
    typeof date === "string" && isNaN(Number(date))
      ? new Date(date).toISOString()
      : !isNaN(Number(date))
      ? new Date(Number(date)).toISOString()
      : date;

  switch (format) {
    case "date":
      formatedDate = dateInternal?.toString().split("T")[0];
      break;

    case "time":
      formatedDate = dateInternal?.toString().split("T")[1].split(".")[0];
      break;

    case "days+time":
      formatedDate = daysAndHoursAgoFormat(dateInternal);
      break;

    default:
      formatedDate = dateInternal?.toString().replace("T", " ").split(".")[0];
  }

  return String(formatedDate);
};

const daysAndHoursAgoFormat = (date: Date | string) => {
  let formated = "";
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );
  const hours = Math.floor(seconds / 60 / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    formated += `${days}d`;
    let leftHours = hours - days * 24;
    if (leftHours > 0) formated += ` ${leftHours}h,`;
  } else if (hours > 0) {
    formated += `${hours}h`;
  } else {
    formated += `today`;
  }
  formated += ` ${date?.toString().split("T")[1].split(".")[0]}`;
  return formated;
};

export default formatDate;
