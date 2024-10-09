export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      resolve(ValidateData(reader.result as string) as string);
    reader.onerror = (error) => reject(error);
  });
};
export function ValidateData(data: string) {
  return data.replace(/^data:[a-zA-Z]+\/[a-zA-Z]+;base64,/, "");
}
