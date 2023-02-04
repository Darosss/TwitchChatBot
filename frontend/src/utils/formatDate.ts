const formatDate = (date: Date, format?: "date" | "time" | "days+time") => {
  let formatedDate = "";

  switch (format) {
    case "date":
      formatedDate = date?.toString().split("T")[0];
      break;

    case "time":
      formatedDate = date?.toString().split("T")[1].split(".")[0];
      break;

    case "days+time":
      formatedDate = daysAndHoursAgoFormat(date);
      break;

    default:
      formatedDate = date?.toString().replace("T", " ").split(".")[0];
  }

  return String(formatedDate);
};

const daysAndHoursAgoFormat = (date: Date) => {
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
  } else {
    formated += `${hours}h`;
  }

  formated += ` ${date?.toString().split("T")[1].split(".")[0]}`;
  return formated;
};

export default formatDate;
