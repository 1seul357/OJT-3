const getItem = (key: string) => {
  const value = localStorage.getItem(key);
  return value;
};

const setItem = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export default { getItem, setItem };
