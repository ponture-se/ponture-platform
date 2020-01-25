//return safe value
//data: the data which you are going to search field through it
//field: specific index inside data that you need it or pass set of indexes that seprates via dot exp: "index1.index2.index3" = ["index1"]["index2"]["index3"]
//TODO: SafeValue needs data conversion if type checking is passed
export default function SafeValue(
  data,
  index,
  type,
  defaultValue,
  alternativeIndex
) {
  let correctReturn;
  try {
    const parimaryData = data;
    correctReturn = () => {
      if (alternativeIndex && alternativeIndex.length) {
        return SafeValue(
          parimaryData,
          alternativeIndex,
          type,
          defaultValue,
          false
        );
      } else {
        return defaultValue;
      }
    };
    if (!Boolean(data) || data === null) {
      return defaultValue;
    }
    index = index.toString().replace(" ", "");
    index = parseInt(index) === index ? parseInt(index) : index;
    //if index was empty string then just check validation of data
    if (index === "") {
      if (
        data !== null &&
        data !== undefined &&
        (type === "all" || typeof data === type)
      ) {
        return data;
      } else {
        return correctReturn();
      }
    }
    let indexArr = typeof index === "string" ? index.split(".") : index;
    const cnt = indexArr.length;
    let val = "";
    for (let i = 0; i <= cnt - 1; i++) {
      val = indexArr[i];
      if (!Boolean(data)) {
        return defaultValue;
      }
      data = data[val];
      if (i === cnt - 1) {
        if (data !== null && data !== undefined) {
          //special type checkings mention here
          switch (type) {
            case "all":
            case typeof data:
              return data;
            case "json":
              type = typeof JSON.parse(data);
              if (type === "object") return data;
              else return correctReturn();
            case "jsonArray":
              const parsedData = JSON.parse(data);
              type = typeof parsedData;
              if (type === "object" && parsedData.length) return data;
              else return correctReturn();
            default:
              return correctReturn();
          }
        } else {
          // console.warn(`index ${val} is not valid.`, `${val} : ${data}`);
          return correctReturn();
        }
      }
    }
  } catch (err) {
    return correctReturn();
  }
}
