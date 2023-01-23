const formatDate = (date: Date, format?: "date" | "time") => {
  let formatedDate = "";

  switch (format) {
    case "date":
      formatedDate = date?.toString().split("T")[0];
      break;

    case "time":
      formatedDate = date?.toString().split("T")[1].split(".")[0];
      break;

    default:
      formatedDate = date?.toString().replace("T", " ").split(".")[0];
  }

  return String(formatedDate);
};

export default formatDate;
