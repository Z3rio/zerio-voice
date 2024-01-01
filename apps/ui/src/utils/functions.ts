// browser comp
const getResourceName = (): string => {
  try {
    //@ts-ignore
    return GetParentResourceName();
  } catch {
    return "zerio-voice";
  }
};

export const postRequest = async (evName: string, data: any = {}) => {
  const rawResp = await fetch(`https://${getResourceName()}/${evName}`, {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json; charset=UTF8",
    },
    method: "POST",
  });

  return await rawResp.json();
};
