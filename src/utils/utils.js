import dayjs from 'dayjs';

export const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});

// eslint-disable-next-line max-len
export const mergeArrayWithObject = (arr, obj) => arr && arr.map((t) => (t.id === obj.id ? obj : t));

export const parseDate = (isoDate, format = 'D MMM HH:mm') => {
  const date = dayjs(isoDate);
  return date.format(format);
};
