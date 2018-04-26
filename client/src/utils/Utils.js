const getDate = d => {
  return new Date(d);
};

const getDateStr = d => {
  if (!d) return '';

  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  };
  return new Intl.DateTimeFormat('ru-RU', options).format(new Date(d));
};

const getUpdateStr = d => {
  if (!d) return '';
  return `Обновлено: ${getDateStr(d)}`;
};

module.exports = {
  getDate,
  getDateStr,
  getUpdateStr
};
